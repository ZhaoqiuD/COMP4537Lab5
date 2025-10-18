// ChatGPT-4o-mini assisted (https://chat.openai.com/)

import { MSG } from './messages.js';

export class SqlController {
  constructor(db, validator, samplePatients) {
    this.db = db;
    this.validator = validator;
    this.samplePatients = samplePatients || [];
  }

  async getSqlResponse(sql) {
    if (!this.validator.isSelect(sql)) {
      return { status: 400, body: { error: MSG.onlySelectOnGet } };
    }
    if (this.validator.containsForbidden(sql)) {
      return { status: 403, body: { error: MSG.forbidden } };
    }
    try {
      const rows = await this.db.query(sql);
      return { status: 200, body: { rows } };
    } catch (err) {
      return { status: 400, body: { error: `DB error: ${err.message}` } };
    }
  }

  async postSqlResponse(sql) {
    if (!sql) return { status: 400, body: { error: MSG.sqlMissing } };
    if (!this.validator.isInsert(sql)) {
      return { status: 400, body: { error: MSG.onlyInsertOnPost } };
    }
    if (this.validator.containsForbidden(sql)) {
      return { status: 403, body: { error: MSG.forbidden } };
    }
    try {
      const result = await this.db.query(sql);
      const affectedRows = result.affectedRows ?? (Array.isArray(result) ? 0 : 0);
      const insertId = result.insertId ?? null;
      return { status: 200, body: { affectedRows, insertId } };
    } catch (err) {
      return { status: 400, body: { error: `Error: ${err.message}` } };
    }
  }

  async seedResponse() {
    try {
      let affected = 0;
      for (const p of this.samplePatients) {
        const sql = `INSERT INTO patient (first_name, last_name, dob, gender, phone, email, address)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [
          p.first_name,
          p.last_name,
          p.dob,
          p.gender,
          p.phone,
          p.email,
          p.address,
        ];
        const r = await this.db.execute(sql, params);
        affected += r.affectedRows || 0;
      }
      return { status: 200, body: { message: `Inserted ${affected} sample rows.` } };
    } catch (err) {
      return { status: 400, body: { error: `DB error: ${err.message}` } };
    }
  }
}

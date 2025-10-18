// ChatGPT-4o-mini assisted (https://chat.openai.com/)

import { createPool } from 'mysql2/promise';

export class Database {
  constructor(cfg) {
    this.cfg = cfg;
    this.pool = null;
  }

  async init() {
    const bootstrap = createPool({
      host: this.cfg.host,
      port: this.cfg.port,
      user: this.cfg.user,
      password: this.cfg.password,
      connectionLimit: 5,
    });
    await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${this.cfg.database}\``);
    await bootstrap.end();

    this.pool = createPool({
      host: this.cfg.host,
      port: this.cfg.port,
      user: this.cfg.user,
      password: this.cfg.password,
      database: this.cfg.database,
      connectionLimit: 10,
    });
  }

  async ensureSchema() {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS patient (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        phone VARCHAR(50) NULL,
        email VARCHAR(150) NULL,
        address VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;
    await this.query(createTableSql);
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }

  async execute(sql, params = []) {
    const [result] = await this.pool.execute(sql, params);
    return result;
  }

  async close() {
    if (this.pool) await this.pool.end();
  }
}


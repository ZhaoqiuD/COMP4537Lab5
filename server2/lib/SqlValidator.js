// ChatGPT-4o-mini assisted (https://chat.openai.com/)

export class SqlValidator {
  constructor(blocklist = null) {
    this.blocklist = blocklist ?? [
      'DROP ',
      'DELETE ',
      'UPDATE ',
      'ALTER ',
      'TRUNCATE ',
      'CREATE ',
      'RENAME ',
      'GRANT ',
      'REVOKE ',
    ];
  }

  isSelect(sql) {
    const s = this.#normalize(sql);
    return s.startsWith('SELECT');
  }

  isInsert(sql) {
    const s = this.#normalize(sql);
    return s.startsWith('INSERT');
  }

  containsForbidden(sql) {
    const s = this.#normalize(sql);
    return this.blocklist.some((kw) => s.includes(kw));
  }

  #normalize(s) {
    return String(s || '')
      .trim()
      .replace(/^;+|;+$/g, '')
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }
}


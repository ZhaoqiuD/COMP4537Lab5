// ChatGPT-4o-mini assisted (https://chat.openai.com/)

import http from 'http';
import { URL } from 'url';

export class ApiServer {
  constructor(config, controller) {
    this.config = config;
    this.controller = controller;
    this.server = null;
  }

  start() {
    this.server = http.createServer((req, res) => {
      this.#route(req, res).catch((err) => {
        this.#sendJson(res, 500, { error: `Internal Server Error: ${err.message}` });
      });
    });
    this.server.listen(this.config.port, this.config.host, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://${this.config.host}:${this.config.port}`);
    });
  }

  async #route(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'OPTIONS') return this.#handleOptions(res);

    if (req.method === 'GET' && url.pathname.toLowerCase().startsWith('/api/v1/sql/')) {
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex((p) => p.toLowerCase() === 'sql');
      if (idx === -1 || idx === parts.length - 1) {
        return this.#bad(res, 'SQL not provided in URL.');
      }
      const encodedQuery = parts.slice(idx + 1).join('/');
      const sql = decodeURIComponent(encodedQuery);
      const { status, body } = await this.controller.getSqlResponse(sql);
      return this.#sendJson(res, status, body);
    }

    if (req.method === 'POST' && url.pathname.toLowerCase() === '/api/v1/sql') {
      const body = await this.#readJson(req).catch((e) => ({ __err: e }));
      if (body && body.__err) return this.#bad(res, String(body.__err?.message || body.__err));
      const { sql } = body || {};
      const { status, body: resp } = await this.controller.postSqlResponse(sql);
      return this.#sendJson(res, status, resp);
    }

    if ((req.method === 'POST' || req.method === 'GET') && url.pathname.toLowerCase() === '/api/v1/seed') {
      const { status, body } = await this.controller.seedResponse();
      return this.#sendJson(res, status, body);
    }

    if (req.method === 'GET' || req.method === 'POST') return this.#notFound(res);
    return this.#methodNotAllowed(res);
  }

  #handleOptions(res) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': this.config.allowOrigin,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
  }

  async #readJson(req) {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
        if (data.length > 1_000_000) {
          req.destroy();
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  }

  #sendJson(res, status, data) {
    const body = JSON.stringify(data);
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': this.config.allowOrigin,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(body);
  }

  #ok(res, data) { this.#sendJson(res, 200, data); }
  #bad(res, message) { this.#sendJson(res, 400, { error: message }); }
  #notFound(res) { this.#sendJson(res, 404, { error: 'Not Found' }); }
  #methodNotAllowed(res) { this.#sendJson(res, 405, { error: 'Method Not Allowed' }); }
}

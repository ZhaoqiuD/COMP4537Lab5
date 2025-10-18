Lab 5 API (Server2)

Overview
- Plain Node `http` server (no Express) that:
  - Creates MySQL/MariaDB DB and `patient` table with `ENGINE=InnoDB` on startup
  - GET `/api/v1/sql/<encoded SQL>` for SELECT queries only
  - POST `/api/v1/sql` with JSON `{ "sql": "INSERT ..." }` for INSERT only
  - POST `/api/v1/seed` to insert predefined sample rows
  - CORS enabled (configure `CORS_ALLOW_ORIGIN`)

Setup
1) Install deps:
   npm install

2) Configure DB via env (or use defaults):
   - DB_HOST (default: localhost)
   - DB_PORT (default: 3306)
   - DB_USER (default: root)
   - DB_PASSWORD (default: empty)
   - DB_NAME (default: lab5db)
   - API_HOST (default: 0.0.0.0)
   - API_PORT (default: 8080)
   - CORS_ALLOW_ORIGIN (default: *)

3) Start server:
   npm start

Example URLs
- SELECT via GET (URL-encode the SQL):
  http://localhost:8080/api/v1/sql/select%20*%20from%20patient

- INSERT via POST (JSON body):
  POST http://localhost:8080/api/v1/sql
  { "sql": "INSERT INTO patient (first_name, last_name, dob, gender) VALUES ('Ann','Lee','1999-09-09','F')" }

- Seed sample rows (POST):
  POST http://localhost:8080/api/v1/seed

Security and Limits
- Only SELECT allowed on GET; only INSERT allowed on POST.
- UPDATE/DELETE/DROP/ALTER/TRUNCATE/CREATE/RENAME/GRANT/REVOKE blocked.
- Multiple statements are disabled by default in mysql2.

Attribution
- ChatGPT-4o-mini (https://chat.openai.com/) assisted in writing this code.


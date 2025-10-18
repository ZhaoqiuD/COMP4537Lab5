Lab 5 — Two-Origin Patient DB App

Overview
- server1: Static client (HTML/JS) with:
  - Button to insert sample rows
  - Textarea to submit SQL (SELECT via GET, INSERT via POST)
  - Displays JSON responses
- server2: Plain Node http API (no Express) with MySQL/MariaDB:
  - Auto-creates DB + `patient` table (ENGINE=InnoDB) if missing
  - GET `/api/v1/sql/<encoded SQL>` → SELECT only
  - POST `/api/v1/sql` with `{ sql: "INSERT ..." }` → INSERT only
  - POST/GET `/api/v1/seed` → insert predefined sample rows
  - Blocks `DROP/DELETE/UPDATE/ALTER/TRUNCATE/CREATE/RENAME/GRANT/REVOKE`
  - CORS enabled (configurable)

What’s Implemented (for the rubric)
- Different origins (client vs API) supported and tested
- DB/table creation on server startup with `ENGINE=InnoDB`
- Client distinguishes GET vs POST for SELECT/INSERT
- Server rejects non‑SELECT on GET and non‑INSERT on POST
- Hard blocklist to prevent destructive statements
- No routing libraries used (plain `http`), allowed DB driver (`mysql2/promise`)
- OOP server structure: `Database`, `SqlValidator`, `SqlController`, `ApiServer`

Prerequisites
- Node.js 18+
- MariaDB/MySQL, recommended via Docker Desktop

Option A: MariaDB via Docker (recommended)
1) Create and run a DB container on host port 3307 (avoids local 3306 conflicts):
   docker volume create mariadb_data
   docker run --name lab5-mariadb -e MARIADB_ROOT_PASSWORD=rootpass -e MARIADB_DATABASE=lab5db -p 3307:3306 -v mariadb_data:/var/lib/mysql -d mariadb:11.4
2) Verify logs:
   docker logs -f lab5-mariadb
   # Wait for "ready for connections"
3) Optional: create a non‑root user inside MariaDB shell
   docker exec -it lab5-mariadb mariadb -uroot -p
   # password: rootpass
   CREATE USER IF NOT EXISTS 'lab5'@'%' IDENTIFIED BY 'lab5pass';
   GRANT ALL PRIVILEGES ON lab5db.* TO 'lab5'@'%';
   FLUSH PRIVILEGES; EXIT;

Option B: Native MariaDB install
- Install from https://mariadb.org/download, ensure service runs on 3306
- Create DB `lab5db` and a user or use root (remember the password)

Install and Run — API (server2)
1) Open a terminal in `server2`
   cd server2
   npm install
2) Set environment variables and start. Use ONE of the following blocks:

   PowerShell (using the lab5 user):
   $env:DB_HOST="127.0.0.1"
   $env:DB_PORT="3307"              # use 3306 if native install
   $env:DB_USER="lab5"
   $env:DB_PASSWORD="lab5pass"
   $env:DB_NAME="lab5db"
   $env:API_HOST="0.0.0.0"
   $env:API_PORT="8080"
   $env:CORS_ALLOW_ORIGIN="http://127.0.0.1:5500"
   npm start

   Command Prompt (cmd.exe):
   set DB_HOST=127.0.0.1
   set DB_PORT=3307
   set DB_USER=lab5
   set DB_PASSWORD=lab5pass
   set DB_NAME=lab5db
   set API_HOST=0.0.0.0
   set API_PORT=8080
   set CORS_ALLOW_ORIGIN=http://127.0.0.1:5500
   npm start

3) On startup, the server will create the database (if missing), ensure the `patient` table exists with `ENGINE=InnoDB`, and then listen at `http://localhost:8080`.

Install and Run — Client (server1)
1) Serve statically from a different origin than the API. Examples:
   Python 3 quick server from repo root:
   python -m http.server 5500 -d server1
   Open: http://127.0.0.1:5500/server1/index.html
2) In the page, the API base is prefilled to `http://localhost:8080`. If not, set it.
3) Click “Insert Sample Rows (POST)” to seed, then run `SELECT * FROM patient`.

Manual API Tests (browser)
- Seed: http://localhost:8080/api/v1/seed   (POST or GET supported)
- Read: http://localhost:8080/api/v1/sql/select%20*%20from%20patient

Troubleshooting
- Access denied / wrong creds: Ensure DB vars match the running DB (host, port, user, password).
- Port conflicts:
  - If 3306 is busy, run Docker on `-p 3307:3306` and set `DB_PORT=3307`.
- CORS blocked: Set `CORS_ALLOW_ORIGIN` to your client’s origin (e.g., `http://127.0.0.1:5500`).
- Seed via browser not working: Use `/api/v1/seed` (we allow GET+POST for convenience). In production, you can restrict to POST only in `server2/lib/ApiServer.js`.

Project Layout
- server1/index.html — Client UI
- server2/server.js — Entry point wiring classes
- server2/lib/Database.js — DB pool + schema creation
- server2/lib/SqlValidator.js — Checks for SELECT/INSERT and blocks dangerous SQL
- server2/lib/SqlController.js — Handles SELECT/INSERT/seed actions
- server2/lib/ApiServer.js — HTTP server, routing, CORS, JSON I/O
- server1/README.md, server2/README.md — Component-specific notes

Submission Notes
- Deliver `server1` and `server2` inside a folder named `YourTeam#Lab5` and zip it.
- In Learning Hub comments, include:
  - Client URL (server1)
  - API URL with working GET example: `https://YourDomain/.../api/v1/sql/select%20*%20from%20patient`
- Attribution (required if you used ChatGPT):
  - "ChatGPT-4o-mini (https://chat.openai.com/) was used to help code solutions for this assignment."

Attribution
- ChatGPT-4o-mini assisted in creating code and documentation.


// ChatGPT-4o-mini was used to help write this file (https://chat.openai.com/)

import { DB, SERVER, SAMPLE_PATIENTS } from './config.js';
import { Database } from './lib/Database.js';
import { SqlValidator } from './lib/SqlValidator.js';
import { SqlController } from './lib/SqlController.js';
import { ApiServer } from './lib/ApiServer.js';

async function main() {
  const db = new Database(DB);
  await db.init();
  await db.ensureSchema();

  const validator = new SqlValidator();
  const controller = new SqlController(db, validator, SAMPLE_PATIENTS);
  const api = new ApiServer(SERVER, controller);
  api.start();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Startup error:', err);
  process.exit(1);
});

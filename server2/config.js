// ChatGPT-4o-mini was used to help write this file (https://chat.openai.com/)

export const SERVER = {
  // Bind to all interfaces by default
  host: process.env.API_HOST || '0.0.0.0',
  port: Number(process.env.API_PORT || 8080),
  // CORS: set to specific origin in production (e.g., https://your-client.example)
  allowOrigin: process.env.CORS_ALLOW_ORIGIN || '*',
};

export const DB = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lab5db',
};

// Predefined sample rows inserted by the client button
export const SAMPLE_PATIENTS = [
  {
    first_name: 'John',
    last_name: 'Doe',
    dob: '1985-04-12',
    gender: 'M',
    phone: '555-111-2222',
    email: 'john.doe@example.com',
    address: '123 Maple St, Smalltown, ON',
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
    dob: '1990-08-23',
    gender: 'F',
    phone: '555-333-4444',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Bigcity, BC',
  },
  {
    first_name: 'Alex',
    last_name: 'Kim',
    dob: '1979-12-30',
    gender: 'O',
    phone: '555-555-6666',
    email: 'alex.kim@example.com',
    address: '789 Pine Rd, Midtown, AB',
  },
];

// User-facing messages consolidated here
export const MESSAGES = {
  invalidMethod: 'Method Not Allowed',
  invalidRoute: 'Not Found',
  onlySelectOnGet: 'Only SELECT queries are allowed via GET.',
  onlyInsertOnPost: 'Only INSERT queries are allowed via POST.',
  sqlMissing: 'SQL is missing in request body.',
  forbidden: 'Forbidden: Only SELECT or INSERT allowed.',
};

// Very conservative SQL allowlist checks
export function isSelect(sql) {
  const s = normalize(sql);
  return s.startsWith('SELECT');
}

export function isInsert(sql) {
  const s = normalize(sql);
  return s.startsWith('INSERT');
}

export function containsForbidden(sql) {
  const s = normalize(sql);
  const blocked = [
    'DROP ',
    'DELETE ',
    'UPDATE ',
    'ALTER ',
    'TRUNCATE ',
    'CREATE ', // prevent DDL via raw SQL endpoint
    'RENAME ',
    'GRANT ',
    'REVOKE ',
  ];
  return blocked.some((kw) => s.includes(kw));
}

function normalize(s) {
  return String(s || '')
    .trim()
    .replace(/^;+|;+$/g, '') // strip leading/trailing semicolons
    .replace(/\s+/g, ' ')
    .toUpperCase();
}


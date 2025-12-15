import mockJobs from '../data/mockJobs.json';

interface Env {
  DB: D1Database;
}

export const createTablesSQL = `
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  workingPeriod TEXT,
  contactPhone TEXT
);

CREATE TABLE IF NOT EXISTS __migrations (
  key TEXT PRIMARY KEY,
  value TEXT
);
`;

export async function bootstrap(env: Env) {
  const db = env.DB;
  const seeded = await db.prepare('SELECT value FROM __migrations WHERE key = ?').bind('seeded_jobs').first<{ value: string }>();
  if (seeded) return;

  const ddls = createTablesSQL
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s + ';');
  for (const sql of ddls) {
    await db.prepare(sql).run();
  }

  // 插入 mockJobs 数据
  const insertJob = db.prepare(
    'INSERT OR IGNORE INTO jobs (id, title, company, location, salary, type, description, duration, workingPeriod, contactPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const mockJobs = require('../data/mockJobs.json');
  for (const job of mockJobs) {
    await insertJob.bind(
      job.id,
      job.title,
      job.company,
      job.location,
      job.salary,
      job.type,
      job.description,
      job.duration,
      job.workingPeriod ?? null,
      job.contactPhone ?? null
    ).run();
  }

  await db.prepare('CREATE TABLE IF NOT EXISTS __migrations (key TEXT PRIMARY KEY, value TEXT)').run();
  await db.prepare('INSERT OR REPLACE INTO __migrations (key, value) VALUES (?, ?)').bind('seeded_jobs', new Date().toISOString()).run();
}

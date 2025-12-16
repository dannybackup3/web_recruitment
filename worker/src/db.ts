import mockJobs from '../data/mockJobs.json';

interface Env {
  DB: D1Database;
}

export async function bootstrap(env: Env) {
  const db = env.DB;

  // ✅ 1. 先确保 migrations 表存在
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS __migrations (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  // ✅ 2. 再检查是否已 seed
  const seeded = await db
    .prepare('SELECT value FROM __migrations WHERE key = ?')
    .bind('seeded_jobs')
    .first<{ value: string }>();

  if (seeded) return;

  // ✅ 3. 创建 jobs 表
  await db.prepare(`
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
    )
  `).run();

  // ✅ 4. seed 数据
  const insertJob = db.prepare(
    `INSERT OR IGNORE INTO jobs
     (id, title, company, location, salary, type, description, duration, workingPeriod, contactPhone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const job of mockJobs as any[]) {
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

  // ✅ 5. 写 migration 标记
  await db.prepare(
    'INSERT OR REPLACE INTO __migrations (key, value) VALUES (?, ?)'
  ).bind('seeded_jobs', new Date().toISOString()).run();
}

import { bootstrap } from './db';

interface Env {
  DB: D1Database;
}

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// ✅ CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // 或者替换为你的前端域名
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ✅ 生成 ETag (使用简单的哈希)
function generateETag(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为 32 位整数
  }
  return `"${Math.abs(hash).toString(16)}"`;
}

// ✅ 获取合理的 cache max-age（根据端点类型）
function getCacheMaxAge(path: string): number {
  if (path === '/daily-word') return 600; // 10 分钟，动态内容
  if (path === '/daily-words') return 3600; // 1 小时
  if (path.includes('/lessons') || path.includes('/flashcards')) return 3600;
  return 3600;
}

// ✅ JSON 响应统一带 CORS 和 Cache-Control
function json(data: unknown, req?: Request, path?: string, init?: ResponseInit) {
  const dataStr = JSON.stringify(data);
  const eTag = generateETag(dataStr);

  const maxAge = path ? getCacheMaxAge(path) : 3600;
  const cacheControl = `public, max-age=${maxAge}`;

  // 检查 ETag 缓存验证 (304 Not Modified)
  if (req) {
    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch === eTag) {
      return new Response(null, {
        status: 304,
        headers: {
          'cache-control': cacheControl,
          'etag': eTag,
          ...corsHeaders(),
        },
      });
    }
  }

  return new Response(dataStr, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cacheControl,
      'etag': eTag,
      ...corsHeaders(),
      ...(init?.headers || {}),
    },
    status: init?.status || 200,
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      await bootstrap(env);

      const url = new URL(req.url);
      const path = url.pathname.replace(/\/$/, '');

      if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders() });
      }

      // GET /jobs
      if (req.method === 'GET' && path === '/jobs') {
        const { results } = await env.DB.prepare('SELECT * FROM jobs ORDER BY CAST(id AS INTEGER) ASC').all();
        return json(results, req, path);
      }

      // POST /jobs
      if (req.method === 'POST' && path === '/jobs') {
        type JobBody = {
          title: string;
          company: string;
          location: string;
          salary: string;
          type: string;
          description: string;
          duration: string;
          workingPeriod?: string;
          contactPhone?: string;
        };
        const body = await req.json() as JobBody;
        const requiredFields: (keyof JobBody)[] = ['title', 'company', 'location', 'salary', 'type', 'description', 'duration'];
        for (const field of requiredFields) {
          if (!body[field]) {
            return json({ error: `Missing required field: ${field}` }, req, path, { status: 400 });
          }
        }
        const id = generateId();
        await env.DB.prepare(
          'INSERT INTO jobs (id, title, company, location, salary, type, description, duration, workingPeriod, contactPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          id,
          body.title,
          body.company,
          body.location,
          body.salary,
          body.type,
          body.description,
          body.duration,
          body.workingPeriod ?? null,
          body.contactPhone ?? null
        ).run();
        return json({ success: true, id }, req, path, { status: 201 });
      }

    } catch (e: any) {
      return json({ message: 'Internal Error', error: String(e?.message || e) }, req, path, { status: 500 });
    }
  },
};

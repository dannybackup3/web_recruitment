# 本地和 API 模式配置指南

这个项目支持两种数据源模式：

## 模式说明

### 本地模式 (Local Mode) - 默认
- 使用 `src/lib/data.ts` 中的 mock 数据
- 不需要任何后端 API
- 适合本地开发测试
- 发布的职位只存储在内存中（刷新页面会丢失）

### API 模式 (API Mode)
- 连接到 Cloudflare Worker 后端 API
- 数据持久化到 D1 数据库
- 适合生产环境
- 需要配置 API 服务地址

## 快速开始

### 本地开发
默认使用本地模式，直接运行开发服务器：

```bash
npm run dev
```

然后访问 http://localhost:9002

### 切换数据源模式

#### 方式 1：UI 切换 (推荐)
1. 打开应用
2. 点击顶部导航栏中的 "本地模式" 或 "API 模式" 按钮
3. 页面会自动重新加载数据

#### 方式 2：环境变量配置
编辑 `.env.local` 文件：

```env
# 本地开发（使用 Next.js API routes）
NEXT_PUBLIC_API_URL=

# 或连接到 Cloudflare Worker
NEXT_PUBLIC_API_URL=https://your-worker-domain.workers.dev
```

## 数据存储

### 本地模式
- 新发布的职位存储在内存中
- 刷新浏览器后数据丢失
- 仅用于测试和演示

### API 模式
- 职位数据存储在 Cloudflare D1 数据库
- 支持持久化存储
- 需要 Cloudflare Worker 后端

## 后端部署

### Cloudflare Worker 部署

1. 安装 Wrangler CLI：
```bash
npm install -g wrangler
```

2. 认证：
```bash
wrangler login
```

3. 部署 Worker：
```bash
cd worker
npm install
wrangler deploy
```

4. 部署后，获取 Worker URL 并配置到 `.env.local`：
```env
NEXT_PUBLIC_API_URL=https://your-worker-url.workers.dev
```

## API 端点

### GET /jobs
获取所有职位列表

**请求：**
```bash
curl https://api-url.workers.dev/jobs
```

**响应：**
```json
[
  {
    "id": "1",
    "title": "建筑结构工",
    "company": "中国建筑第八工程局",
    "location": "北京",
    "salary": "300-450元/天",
    "type": "建筑工",
    "description": "...",
    "duration": "90天",
    "workingPeriod": "7月-9月",
    "contactPhone": "13812345678"
  }
]
```

### POST /jobs
发布新职位

**请求：**
```bash
curl -X POST https://api-url.workers.dev/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "电焊工",
    "company": "XX公司",
    "location": "北京",
    "salary": "400-600元/天",
    "type": "焊工",
    "description": "...",
    "duration": "90天",
    "workingPeriod": "7月-9月",
    "contactPhone": "13812345678"
  }'
```

**响应：**
```json
{
  "success": true,
  "id": "newly-generated-id"
}
```

## 开发与测试

### 测试本地 API
本地开发时，自动使用 `/api/jobs` 端点（Next.js API routes）：

```bash
# 获取职位
curl http://localhost:9002/api/jobs

# 发布职位
curl -X POST http://localhost:9002/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"...","company":"...","location":"...","salary":"...","type":"...","description":"...","duration":"..."}'
```

### 测试 API 模式
1. 在 `.env.local` 中配置 Worker URL
2. 使用 UI 切换到 API 模式
3. 应用会连接到远程 Worker API

## 故障排除

### API 模式连接失败
- 检查 `NEXT_PUBLIC_API_URL` 配置是否正确
- 检查 Worker 是否已部署
- 检查浏览器控制台错误信息
- 自动降级回本地模式（查看控制台日志）

### 数据不同步
- 确认当前使用的模式（UI 显示）
- 尝试刷新页面
- 检查网络请求（浏览器 DevTools Network 标签）

## 架构设计

```
src/
├── lib/
│   ├── config.ts      # 模式配置管理
│   ├── api.ts         # 数据获取抽象层（支持两种模式）
│   └── data.ts        # Mock 数据
├── app/
│   ├── api/
│   │   └── jobs/
│   │       └── route.ts  # 本地 API 路由
│   └── page.tsx       # 主页（使用新的数据获取方式）
└── components/
    └── header.tsx     # 包含模式切换按钮

worker/
├── src/
│   ├── index.ts       # Worker 入口
│   └── db.ts          # 数据库初始化
└── data/
    └── mockJobs.json  # 初始数据
```

## 功能特性

✅ **本地模式** - 开箱即用，无需后端  
✅ **API 模式** - 支持 Cloudflare Worker + D1 数据库  
✅ **模式切换** - UI 按钮快速切换  
✅ **自动降级** - API 失败自动降级到本地数据  
✅ **实时刷新** - 发布职位后自动刷新列表  
✅ **持久化存储** - 支持数据库存储  

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_API_URL` | API 服务地址 | 空（使用相对路径） |

## 相关文件

- `src/lib/config.ts` - 模式配置
- `src/lib/api.ts` - API 抽象层
- `src/app/page.tsx` - 主页组件
- `src/app/api/jobs/route.ts` - 本地 API 路由
- `src/components/header.tsx` - 头部导航（模式切换）
- `worker/src/index.ts` - Worker API

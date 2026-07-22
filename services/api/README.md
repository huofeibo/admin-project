# Project Showcase API

This is a runnable contract/demo backend for the Wuji and Shixu prototypes. It uses seeded in-memory data so the main workflows can be exercised without external services.

## Run

```bash
npm run api
```

Base URL: `http://localhost:8787`

## Endpoints

- `GET /api/health`
- `GET /api/wuji/editions`
- `GET /api/wuji/family/assets`
- `POST /api/wuji/family/assets`
- `GET /api/wuji/business/equipment`
- `POST /api/wuji/business/work-orders`
- `GET /api/shixu/tasks`
- `POST /api/shixu/focus-sessions`

POST endpoints validate required fields and return `201`, `400`, or `422` as appropriate. CORS is enabled for the local prototypes.

## Production Architecture

The production service would use PostgreSQL for tenant and user data, object storage for receipts and repair images, Redis for idempotency and short-lived sessions, and a message queue for reminders and SLA notifications. OAuth/JWT authentication, tenant-scoped authorization, audit logs, rate limiting, schema migrations, backups, and observability are required before production use.

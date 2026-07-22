import http from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.PORT || 8787);

const state = {
  familyAssets: [
    { id: 'WF-24018', name: '海尔双门冰箱', room: '厨房', category: '大家电', warranty: '2027.03.12', state: '正常' },
    { id: 'WF-23106', name: '戴森吸尘器', room: '储物间', category: '清洁电器', warranty: '2026.08.06', state: '临近保修' },
    { id: 'WF-22087', name: '小米空气净化器', room: '卧室', category: '生活电器', warranty: '已过保', state: '待保养' },
    { id: 'WF-25031', name: '索尼电视', room: '客厅', category: '影音设备', warranty: '2028.01.19', state: '正常' }
  ],
  equipment: [
    { id: 'EQ-CY-0048', name: '商用四门冷柜', store: '朝阳店', status: 'temperature_alert' },
    { id: 'EQ-HD-0021', name: '商用制冰机', store: '海淀店', status: 'maintenance_due' }
  ],
  workOrders: [],
  tasks: [
    { id: 'TS-101', title: '复习 ArkTS 状态管理', minutes: 50, status: 'done' },
    { id: 'TS-102', title: '完成天气卡片组件', minutes: 50, status: 'todo' }
  ],
  sessions: []
};

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('invalid_json'); }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = `${req.method} ${url.pathname}`;

  try {
    if (route === 'GET /api/health') return send(res, 200, { status: 'ok', service: 'project-showcase-api', timestamp: new Date().toISOString() });
    if (route === 'GET /api/wuji/editions') return send(res, 200, { items: [
      { id: 'family', clients: ['HarmonyOS'], capabilities: ['assets', 'warranty', 'reminders', 'family-sharing'] },
      { id: 'business', clients: ['Web', 'HarmonyOS'], capabilities: ['equipment', 'inspection', 'work-orders', 'analytics'] }
    ] });
    if (route === 'GET /api/wuji/family/assets') return send(res, 200, { items: state.familyAssets });
    if (route === 'POST /api/wuji/family/assets') {
      const body = await readJson(req);
      if (!body.name || !body.room) return send(res, 422, { error: 'name_and_room_required' });
      const asset = { id: body.id || `WF-${randomUUID().slice(0, 6)}`, state: '正常', ...body };
      state.familyAssets.unshift(asset);
      return send(res, 201, asset);
    }
    if (route === 'GET /api/wuji/business/equipment') return send(res, 200, { items: state.equipment, total: 286 });
    if (route === 'POST /api/wuji/business/work-orders') {
      const body = await readJson(req);
      if (!body.equipmentId || !body.description) return send(res, 422, { error: 'equipmentId_and_description_required' });
      const order = { id: `WO-${randomUUID().slice(0, 8)}`, status: 'pending_response', createdAt: new Date().toISOString(), ...body };
      state.workOrders.push(order);
      return send(res, 201, order);
    }
    if (route === 'GET /api/shixu/tasks') return send(res, 200, { items: state.tasks });
    if (route === 'POST /api/shixu/focus-sessions') {
      const body = await readJson(req);
      if (!body.taskId || !Number.isFinite(body.minutes)) return send(res, 422, { error: 'taskId_and_numeric_minutes_required' });
      const session = { id: `FS-${randomUUID().slice(0, 8)}`, status: 'completed', completedAt: new Date().toISOString(), ...body };
      state.sessions.push(session);
      return send(res, 201, session);
    }
    return send(res, 404, { error: 'route_not_found', path: url.pathname });
  } catch (error) {
    if (error.message === 'invalid_json') return send(res, 400, { error: 'invalid_json' });
    return send(res, 500, { error: 'internal_error' });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Project showcase API listening on http://localhost:${port}`);
});

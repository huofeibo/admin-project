import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Bell, Box,
  BriefcaseBusiness, CalendarClock, Check, ChevronRight, CircleUserRound,
  Cloud, Code2, Database, ExternalLink, FileCheck2, Github, Home, Laptop,
  Layers3, Menu, PackagePlus, Plus, QrCode, Search, Server, ShieldCheck,
  Smartphone, Sparkles, Store, Timer, Trash2, Wrench, X
} from 'lucide-react';

const API_BASE = (import.meta.env.VITE_DEMO_API_BASE_URL || '').replace(/\/+$/, '');

const familySeed = [
  { id: 'WF-24018', name: '海尔双门冰箱', room: '厨房', category: '大家电', warranty: '2027.03.12', state: '正常' },
  { id: 'WF-23106', name: '戴森吸尘器', room: '储物间', category: '清洁电器', warranty: '2026.08.06', state: '临近保修' },
  { id: 'WF-22087', name: '小米空气净化器', room: '卧室', category: '生活电器', warranty: '已过保', state: '待保养' },
  { id: 'WF-25031', name: '索尼电视', room: '客厅', category: '影音设备', warranty: '2028.01.19', state: '正常' }
];

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="/" aria-label="霍延波个人项目首页">
      <span className="brand-symbol">HY</span>
      <span><strong>霍延波</strong><small>Frontend & HarmonyOS</small></span>
    </a>
  );
}

function ArrowLink({ href, children, light = false }) {
  return <a className={`arrow-link ${light ? 'light' : ''}`} href={href}>{children}<ArrowRight size={17} /></a>;
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="portfolio-page">
      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="主导航">
          <a href="#projects">项目</a><a href="#capabilities">能力</a><a href="#architecture">架构</a>
          <a className="nav-cta" href="#projects">浏览项目</a>
        </nav>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="展开导航"><Menu size={21} /></button>
      </header>

      <main>
        <section className="portfolio-hero">
          <div className="hero-copy">
            <p className="eyebrow">个人产品与工程实践 · 持续更新</p>
            <h1>霍延波</h1>
            <p className="hero-role">Frontend & HarmonyOS Developer</p>
            <p className="hero-lede">这里持续收录 Web、HarmonyOS 与云端方向的个人项目，记录从问题定义、产品设计到工程实现与上线迭代的完整过程。</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">查看项目<ArrowRight size={18} /></a>
              <a className="button secondary" href="#architecture">技术架构<Layers3 size={18} /></a>
            </div>
            <div className="hero-proof" aria-label="项目范围">
              <span><strong>持续更新</strong>项目档案</span><span><strong>多端实践</strong>Web · HarmonyOS</span><span><strong>完整链路</strong>设计 · 开发 · 部署</span>
            </div>
          </div>
          <div className="hero-products" aria-label="项目界面预览">
            <a href="/wuji" className="hero-shot hero-shot-wide">
              <img src="/assets/wuji-business-desktop.png" alt="物迹商户版设备管理界面" />
              <span><b>物迹</b> 多场景资产管理</span>
            </a>
            <a href="/demos/focus-plan.html" className="hero-shot hero-shot-small">
              <img src="/assets/shixu-mobile.png" alt="时序移动端学习计划界面" />
              <span><b>时序</b> 计划与专注</span>
            </a>
          </div>
        </section>

        <section className="project-section" id="projects">
          <div className="section-intro"><p className="eyebrow">Selected projects</p><h2>持续生长的产品实践</h2><p>每个项目都从明确的问题和业务闭环出发，并随着设计、开发和部署进度持续更新。</p></div>

          <article className="project-feature wuji-feature">
            <div className="project-story">
              <div className="project-number">01</div><span className="project-label">物迹 · 资产与维保</span>
              <h3>一套底层能力，服务家庭与连锁门店两种场景</h3>
              <p>家庭版聚焦设备档案、保修和保养提醒；商户版聚焦多门店台账、巡检、工单与经营分析。统一云端模型支撑不同权限和工作流。</p>
              <div className="surface-list"><span><Smartphone size={17} />HarmonyOS</span><span><Laptop size={17} />Web Admin</span><span><Cloud size={17} />Cloud API</span></div>
              <ArrowLink href="/wuji">打开物迹产品主页</ArrowLink>
            </div>
            <div className="project-visual wuji-visual">
              <img className="desktop-capture" src="/assets/wuji-business-desktop.png" alt="物迹商户版 Web 管理端" />
              <img className="phone-capture" src="/assets/wuji-family-mobile.png" alt="物迹家庭版 HarmonyOS 原型" />
            </div>
          </article>

          <article className="project-feature shixu-feature">
            <div className="project-visual shixu-visual">
              <img className="desktop-capture" src="/assets/shixu-desktop.png" alt="时序 Web 学习工作台" />
              <img className="phone-capture" src="/assets/shixu-mobile.png" alt="时序 HarmonyOS 移动端原型" />
            </div>
            <div className="project-story">
              <div className="project-number">02</div><span className="project-label">时序 · 学习与专注</span>
              <h3>把计划、执行、计时和复盘放进同一个节奏</h3>
              <p>面向自主学习者，将阶段目标拆为每日学习块，让每次专注自动沉淀到任务与复盘数据中。Web 适合规划，HarmonyOS 端适合随时执行。</p>
              <div className="surface-list"><span><Smartphone size={17} />HarmonyOS</span><span><Laptop size={17} />Web App</span><span><Cloud size={17} />Cloud API</span></div>
              <ArrowLink href="/demos/focus-plan.html">体验时序原型</ArrowLink>
            </div>
          </article>
        </section>

        <section className="capability-band" id="capabilities">
          <div className="section-intro light"><p className="eyebrow">What I build</p><h2>覆盖产品落地的关键层</h2></div>
          <div className="capability-grid">
            <div><Code2 /><strong>Web 前端</strong><p>响应式界面、状态管理、组件设计与复杂业务工作台。</p></div>
            <div><Smartphone /><strong>HarmonyOS</strong><p>ArkUI 交互、端侧数据、通知、扫码与跨设备体验。</p></div>
            <div><Server /><strong>服务端接口</strong><p>REST 契约、数据模型、权限边界与可靠的状态流转。</p></div>
            <div><Sparkles /><strong>产品设计</strong><p>从用户问题、信息架构到可验证原型和交付说明。</p></div>
          </div>
        </section>

        <section className="architecture-section" id="architecture">
          <div className="section-intro"><p className="eyebrow">System thinking</p><h2>不只展示界面，也记录系统如何落地</h2><p>从客户端体验到接口、数据与部署，每个项目都会呈现真实进度和可验证的工程实现。</p></div>
          <div className="architecture-map">
            <div className="arch-column"><span className="arch-kicker">Clients</span><div><Smartphone />HarmonyOS Apps</div><div><Laptop />Web Applications</div></div>
            <ChevronRight className="arch-arrow" />
            <div className="arch-core"><span className="arch-kicker">Cloud API</span><Server size={30} /><strong>Node Service</strong><small>REST · CORS · Validation</small></div>
            <ChevronRight className="arch-arrow" />
            <div className="arch-column"><span className="arch-kicker">Data</span><div><Database />PostgreSQL</div><div><Bell />Notification</div></div>
          </div>
          <div className="architecture-links">{API_BASE && <a href={`${API_BASE}/api/health`} target="_blank" rel="noreferrer">查看 API 健康状态<ExternalLink size={15} /></a>}<a href="/demos/asset-keeper.html">商户端演示<ExternalLink size={15} /></a><a href="/wuji/family-app">家庭端演示<ExternalLink size={15} /></a></div>
        </section>
      </main>

      <footer className="site-footer"><Brand compact /><p>持续更新的个人产品与工程实践</p><span>Beijing</span></footer>
    </div>
  );
}

const editions = {
  family: {
    kicker: 'FOR HOME', title: '让家里的每件重要物品，都有迹可循',
    description: '记录购买凭证、保修日期和保养周期。换手机也不丢档，到期前主动提醒，让家庭资产管理更轻松。',
    stats: [['32', '家庭资产'], ['4', '近期提醒'], ['¥86k', '资产估值']],
    image: '/assets/wuji-family-mobile.png', imageAlt: '物迹家庭版 HarmonyOS 首页', href: '/wuji/family-app', cta: '体验家庭版'
  },
  business: {
    kicker: 'FOR BUSINESS', title: '让每家门店的设备状态，都一目了然',
    description: '统一设备台账、巡检、保养和维修工单，帮助 2 至 20 家门店的连锁商户降低停机风险，沉淀真实维保数据。',
    stats: [['286', '在用设备'], ['97%', '在线率'], ['8', '待处理异常']],
    image: '/assets/wuji-business-desktop.png', imageAlt: '物迹商户版 Web 管理端', href: '/demos/asset-keeper.html', cta: '体验商户版'
  }
};

function WujiSite() {
  const [edition, setEdition] = useState('family');
  const data = editions[edition];
  const family = edition === 'family';

  return (
    <div className={`wuji-site ${family ? 'family-edition' : 'business-edition'}`}>
      <header className="wuji-header">
        <a className="wuji-brand" href="/wuji"><span><Box size={22} /></span><strong>物迹</strong></a>
        <nav><a href="#features">核心能力</a><a href="#flow">使用流程</a><a href="#system">技术架构</a><a href="/">开发者作品集</a></nav>
        <a className="button small" href={data.href}>打开原型<ExternalLink size={16} /></a>
      </header>

      <main>
        <section className="wuji-hero">
          <div className="wuji-hero-copy">
            <div className="edition-switch" aria-label="选择物迹版本">
              <button className={family ? 'active' : ''} onClick={() => setEdition('family')}><Home size={17} />家庭版</button>
              <button className={!family ? 'active' : ''} onClick={() => setEdition('business')}><Store size={17} />商户版</button>
            </div>
            <p className="eyebrow">{data.kicker} · HARMONYOS + CLOUD</p>
            <h1>{data.title}</h1><p className="wuji-lede">{data.description}</p>
            <div className="hero-actions"><a className="button primary amber" href={data.href}>{data.cta}<ArrowRight size={18} /></a><a className="button text-button" href="#features">了解能力<ChevronRight size={18} /></a></div>
            <div className="wuji-stats">{data.stats.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}</div>
          </div>
          <div className={`wuji-product-stage ${family ? 'phone-stage' : 'web-stage'}`}>
            <img src={data.image} alt={data.imageAlt} />
            <div className="stage-note"><Activity size={18} /><span><strong>云端状态同步</strong><small>多端数据实时更新</small></span></div>
          </div>
        </section>

        <section className="wuji-feature-band" id="features">
          <div className="section-intro"><p className="eyebrow">{family ? '家庭资产管理' : '门店设备运营'}</p><h2>{family ? '围绕“记得住、找得到、不过期”设计' : '围绕“建档、巡检、处置、复盘”设计'}</h2></div>
          <div className="wuji-feature-grid">
            {(family ? [
              [QrCode, '扫码建档', '扫描铭牌或票据，快速补齐设备档案与购买信息。'],
              [CalendarClock, '到期提醒', '保修、滤芯、保养等关键日期统一进入提醒中心。'],
              [FileCheck2, '凭证归档', '发票、保修卡与维修记录都能回到对应资产。'],
              [ShieldCheck, '家庭共享', '按家庭成员共享查看与维护权限，操作留痕。']
            ] : [
              [Box, '设备台账', '统一资产编码、门店归属、负责人和全生命周期记录。'],
              [FileCheck2, '巡检维保', '开闭店巡检和周期保养自动派发，异常直接转工单。'],
              [Wrench, '维修工单', '从上报、响应、处理到验收，按 SLA 跟踪全过程。'],
              [BarChart3, '经营分析', '对比故障率、停机时间、维保成本和供应商表现。']
            ]).map(([Icon, title, text]) => <article key={title}><Icon /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="wuji-flow" id="flow">
          <div className="flow-copy"><p className="eyebrow">CORE FLOW</p><h2>{family ? '从买回家，到安心使用' : '从设备到店，到维修闭环'}</h2><p>{family ? '每次新增、提醒和维护都会沉淀到资产时间线，重要信息不再散落在相册和聊天记录中。' : '员工扫码即可发起动作，设备主管在 Web 端掌控全局，维修人员在 HarmonyOS 端完成现场处理。'}</p></div>
          <div className="flow-steps">
            {(family ? ['扫描设备', '补齐凭证', '设置提醒', '维护记录'] : ['设备建档', '日常巡检', '故障工单', '经营复盘']).map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < 3 && <ArrowRight />}</div>)}
          </div>
        </section>

        <section className="wuji-system" id="system">
          <div><p className="eyebrow">ONE CLOUD, TWO EDITIONS</p><h2>同一套云能力，为不同规模提供合适界面</h2></div>
          <div className="system-table">
            <div className="system-row header"><span>产品层</span><span>家庭版</span><span>商户版</span></div>
            <div className="system-row"><strong>HarmonyOS App</strong><span><Check />资产与提醒</span><span><Check />扫码、巡检、工单</span></div>
            <div className="system-row"><strong>Web 管理端</strong><span className="muted-cell">轻量家庭门户</span><span><Check />多门店运营后台</span></div>
            <div className="system-row"><strong>Cloud API</strong><span><Check />档案、附件、通知</span><span><Check />租户、权限、审计</span></div>
          </div>
        </section>
      </main>
      <footer className="wuji-footer"><div className="wuji-brand"><span><Box size={20} /></span><strong>物迹</strong></div><p>家庭资产与门店设备管理产品原型</p><a href="/">返回作品集<ArrowRight size={16} /></a></footer>
    </div>
  );
}

function FamilyApp() {
  const [view, setView] = useState('home');
  const [assets, setAssets] = useState(familySeed);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', room: '客厅', category: '大家电', warranty: '' });
  const filteredAssets = useMemo(() => assets.filter(item => `${item.name}${item.room}${item.category}`.includes(query)), [assets, query]);

  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/api/wuji/family/assets`).then(r => r.ok ? r.json() : null).then(data => {
      if (data?.items?.length) setAssets(data.items);
    }).catch(() => {});
  }, []);

  function saveAsset(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    const asset = { id: `WF-${String(Date.now()).slice(-5)}`, ...form, state: '正常' };
    setAssets(items => [asset, ...items]);
    if (API_BASE) fetch(`${API_BASE}/api/wuji/family/assets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(asset) }).catch(() => {});
    setDialogOpen(false); setForm({ name: '', room: '客厅', category: '大家电', warranty: '' }); setToast('资产已保存');
    window.setTimeout(() => setToast(''), 2200);
  }

  const nav = [[Home, 'home', '首页'], [Box, 'assets', '资产'], [Bell, 'alerts', '提醒'], [CircleUserRound, 'mine', '我的']];

  return (
    <div className="family-demo-page">
      <div className="demo-toolbar"><a href="/wuji"><ArrowLeft size={17} />返回物迹官网</a><span>物迹家庭版 · HarmonyOS 交互原型</span></div>
      <div className="mobile-prototype family-app">
        <div className="harmony-status"><span>09:41</span><span>5G&nbsp;&nbsp;87%</span></div>
        <header className="family-app-header">
          <div><p>{view === 'home' ? '晚上好，延波' : view === 'assets' ? '家庭资产' : view === 'alerts' ? '提醒中心' : '我的空间'}</p><span>{view === 'home' ? '重要物品，随时有迹可循' : '共 32 件家庭物品'}</span></div>
          <button onClick={() => setView('alerts')} aria-label="查看提醒"><Bell size={21} /><i>4</i></button>
        </header>

        <div className="family-scroll">
          {view === 'home' && <>
            <section className="asset-overview"><div><span>家庭资产估值</span><strong>¥86,420</strong><small>32 件 · 本月新增 2 件</small></div><button onClick={() => setDialogOpen(true)}><Plus size={20} />录入资产</button></section>
            <section className="family-quick"><button onClick={() => setDialogOpen(true)}><span><QrCode /></span><strong>扫码建档</strong><small>识别设备铭牌</small></button><button onClick={() => setView('alerts')}><span><CalendarClock /></span><strong>保修提醒</strong><small>4 项即将到期</small></button><button onClick={() => setView('assets')}><span><FileCheck2 /></span><strong>全部档案</strong><small>发票与维修记录</small></button></section>
            <section className="family-section"><div className="family-section-head"><h2>近期提醒</h2><button onClick={() => setView('alerts')}>查看全部<ChevronRight size={16} /></button></div><div className="reminder-card urgent"><span><AlertTriangle /></span><div><strong>吸尘器延保即将到期</strong><p>戴森 V12 · 还剩 15 天</p></div><b>8月6日</b></div><div className="reminder-card"><span><Wrench /></span><div><strong>净化器滤芯建议更换</strong><p>卧室 · 已运行 2,180 小时</p></div><b>本周</b></div></section>
            <section className="family-section"><div className="family-section-head"><h2>最近资产</h2><button onClick={() => setView('assets')}>全部资产<ChevronRight size={16} /></button></div>{assets.slice(0, 3).map(item => <AssetRow key={item.id} item={item} />)}</section>
          </>}

          {view === 'assets' && <section className="family-section standalone"><div className="mobile-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索名称、房间或分类" /></div><div className="filter-pills"><button className="active">全部</button><button>大家电</button><button>生活电器</button><button>数码</button></div><div className="asset-count">{filteredAssets.length} 件资产</div>{filteredAssets.map(item => <AssetRow key={item.id} item={item} detailed />)}{filteredAssets.length === 0 && <div className="empty-state"><Search /><strong>没有找到相关资产</strong><p>换个关键词试试</p></div>}</section>}

          {view === 'alerts' && <section className="family-section standalone"><div className="alert-summary"><Bell /><div><strong>4 项待处理</strong><p>处理后会同步到资产时间线</p></div></div><h3 className="group-title">即将到期</h3><div className="reminder-card urgent"><span><AlertTriangle /></span><div><strong>吸尘器延保即将到期</strong><p>戴森 V12 · 剩余 15 天</p></div><button onClick={() => setToast('已标记处理')}>处理</button></div><div className="reminder-card"><span><CalendarClock /></span><div><strong>冰箱年度深度清洁</strong><p>厨房 · 计划 8 月 12 日</p></div><button onClick={() => setToast('已顺延 7 天')}>顺延</button></div><h3 className="group-title">保养建议</h3><div className="reminder-card"><span><Wrench /></span><div><strong>净化器滤芯建议更换</strong><p>已运行 2,180 小时</p></div><button onClick={() => setToast('已标记完成')}>完成</button></div></section>}

          {view === 'mine' && <section className="family-section standalone"><div className="profile-block"><span>HY</span><div><strong>延波的家</strong><p>3 位成员 · 北京</p></div><ChevronRight /></div><div className="settings-list"><button><Cloud />云端备份<span>已开启</span></button><button><ShieldCheck />家庭成员与权限<ChevronRight /></button><button><FileCheck2 />数据导出<ChevronRight /></button></div></section>}
        </div>

        <button className={`family-fab ${view === 'assets' ? 'show' : ''}`} onClick={() => setDialogOpen(true)} aria-label="新增资产"><Plus /></button>
        <nav className="family-nav">{nav.map(([Icon, id, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon /><span>{label}</span></button>)}</nav>

        {dialogOpen && <div className="mobile-dialog-backdrop"><form className="mobile-dialog" onSubmit={saveAsset}><div className="mobile-dialog-head"><strong>录入家庭资产</strong><button type="button" onClick={() => setDialogOpen(false)} aria-label="关闭"><X /></button></div><label>资产名称<input autoFocus value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例如：客厅电视" required /></label><div className="two-fields"><label>所在房间<select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}><option>客厅</option><option>厨房</option><option>卧室</option><option>储物间</option></select></label><label>资产分类<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>大家电</option><option>生活电器</option><option>数码设备</option><option>家具</option></select></label></div><label>保修截止日期<input type="date" value={form.warranty} onChange={e => setForm({ ...form, warranty: e.target.value })} /></label><button className="save-asset" type="submit">保存资产</button></form></div>}
        {toast && <div className="family-toast"><Check />{toast}</div>}
      </div>
    </div>
  );
}

function AssetRow({ item, detailed = false }) {
  return <button className="family-asset-row"><span className="asset-icon"><Box /></span><span className="asset-main"><strong>{item.name}</strong><small>{item.room} · {item.category}{detailed ? ` · ${item.id}` : ''}</small></span><span className={item.state === '正常' ? 'asset-state ok' : 'asset-state'}>{item.state}</span><ChevronRight /></button>;
}

function NotFound() {
  return <div className="not-found"><Box /><h1>页面不存在</h1><p>这个演示入口可能已经移动。</p><a className="button primary" href="/">返回作品集</a></div>;
}

export function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/') return <Portfolio />;
  if (path === '/wuji') return <WujiSite />;
  if (path === '/wuji/family-app') return <FamilyApp />;
  return <NotFound />;
}

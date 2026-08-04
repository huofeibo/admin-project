import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Bell, Box,
  BriefcaseBusiness, CalendarClock, Check, ChevronRight, CircleUserRound,
  Cloud, Code2, Database, ExternalLink, FileCheck2, Github, Home, Laptop,
  Layers3, Menu, PackagePlus, Plus, QrCode, Search, Server, ShieldCheck,
  Smartphone, Sparkles, Store, Timer, Trash2, Wrench, X
} from 'lucide-react';
import { BlurText, KineticText, Reveal, ScrollStack, SplitTitle } from './PortfolioMotion.jsx';
import focusPlanMobileImage from './assets/focus-plan-concept-mobile.png';

const HeroScene = lazy(() => import('./HeroScene.jsx'));
const API_BASE = (import.meta.env.VITE_DEMO_API_BASE_URL || '').replace(/\/+$/, '');
const FOCUS_PLAN_URL = (import.meta.env.VITE_FOCUS_PLAN_URL || '').trim() || 'https://sx.huoyb-api.cloud';

const familySeed = [
  { id: 'WF-24018', name: '海尔双门冰箱', room: '厨房', category: '大家电', warranty: '2027.03.12', state: '正常' },
  { id: 'WF-23106', name: '戴森吸尘器', room: '储物间', category: '清洁电器', warranty: '2026.08.06', state: '临近保修' },
  { id: 'WF-22087', name: '小米空气净化器', room: '卧室', category: '生活电器', warranty: '已过保', state: '待保养' },
  { id: 'WF-25031', name: '索尼电视', room: '客厅', category: '影音设备', warranty: '2028.01.19', state: '正常' }
];

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="/" aria-label="Huoyb 个人项目首页">
      <span className="brand-symbol">HYB</span>
      <span><strong>Huoyb</strong><small>全栈与 HarmonyOS</small></span>
    </a>
  );
}

function ArrowLink({ href, children, light = false, ...props }) {
  return <a className={`arrow-link ${light ? 'light' : ''}`} href={href} {...props}>{children}<ArrowRight size={17} /></a>;
}

function DeviceShowcase({ className, desktopSrc, desktopAlt, desktopLabel, phoneSrc, phoneAlt, phoneLabel }) {
  const [activeDevice, setActiveDevice] = useState('');

  function activateDevice(device, event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setActiveDevice(device);
  }

  return (
    <div
      className={`case-visual ${className} ${activeDevice ? `is-device-active device-focus-${activeDevice}` : ''}`.trim()}
      onPointerLeave={() => setActiveDevice('')}
    >
      <div className="device-plane device-plane-web">
        <img className="desktop-capture" src={desktopSrc} alt={desktopAlt} />
        <span className="visual-note device-note-web">{desktopLabel}</span>
      </div>
      <div className="device-plane device-plane-phone">
        <img className="phone-capture" src={phoneSrc} alt={phoneAlt} />
        <span className="visual-note device-note-phone">{phoneLabel}</span>
      </div>
      <span className="device-hotspot device-hotspot-web" aria-hidden="true" onPointerEnter={(event) => activateDevice('web', event)} onPointerDown={(event) => activateDevice('web', event)} />
      <span className="device-hotspot device-hotspot-phone" aria-hidden="true" onPointerEnter={(event) => activateDevice('phone', event)} onPointerDown={(event) => activateDevice('phone', event)} />
    </div>
  );
}

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const progressRef = useRef(null);

  const projects = [
    {
      number: '01',
      name: '物迹',
      english: 'Asset Keeper',
      category: '资产管理',
      summary: '家庭资产与门店设备管理',
      role: '产品设计 / 全栈开发 / HarmonyOS',
      stack: 'React / ArkTS / Node.js',
      year: '2026',
      href: '/wuji',
      cover: '/assets/wuji-project-cover.svg',
      mobile: '/assets/wuji-family-mobile.png',
      mobileAlt: '物迹家庭版 HarmonyOS 原型',
      coverAlt: '物迹项目封面：家庭资产、门店设备与云端协同',
      visualClass: 'wuji-visual'
    },
    {
      number: '02',
      name: '时序',
      english: 'Focus Plan',
      category: '专注计划',
      summary: '学习计划、专注执行与周期复盘',
      role: '产品设计 / 全栈开发 / HarmonyOS',
      stack: 'React / ArkTS / WebSocket',
      year: '2026',
      href: FOCUS_PLAN_URL,
      cover: '/assets/focus-plan-project-cover.svg',
      mobile: focusPlanMobileImage,
      mobileAlt: '时序 HarmonyOS 移动端原型',
      coverAlt: '时序项目封面：计划编排、专注执行与周期复盘',
      visualClass: 'shixu-visual'
    }
  ];

  const currentProject = projects[activeProject];

  useEffect(() => {
    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    }
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="portfolio-page">
      <div className="site-progress" ref={progressRef} aria-hidden="true" />
      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="主导航">
          <a href="#projects" onClick={() => setMenuOpen(false)}>项目</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>关于</a>
          <a href="https://github.com/huofeibo" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? '关闭导航' : '展开导航'}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </header>

      <main>
        <section className="portfolio-hero">
          <div className="hero-light-rays" aria-hidden="true"><i /><i /><i /></div>
          <Suspense fallback={<div className="hero-scene hero-scene-loading" aria-hidden="true"><img className="hero-scene-fallback" src="/assets/wuji-business-desktop.png" alt="" /></div>}>
            <HeroScene activeIndex={activeProject} onActiveChange={setActiveProject} />
          </Suspense>
          <div className="hero-copy">
            <h1><SplitTitle text="Huoyb" /></h1>
            <p className="hero-role"><BlurText delay={180}>全栈与 HarmonyOS 开发者</BlurText></p>
            <div className="hero-active-project" aria-live="polite">
              <span>{currentProject.number}</span>
              <div><strong>{currentProject.name}</strong><small>{currentProject.summary}</small></div>
            </div>
            <a className="hero-project-link" href={currentProject.href}>查看项目<ArrowRight size={17} /></a>
          </div>
          <div className="hero-project-switcher" aria-label="切换项目">
            {projects.map((project, index) => (
              <button key={project.name} className={index === activeProject ? 'active' : ''} onClick={() => setActiveProject(index)} aria-pressed={index === activeProject}>
                <span>{project.number}</span><strong>{project.name}</strong><small>{project.category}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="project-section" id="projects">
          <Reveal className="project-intro">
            <h2 className="project-effect-title" aria-label="项目与界面"><KineticText text="项目与界面" /></h2>
          </Reveal>

          <ScrollStack className="project-stack">
            {projects.map((project) => (
              <article className={`project-case project-${project.number}`} key={project.name}>
                <div className="case-meta"><span>{project.number}</span><span>{project.year}</span></div>
                <div className="case-body">
                  <div className="project-story">
                    <p className="project-category">{project.category}</p>
                    <h3>{project.name}</h3>
                    <p className="project-summary">{project.summary}</p>
                    <dl className="project-facts"><div><dt>负责</dt><dd>{project.role}</dd></div><div><dt>技术</dt><dd>{project.stack}</dd></div></dl>
                    <ArrowLink href={project.href}>查看项目</ArrowLink>
                  </div>
                  <DeviceShowcase className={project.visualClass} desktopSrc={project.cover} desktopAlt={project.coverAlt} desktopLabel={`${project.english.toUpperCase()} / COVER`} phoneSrc={project.mobile} phoneAlt={project.mobileAlt} phoneLabel="HARMONYOS / MOBILE" />
                </div>
              </article>
            ))}
          </ScrollStack>
          <Reveal className="portfolio-profile" delay={80}>
            <h2 className="about-effect-title" id="about" aria-label="全栈开发，也做 HarmonyOS">
              <KineticText text="全栈开发，" />
              <KineticText text="也做 HarmonyOS" className="accent" />
            </h2>
            <div className="toolbox" aria-label="主要技术方向">
              <span>React</span><span>ArkTS</span><span>Three.js</span><span>Node.js</span><span>PostgreSQL</span><span>产品设计</span>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer"><Brand compact /><p>个人作品, 2024-2026</p><a href="https://github.com/huofeibo" target="_blank" rel="noreferrer"><Github size={16} />GitHub</a><span>北京</span></footer>
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

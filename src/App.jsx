import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Bell, Box,
  BriefcaseBusiness, CalendarClock, Check, ChevronRight, CircleUserRound,
  Cloud, Code2, Database, ExternalLink, FileCheck2, Github, Home, Laptop,
  Layers3, Menu, PackagePlus, Plus, QrCode, Search, Server, ShieldCheck,
  Smartphone, Sparkles, Store, Timer, Trash2, Wrench, X
} from 'lucide-react';
import { Reveal, ScrollStack, SplitTitle } from './PortfolioMotion.jsx';
import focusPlanDesktopImage from './assets/focus-plan-concept-desktop.png';
import focusPlanMobileImage from './assets/focus-plan-concept-mobile.png';

const HeroScene = lazy(() => import('./HeroScene.jsx'));
const API_BASE = (import.meta.env.VITE_DEMO_API_BASE_URL || '').replace(/\/+$/, '');
const FOCUS_PLAN_URL = (import.meta.env.VITE_FOCUS_PLAN_URL || '').trim() || '/demos/focus-plan.html';

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
  const progressRef = useRef(null);

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
          <a href="#projects" onClick={() => setMenuOpen(false)}>项目</a><a href="#capabilities" onClick={() => setMenuOpen(false)}>能力</a><a href="#architecture" onClick={() => setMenuOpen(false)}>架构</a>
          <a className="nav-cta" href="#projects" onClick={() => setMenuOpen(false)}>浏览项目<ArrowRight size={15} /></a>
        </nav>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? '关闭导航' : '展开导航'}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </header>

      <main>
        <section className="portfolio-hero">
          <Suspense fallback={<div className="hero-scene hero-scene-loading" aria-hidden="true"><img className="hero-scene-fallback" src="/assets/wuji-business-desktop.png" alt="" /></div>}>
            <HeroScene />
          </Suspense>
          <div className="hero-stage-word" aria-hidden="true">SYSTEMS</div>
          <div className="hero-media-label" aria-hidden="true"><span>SELECTED PRODUCT SURFACES</span><b>WEB · HARMONYOS · CLOUD</b></div>
          <div className="hero-copy">
            <p className="hero-kicker"><span />PERSONAL PRODUCT LAB · BEIJING</p>
            <h1><SplitTitle text="霍延波" /></h1>
            <p className="hero-role">Frontend & HarmonyOS Developer</p>
            <p className="hero-lede">把真实问题做成可以运行、验证和持续迭代的多端产品。</p>
            <div className="hero-actions">
              <a className="button hero-primary" href="#projects">进入项目档案<ArrowRight size={18} /></a>
              <a className="button hero-secondary" href="#architecture">查看实现路径<Layers3 size={18} /></a>
            </div>
            <div className="hero-proof" aria-label="实践范围">
              <span><strong>02</strong>产品持续开发</span><span><strong>03</strong>Web · HarmonyOS · API</span><span><strong>01</strong>设计到部署</span>
            </div>
          </div>
          <div className="hero-project-rail" aria-label="精选项目">
            <a href="/wuji"><span>01</span><strong>物迹</strong><small>资产与维保</small></a>
            <a href={FOCUS_PLAN_URL}><span>02</span><strong>时序</strong><small>计划与专注</small></a>
          </div>
          <a className="hero-scroll-cue" href="#projects">
            <span>SCROLL TO EXPLORE</span><i aria-hidden="true" />
          </a>
        </section>

        <section className="project-section" id="projects">
          <Reveal className="section-intro project-intro"><p className="eyebrow">SELECTED SYSTEMS / 01-02</p><h2>不是概念包装，<br />是持续推进的产品现场。</h2><p>每个项目都保留问题定义、交互取舍、代码边界和真实开发状态。</p></Reveal>

          <ScrollStack className="project-stack">
            <article className="project-case wuji-case" key="wuji">
              <div className="case-meta"><span>01 / ASSET KEEPER</span><span className="case-status"><i />规划与交互原型</span></div>
              <div className="case-body">
                <div className="project-story">
                  <span className="project-label">物迹 · 资产与维保</span>
                  <h3>让家庭物品与门店设备，都拥有可追溯的生命周期。</h3>
                  <p>家庭版聚焦档案、保修与提醒；商户版连接多门店台账、巡检和维修工单。两种产品形态共享资产模型与云端能力。</p>
                  <div className="surface-list"><span><Smartphone size={17} />HarmonyOS</span><span><Laptop size={17} />Web Admin</span><span><Cloud size={17} />Cloud API</span></div>
                  <div className="case-links"><ArrowLink href="/wuji">打开产品主页</ArrowLink><ArrowLink href="https://github.com/huofeibo/asset-keeper" target="_blank" rel="noreferrer">查看仓库</ArrowLink></div>
                </div>
                <DeviceShowcase
                  className="wuji-visual"
                  desktopSrc="/assets/wuji-business-desktop.png"
                  desktopAlt="物迹商户版 Web 管理端"
                  desktopLabel="MERCHANT / WEB"
                  phoneSrc="/assets/wuji-family-mobile.png"
                  phoneAlt="物迹家庭版 HarmonyOS 原型"
                  phoneLabel="FAMILY / HARMONYOS"
                />
              </div>
            </article>

            <article className="project-case shixu-case" key="shixu">
              <div className="case-meta"><span>02 / FOCUS PLAN</span><span className="case-status"><i />规划与交互原型</span></div>
              <div className="case-body">
                <div className="project-story">
                  <span className="project-label">时序 · 学习与专注</span>
                  <h3>把阶段目标，变成今天真正能够开始的一段时间。</h3>
                  <p>将计划编排、任务执行、专注计时和周期复盘连接起来。Web 负责大屏规划，HarmonyOS 负责随时执行与多设备适配。</p>
                  <div className="surface-list"><span><Smartphone size={17} />HarmonyOS</span><span><Laptop size={17} />Web App</span><span><Cloud size={17} />Cloud API</span></div>
                  <div className="case-links"><ArrowLink href={FOCUS_PLAN_URL}>查看 UI 概念图</ArrowLink><ArrowLink href="https://github.com/huofeibo/focus-plan" target="_blank" rel="noreferrer">查看仓库</ArrowLink></div>
                </div>
                <DeviceShowcase
                  className="shixu-visual"
                  desktopSrc={focusPlanDesktopImage}
                  desktopAlt="时序 Web 学习工作台"
                  desktopLabel="PLAN / WEB"
                  phoneSrc={focusPlanMobileImage}
                  phoneAlt="时序 HarmonyOS 移动端原型"
                  phoneLabel="FOCUS / HARMONYOS"
                />
              </div>
            </article>
          </ScrollStack>
        </section>

        <section className="capability-band" id="capabilities">
          <Reveal className="section-intro light"><p className="eyebrow">BUILDING RANGE</p><h2>从界面，到系统真正运行的地方。</h2></Reveal>
          <div className="capability-ledger">
            {[
              [Code2, '01', 'Web 前端', '响应式界面、状态管理、设计系统与复杂业务工作台。', 'REACT / TYPESCRIPT'],
              [Smartphone, '02', 'HarmonyOS', 'ArkUI、多设备适配、端侧数据、扫码与系统通知。', 'ARKTS / ARKUI'],
              [Server, '03', '服务端接口', 'REST 契约、数据模型、权限边界与可靠状态流转。', 'NODE / POSTGRESQL'],
              [Sparkles, '04', '产品设计', '从用户问题、信息架构到原型、PRD 与交付验收。', 'DISCOVERY / DELIVERY']
            ].map(([Icon, number, title, text, stack], index) => (
              <Reveal className="capability-row" delay={index * 70} key={title}>
                <span className="capability-number">{number}</span><Icon /><strong>{title}</strong><p>{text}</p><small>{stack}</small><ArrowRight />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="architecture-section" id="architecture">
          <Reveal className="section-intro"><p className="eyebrow">SYSTEM MAP</p><h2>展示结果，也展示结果背后的连接方式。</h2><p>客户端体验、接口契约、数据和部署都进入同一份项目档案，开发状态保持真实可验证。</p></Reveal>
          <Reveal className="architecture-map">
            <div className="arch-column"><span className="arch-kicker">01 / CLIENTS</span><div><Smartphone />HarmonyOS Apps</div><div><Laptop />Web Applications</div></div>
            <div className="arch-connector"><span /><small>HTTPS</small><span /></div>
            <div className="arch-core"><span className="arch-kicker">02 / SERVICE</span><Server size={30} /><strong>Node API</strong><small>REST · Auth · Validation</small></div>
            <div className="arch-connector"><span /><small>EVENTS</small><span /></div>
            <div className="arch-column"><span className="arch-kicker">03 / DATA</span><div><Database />PostgreSQL</div><div><Bell />Notification</div></div>
          </Reveal>
          <div className="architecture-links">{API_BASE && <a href={`${API_BASE}/api/health`} target="_blank" rel="noreferrer">查看 API 健康状态<ExternalLink size={15} /></a>}<a href="/demos/asset-keeper.html">商户端演示<ExternalLink size={15} /></a><a href="/wuji/family-app">家庭端演示<ExternalLink size={15} /></a></div>
        </section>
      </main>

      <footer className="site-footer"><Brand compact /><p>从问题定义，到可以部署的个人产品。</p><a href="https://github.com/huofeibo" target="_blank" rel="noreferrer"><Github size={16} />GitHub</a><span>Beijing · China</span></footer>
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

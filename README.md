# 霍延波个人项目展示

个人项目作品集网站，集中展示前端、HarmonyOS 与服务端方向的产品实践。目前包含「物迹」和「时序」两个独立项目，以及物迹家庭版、物迹商户版和时序的可交互产品原型。

> 当前状态：展示站源码、产品截图、交互原型和演示 API 已迁入本仓库。当前后端使用内存数据，仅用于作品展示和接口契约验证，不是生产服务。

## 在线内容

| 入口 | 内容 |
| --- | --- |
| `/` | 个人介绍与精选项目 |
| `/wuji` | 物迹家庭版/商户版产品主页 |
| `/wuji/family-app` | 物迹家庭版 HarmonyOS 风格交互原型 |
| `/demos/asset-keeper.html` | 物迹商户版 Web/HarmonyOS 响应式原型 |
| `/demos/focus-plan.html` | 时序 Web/HarmonyOS 响应式原型 |
| `http://localhost:8787/api/health` | 演示 API 健康检查 |

## 项目仓库

| 项目 | 定位 | 客户端 | 仓库 |
| --- | --- | --- | --- |
| 物迹 Asset Keeper | 家庭资产与连锁门店设备管理 | HarmonyOS、Web 管理端 | [huofeibo/asset-keeper](https://github.com/huofeibo/asset-keeper) |
| 时序 Focus Plan | 学习计划、专注执行与复盘 | HarmonyOS、Web 应用 | [huofeibo/focus-plan](https://github.com/huofeibo/focus-plan) |

## 技术栈

### 展示站

- React 19、Vite 6
- Lucide React 图标
- 响应式布局，覆盖桌面和移动端
- 使用真实产品原型截图展示项目界面

### 演示 API

- Node.js 原生 HTTP 服务
- REST 风格接口、JSON 校验与 CORS
- 物迹家庭资产、商户设备与工单接口
- 时序任务与专注记录接口
- 内存数据，服务重启后恢复为种子数据

## 本地运行

要求：Node.js 20 或更高版本。

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

另开一个终端启动演示 API：

```bash
npm run api
```

访问：

```text
http://localhost:4173/
```

## 构建

```bash
npm run build
npm run preview
```

## 目录结构

```text
admin-project/
├── public/
│   ├── assets/          # 项目截图
│   └── demos/           # 独立交互原型
├── services/api/        # 演示后端服务
└── src/                 # React 展示站源码
```

本地工作区的上一级目录同时放置 `asset-keeper` 和 `focus-plan` 两个独立 Git 仓库，三个仓库互不嵌套：

```text
project/admin-project/
├── admin-project/       # 个人展示站仓库
├── asset-keeper/        # 物迹仓库
└── focus-plan/          # 时序仓库
```

## 生产部署建议

- 前端构建产物部署到 Nginx 或对象存储 CDN。
- API 独立部署，通过 `/api` 反向代理，避免前端写死服务地址。
- 使用 PostgreSQL、Redis 和对象存储替换内存数据。
- 增加 OAuth/JWT、租户权限、审计日志、限流、备份和可观测性。
- 配置正式域名、HTTPS、错误监控和持续部署流程。

## 当前进度

- [x] 完成个人作品集页面
- [x] 完成物迹双版本产品主页
- [x] 完成物迹家庭版交互原型
- [x] 整合物迹商户版与时序原型
- [x] 提供可运行的演示 API
- [ ] 替换正式联系方式与项目仓库链接
- [ ] 配置云服务器、域名和 HTTPS
- [ ] 接入各项目正式发布版本

## 仓库

```text
git@github.com:huofeibo/admin-project.git
```

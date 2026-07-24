# 霍延波个人项目展示

持续更新的个人项目作品集网站，集中展示前端、HarmonyOS、产品设计与服务端方向的工程实践。当前收录「物迹」和「时序」，后续项目继续接入同一展示入口，不依赖固定项目数量。

> 当前状态：展示站源码、产品截图、交互原型和演示 API 已迁入本仓库。当前后端使用内存数据，仅用于作品展示和接口契约验证，不是生产服务。

## 在线内容

| 入口 | 内容 |
| --- | --- |
| `/` | 个人介绍与精选项目 |
| `/wuji` | 物迹家庭版/商户版产品主页 |
| `/wuji/family-app` | 物迹家庭版 HarmonyOS 风格交互原型 |
| `/demos/asset-keeper.html` | 物迹商户版 Web/HarmonyOS 响应式原型 |
| `/demos/focus-plan.html` | 时序最新 Web UI 概念与响应式交互预览 |
| `http://localhost:8787/api/health` | 仅本地开发使用的演示 API 健康检查 |

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
- 参考 React Bits 的 Scroll Stack、Scroll Reveal 和 Glare/Tilt 交互模式，并提供移动端与减少动态效果降级

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

## 环境配置

复制示例配置：

```bash
cp .env.example .env
```

`VITE_DEMO_API_BASE_URL` 默认为空。生产站点为空时使用原型种子数据，不会请求访问者电脑上的 `localhost`。只有本地启动演示 API 时才设置：

```text
VITE_DEMO_API_BASE_URL=http://localhost:8787
```

`VITE_FOCUS_PLAN_URL` 默认为空，此时时序入口打开仓库内的最新 UI 概念稿。正式项目上线后，将它设置为真实项目地址并重新构建，作品集中的两个时序入口会自动切换：

```text
VITE_FOCUS_PLAN_URL=https://focus.example.com
```

## Docker

本地构建并启动容器：

```bash
docker compose up --detach --build
```

检查：

```bash
docker compose ps
curl -I http://127.0.0.1:8080/healthz
```

站点只绑定宿主机回环地址 `127.0.0.1:8080`，不会绕过宿主机 Nginx 直接暴露公网。停止服务：

```bash
docker compose down
```

## 目录结构

```text
admin-project/
├── deploy/             # 容器及宿主机 Nginx 配置
├── public/
│   ├── assets/          # 项目截图
│   └── demos/           # 独立交互原型
├── services/api/        # 演示后端服务
├── scripts/
│   ├── deploy-source.sh # Actions 源码归档部署入口
│   ├── deploy-image.sh  # 容器健康检查与失败回滚
│   └── deploy.sh        # 服务器 Git 工作区备用更新脚本
├── Dockerfile
├── compose.yaml
└── src/                 # React 展示站源码
```

本地工作区的上一级目录同时放置 `asset-keeper` 和 `focus-plan` 两个独立 Git 仓库，三个仓库互不嵌套：

```text
project/admin-project/
├── admin-project/       # 个人展示站仓库
├── asset-keeper/        # 物迹仓库
└── focus-plan/          # 时序仓库
```

## 生产部署

生产拓扑：

```text
Internet :443
    -> 宿主机 Nginx（域名、证书、HTTPS）
    -> 127.0.0.1:8080
    -> Docker: admin-project-web（静态站与 SPA 回退）
```

证书只保存在宿主机 `/etc/nginx/ssl`，不复制进镜像、Compose 配置或 Git 仓库。

### 首次迁移到 Docker

服务器要求 Docker Engine 和 Compose plugin。GitHub Actions 使用源码归档发布，因此服务器不依赖 GitHub 克隆。Ubuntu 24.04 可先安装发行版软件包：

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

重新登录服务器使 `docker` 用户组生效，然后验证：

```bash
docker version
docker compose version
```

腾讯云服务器无法稳定访问 Docker Hub 时，可安装仓库中的腾讯云官方镜像加速配置：

```bash
sudo install -m 644 deploy/docker-daemon.json.example /etc/docker/daemon.json
sudo systemctl restart docker
docker info --format '{{json .RegistryConfig.Mirrors}}'
```

修改已有 `/etc/docker/daemon.json` 前应先合并其中其他配置，不要直接覆盖。本项目服务器首次配置时该文件不存在，已直接使用此示例。

首次容器构建和启动由 GitHub Actions 完成，版本源码保存在 `/home/ubuntu/apps/admin-project/releases/<commit>`，成功版本由 `/home/ubuntu/apps/admin-project/current` 指向。无需预先在服务器克隆仓库。

确认容器健康后，将 `deploy/nginx-host.conf.example` 复制到宿主机 Nginx 配置目录，执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

不要在容器健康检查通过前切换宿主机 Nginx。当前手工部署的 `/var/www/admin-project` 可暂时保留，作为迁移失败时的回滚来源。

### GitHub Actions 一键发布

流水线位于 `.github/workflows/deploy.yml`。完成一次性配置后，日常发布流程是：

1. 本地修改、验证、提交并推送 GitHub。
2. 打开 GitHub 仓库的 **Actions** 页面。
3. 选择 **Deploy portfolio**。
4. 点击 **Run workflow**。

流水线会自动完成：

```text
检出流水线代码 -> 打包当前 Git 提交 -> 上传轻量源码包 -> SSH 连接腾讯云
-> 服务器解压到独立版本目录 -> Docker 构建 -> 更新容器 -> 健康检查
-> 失败自动回滚旧镜像 -> 验证公网路由
```

在 GitHub 仓库的 `Settings -> Environments` 创建 `production` 环境。需要人工审批时，可在该环境配置 required reviewers。以下内容添加到 `production -> Environment secrets`：

| Secret | 值 |
| --- | --- |
| `DEPLOY_HOST` | `82.157.121.102` |
| `DEPLOY_PORT` | SSH 端口，默认 `22` |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | 专用部署私钥的完整内容 |
| `DEPLOY_KNOWN_HOSTS` | 服务器 SSH host key 记录 |

不要使用个人日常 SSH 私钥。建议在 Mac 生成独立部署密钥：

```bash
ssh-keygen -t ed25519 -C github-actions-admin-project -f ~/.ssh/admin_project_deploy
```

把 `admin_project_deploy.pub` 的公钥追加到服务器：

```text
/home/ubuntu/.ssh/authorized_keys
```

私钥 `admin_project_deploy` 的完整内容只写入 GitHub Secret `DEPLOY_SSH_KEY`。生成 known hosts 内容：

```bash
ssh-keyscan -H -p 22 82.157.121.102
```

将输出整行写入 `DEPLOY_KNOWN_HOSTS`。首次流水线运行成功后，再用 `deploy/nginx-host.conf.example` 完成一次宿主机 Nginx 反向代理切换。此后发布不再登录服务器。

流水线通过 `git archive` 只打包当前提交中已跟踪的源码，归档不包含 `.git`、`node_modules`、`dist`、本地环境文件和证书。当前源码包约 243 KB，由服务器解压并本地构建，避开服务器克隆 GitHub、拉取 GHCR 镜像和传输大型镜像归档时的不稳定链路。镜像仍使用 Git 提交号作为不可变版本标签。

### 服务器命令行备用发布

当 GitHub Actions 暂时不可用时，可在本地仓库生成同样的轻量源码包并上传：

```bash
git archive --format=tar.gz --output=/tmp/admin-project-source.tar.gz HEAD
scp scripts/deploy-source.sh /tmp/admin-project-source.tar.gz ubuntu@82.157.121.102:/tmp/
ssh ubuntu@82.157.121.102 \
  "chmod +x /tmp/deploy-source.sh && /tmp/deploy-source.sh /tmp/admin-project-source.tar.gz $(git rev-parse HEAD)"
```

该方式与 Actions 使用相同的解压、构建、健康检查和回滚脚本，仅作为应急方式，不是日常发布入口。

查看运行状态和日志：

```bash
docker ps --filter name=admin-project-web
docker logs --tail=100 admin-project-web
```

流水线部署失败会自动恢复替换前的镜像。需要人工指定旧版本时，使用服务器已有的提交镜像标签：

```bash
/home/ubuntu/apps/admin-project/current/scripts/deploy-image.sh admin-project:<已验证提交号>
```

演示 API 默认不加入生产 Compose。物迹与时序的正式 API 应在各自仓库中实现鉴权、持久化、审计、备份和监控后独立部署。

## 当前进度

- [x] 完成个人作品集页面
- [x] 完成物迹双版本产品主页
- [x] 完成物迹家庭版交互原型
- [x] 整合物迹商户版与时序原型
- [x] 提供可运行的演示 API
- [ ] 替换正式联系方式与项目仓库链接
- [x] 配置云服务器、域名和 HTTPS
- [x] 提供 Docker/Compose 和一键部署脚本
- [x] 提供 GitHub Actions 手动发布流水线和失败回滚
- [x] 将线上站点从手工静态目录迁移到 Docker 容器
- [x] 配置 GitHub production 环境、Actions Secrets 和专用部署密钥
- [ ] 接入各项目正式发布版本

## 仓库

```text
git@github.com:huofeibo/admin-project.git
```

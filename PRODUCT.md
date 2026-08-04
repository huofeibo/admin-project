# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

招聘者、同行、潜在合作方，以及希望快速了解 Huoyb 个人开发作品的访客。他们需要在较短时间内看到代表项目、视觉完成度、技术方向和可交互成果。

## Product Purpose

这是 Huoyb 的个人作品展示网站。它集中呈现个人身份、精选项目、真实项目界面和可运行原型。成功意味着访客能够记住作品和个人风格，并顺畅进入项目详情或演示。

## Positioning

网站以动态、可交互的数字作品档案展示全栈开发、HarmonyOS 与创意开发实践。它不是产品销售页、技术服务公司官网或商业化 SaaS 落地页。

## Operating Context

访客主要通过桌面或手机浏览首页，快速切换「物迹」与「时序」，随后进入项目详情、真实交互原型或 GitHub。首页承担作品发现，项目页面承担事实说明，原型承担交互证明。

## Capabilities and Constraints

- 保留现有公开路径，包括 `/`、`/wuji`、`/wuji/family-app` 和 `/demos/*`。
- 当前技术栈为 React 19、Vite 6、Three.js、Lucide React 与原生 CSS。
- 首页主要展示「物迹」和「时序」，未来允许继续加入项目。
- 动效可以丰富，但不能妨碍项目阅读、正常滚动、键盘操作或触摸操作。
- 必须提供平板、手机和 `prefers-reduced-motion` 降级。
- 物迹与时序的独立产品原型属于作品证据，不应被统一改造成作品集视觉。
- 演示 API 只用于本地契约验证，不作为线上生产能力宣传。

## Brand Commitments

- 对外使用名称 `Huoyb` 和身份说明「全栈与 HarmonyOS 开发者」，页面不展示真实姓名。
- 首页界面文案以中文为主；React、ArkTS、Three.js 等技术专有名词保留原名。
- 语气以事实说明为主，不使用产品销售口号、虚拟商业指标或企业服务式能力宣言。
- 项目真实封面和产品截图是首要视觉资产。
- 用户已确认首页采用动画更丰富的动态作品档案方向，并将原有 Three.js 信号隧道替换为空间作品轮盘。
- 可以选用 React Bits 的组件源码实现文字、背景和微交互动效，但不能堆叠成组件演示页。

## Evidence on Hand

- 项目封面：`public/assets/wuji-project-cover.svg`、`public/assets/focus-plan-project-cover.svg`。
- 产品截图：`public/assets/` 与 `src/assets/`。
- 物迹家庭版、商户版和时序可交互原型。
- 两个独立项目仓库链接和当前部署站点。
- 没有客户评价、商业转化数据或可用于销售宣传的第三方背书，不得虚构。

## Product Principles

1. 作品优先：项目封面、界面和交互成果先于能力口号。
2. 个人而非企业：表达个人身份、审美和实际承担的工作。
3. 动效服务浏览：动画建立空间、层级和项目转换，不制造无意义干扰。
4. 事实而非包装：只展示能够由仓库、原型或项目内容证明的信息。
5. 多端完整：不同设备可以降低视觉复杂度，但不能缺失项目内容与入口。

## Accessibility & Inclusion

保持可见键盘焦点、足够文字对比、语义化控件、替代文本、至少 44px 的触摸目标，并完整支持 `prefers-reduced-motion`。

## Current Experience

- 首屏以 Huoyb 身份、全栈与 HarmonyOS 定位和可切换的 Three.js 空间项目封面组成。
- 「项目与界面」将项目索引、项目事实、桌面封面与移动端原型融合在同一连续浏览区。
- 结尾简介使用逐字动效表达「全栈开发，也做 HarmonyOS」，不承担销售转化功能。
- 桌面端保留空间深度、悬停与滚动层次；平板和手机端收敛为单列阅读，并降低动效复杂度。

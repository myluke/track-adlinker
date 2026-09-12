# AdLinker SEO 任务清单

整理日期：2026-09-12。来源：技术 SEO、TikTok 投放增长、内容策略三位专家的建议及项目源码核对。

目标：让使用 TikTok 广告获取 WhatsApp 线索的中国出海投手、代理商及海外投放团队，通过搜索找到 AdLinker，并完成有效咨询或产品接入。

状态说明：勾选项为源码已具备的基础能力；未勾选项为计划。本文不代表 SEO 已实施、网站已部署或搜索引擎已收录。优先完成 P0，再做 P1；发布及搜索平台账户操作按实际授权执行。

## 当前基础与建议修正

- [x] SvelteKit 静态预渲染，现有 7 种语言、每种 5 类页面。
- [x] 已有 title、description、自 canonical、hreflang、x-default 和 Open Graph。
- [x] 构建脚本生成 sitemap.xml、robots.txt，并检查本地链接与静态资源。
- [x] 已有静态 404、法律草案 noindex 条件、费用计算器、注册跳转配置。

核对入口：`src/routes/+layout.ts`、`src/routes/[lang=locale]/[[section=section]]/+page.svelte`、`scripts/verify-build.js`、`config.json`。

执行时以以下修正为准：

- 复用已有 sitemap、robots 和语言标签，不重复建设。
- `config.json` 已配置应用首页注册入口与支持邮箱；待验证实际接入流程，不视为缺失入口。
- 计算器计算 AdLinker 软件套餐与用量费用，不计算 TikTok 广告预算、ROAS 或归因效果；保留现有 `/calculator/`，不为关键词复制一个误导性计算器页。
- 法律配置当前已标记审定；保留草案条件逻辑，不无故给正式法律页添加 noindex。
- FAQ 正文有用，但 SaaS 网站不应期待 FAQPage 标记带来 Google FAQ 富结果。结构化数据列为 P2，不作为排名保证。
- 优先简中与英文：简中服务中国出海投手，英文服务英语搜索用户。西语、葡语按实际需求扩展，不仅因已有翻译就批量新增文章。
- 下列关键词是待验证候选，没有搜索量、竞争度或排名数据背书；不要求首段机械堆入全部关键词。

## P0：确认定位与最小搜索转化闭环

- [ ] **P0-01 核对产品能力与目标用户。** 明确第一批客户是中国出海投手、代理商还是海外团队；核实点击追踪、对话关联、事件回传、多账号分发、去重、消息存储的真实支持范围。
  - 验收：形成可对外使用的能力与限制说明；不把概念演示、平台接收事件或现有价格配置写成已验证的产品效果。
- [x] **P0-02 验证现有 CTA。** 核对首页到 `app.adlinker.work` 的实际接入路径、费用计算器入口及支持邮箱展示；如现有路径不能承接咨询，再补真实 Demo/咨询入口。
  - 线上回读（2026-09-12）：`https://app.adlinker.work/` 最终到 `/login` 返回 200，计算器返回 200；`/zh-hans/contact/` 返回 404，说明当前工作树的联系方式页尚未部署。现有 CTA 验证完成；联系方式页单独保留部署缺口。
  - 验收：访客可以从产品说明到达可用的下一步；仅点击出站链接不记为注册成功或有效线索。不擅自发送邮件或创建账号进行验证。
- [x] **P0-03 核对线上可抓取基线。** 检查正式域名首页与语言页、robots.txt、sitemap.xml、canonical、重定向、未知路径和 noindex。
  - 验收：目标页面与资源返回预期状态；未知页面真实返回 404；无意外屏蔽或跨域 canonical；记录实际 URL、状态和核对日期。

## P1：让页面匹配投手的搜索需求

- [x] **P1-01 为现有页面设置独立 SEO 文案。** 在现有 locale 文件中增加或调整 title、description，避免直接用品牌口号充当搜索标题；H1 自然说明产品用途。
  - 中文首页 Title 参考：`TikTok 广告 WhatsApp 归因与转化追踪工具 | AdLinker`。
  - 英文首页 Title 参考：`TikTok Ads to WhatsApp Tracking & Attribution | AdLinker`。
  - 中文 H1 参考：`为出海投手追踪 TikTok 广告带来的 WhatsApp 线索`。
  - 英文 H1 参考：`Track WhatsApp Leads from Your TikTok Ads`。
  - 英文 Description 参考：`Connect TikTok ad clicks with WhatsApp conversations. Explore AdLinker's tracking workflow, supported events and usage-based pricing.`
  - 验收：措辞经过能力核对；每页独立 title/description、清晰主 H1；正文和元信息语言一致，保持现有翻译字段结构约束。
- [x] **P1-02 扩充 `/why/` 的原理说明。** 解释广告点击、跳转、WhatsApp 对话、事件回传之间的关系，区分点击、开始对话、有效线索和成交。
  - 验收：关键说明直接出现在预渲染 HTML；写清归因限制、支持事件、状态含义、数据流及隐私边界；功能证据来自真实产品。
- [x] **P1-03 优化可见 FAQ。** 用投手实际问题组织问答，每题给出直接答案与限制，不写关键词列表式回答。
  - 验收：覆盖下文 FAQ 候选中产品能真实回答的问题；HTML 中可读取答案；无法确认的能力不作为既有功能宣传。
- [x] **P1-04 明确计算器用途。** 将相关 SEO 标题和说明定位为“AdLinker 套餐费用计算器 / AdLinker Pricing Calculator”。
  - 验收：保留 `/{lang}/calculator/`；清楚说明输入、币种、费用包含项及估算边界，不暗示计算广告平台支出或投资回报。
- [x] **P1-05 首批新增两个不同意图的内容页。** 优先完成简中和英文的 TikTok → WhatsApp 追踪说明；第二篇根据真实接入能力选择 Events API 指南或“点击与对话数量不同”的排查指南。
  - 验收：每页有独立问题、直接答案、真实步骤或示例、限制与 CTA；不复制首页，不填虚构案例；仅为实际存在的翻译输出 hreflang。
- [x] **P1-06 同步路由与内部链接。** 新页同步页面生成入口、路由 matcher、sitemap 和构建检查；首页、原理页、指南、计算器之间使用描述性链接。
  - 验收：新增页面可直接访问且有静态 HTML；不存在孤立页、失效语言链接或同内容竞争页；保留旧 URL，必要迁移提供明确重定向。
- [x] **P1-07 核对多语言内容完整性。** 保留各语言自 canonical 和互相 hreflang；检查产品展示中的固定中文、图片说明及仅切换后出现的关键文案。
  - 验收：简中和英文核心内容完整；其他既有页面逐页评估质量，不批量 noindex；重要功能说明不依赖点击或执行 JS 才可读。
- [ ] **P1-08 建立搜索和转化基线。** 获得相应账户权限后，在 Search Console 验证站点、提交 sitemap，检查重点 URL；定义自然搜索到咨询/接入的转化事件。
  - 验收：记录提交与索引状态、查询词、展示、点击、CTR、着陆页及有效转化；区分本地构建、线上发布、可索引、实际收录和业务转化。

### 关键词候选与页面归属

| 意图 | 中文候选 | 英文候选 | 归属 |
| --- | --- | --- | --- |
| 寻找工具 | TikTok WhatsApp 归因工具、TikTok 广告线索追踪 | TikTok WhatsApp ads attribution, TikTok lead tracking software | 首页 |
| 了解追踪方法 | TikTok 广告跳转 WhatsApp 怎么追踪 | how to track TikTok leads to WhatsApp, click to WhatsApp tracking | 追踪指南 |
| 接入事件回传 | TikTok WhatsApp 转化回传、Events API 接入 | TikTok Events API for WhatsApp, TikTok Events API setup | 接入指南，能力核对后发布 |
| 解决数据问题 | TikTok 点击和 WhatsApp 对话数不一致、事件去重 | WhatsApp conversion tracking for TikTok Ads, TikTok conversion event deduplication | 排查指南 |
| 代理商场景 | TikTok 代理商 WhatsApp 线索管理 | TikTok ad tracking for agencies, WhatsApp lead routing | 有独特内容时建场景页 |
| 了解费用 | AdLinker 价格、AdLinker 费用计算 | AdLinker pricing, AdLinker pricing calculator | 现有 calculator |

执行规则：一个主要搜索意图对应一个主要页面；先查公开搜索结果及官方术语，再用 Search Console 数据调整。广义 `TikTok ads tracking` 可自然覆盖，不以其为唯一获客目标。无需添加 `meta keywords`。

### 内容页候选 URL

| 候选 URL | 内容要求 | 顺序 |
| --- | --- | --- |
| `/{lang}/tiktok-whatsapp-tracking/` | 追踪流程、数据边界、点击与对话区别 | 首批 |
| `/{lang}/tiktok-events-api-whatsapp/` | 实际事件映射、配置步骤、验证与常见失败 | 能力核对后首批 |
| `/{lang}/whatsapp-lead-routing/` | 真实多账号分发规则、适用场景与限制 | 后续按需 |
| `/{lang}/use-cases/agencies/` | 代理商独有的工作流程与真实证据 | 后续按需 |

`{lang}` 仅代表已完成内容的语言；以上 URL 为规划，不代表当前路由已支持。复用现有静态页面结构，不为少量页面引入 CMS 或通用内容平台。

### FAQ 候选

- 如何追踪 TikTok 广告带来的 WhatsApp 线索？ / How do I track WhatsApp leads from TikTok Ads?
- 广告点击数为什么不等于 WhatsApp 对话数？
- 支持哪些 TikTok Events API 事件？平台接收是否代表转化已归因？
- 如何处理重复事件？
- 能否把线索分配到多个 WhatsApp 账号？
- AdLinker 是否保存消息内容，保存多久？
- 跳转后如何关联来源，哪些情况下无法关联？
- 套餐费用是否包含 TikTok 广告支出？

## P2：结构化信息、内容扩展与体验

- [x] **P2-01 增加适用 JSON-LD。** 优先真实 Organization、WebSite；内容页按需 BreadcrumbList；SoftwareApplication 仅标记已核实的软件信息。
  - 验收：JSON 可解析、属性符合对应规范且与可见内容一致；不编造评价、评分、价格或官方合作关系。FAQPage 可选，不承诺富结果。
- [x] **P2-02 优化分享与图片。** 核对 OG/Twitter 图片、locale、图片尺寸和替代文本；装饰图片保留空 alt。
  - 验收：分享图真实可访问；信息图片有适当说明；修复实际问题，不批量给装饰图塞关键词。
- [ ] **P2-03 按实测优化性能。** 测量 LCP、INP、CLS，先定位实际瓶颈，再决定字体、图片或脚本优化。
  - 验收：记录工具、页面、日期及前后结果；区分实验室数据与真实用户数据，无数据不宣称达标。
- [x] **P2-04 扩展可信内容。** 按查询需求补 UTM 命名、去重、归因排查、线索质量指南；引用官方文档并标记作者/维护者与实质更新时间。
  - 验收：内容能解决具体问题，示例注明是否为演示；仅使用获授权的真实案例；先有持续内容需求再增加 resources/blog 入口。
- [ ] **P2-05 按需求扩展西语、葡语。** 本地化投手术语、FAQ 和 CTA；价格沿用真实计价规则，不自动假设支持当地币种。
  - 验收：完整翻译、独立校对、正确语言互链；不以批量翻译数量作为成果。
- [ ] **P2-06 获取相关行业曝光。** 准备有价值的指南、案例或工具介绍，供相关社区、行业媒体及合作伙伴引用。
  - 验收：先完成可审阅材料；对外联络或发布另按授权执行；不购买垃圾外链、不群发。

## P3：有数据后再做

- [ ] 根据实际查询、客户分布和当地支持能力决定地区页，不制作仅替换国家名的门页。
- [ ] 对已有展示但 CTR 偏低的页面迭代标题，对有点击但无转化的页面检查搜索意图和接入路径；低样本不仓促下结论。
- [ ] 仅在持续发布、多人维护确有需要时引入内容管理工具。

## 实施与验收顺序

| 阶段 | 交付物 | 完成条件 |
| --- | --- | --- |
| 第一阶段 | P0 基线、首页/why/计算器 SEO 文案与 FAQ | 真实能力、可抓取页面、可用下一步形成闭环 |
| 第二阶段 | 首批两个内容页及内链 | 内容完整、静态产物和语言链接检查通过 |
| 第三阶段 | 搜索平台基线、按需结构化数据与场景页 | 区分索引状态与业务结果，有真实数据可复查 |
| 持续迭代 | 查询词驱动的内容与语言扩展 | 用相关查询、有效咨询和接入结果评估价值 |

### 实施后检查

- [x] 在现有测试/构建检查中覆盖新增页面、元信息、H1、canonical、有效 hreflang 目标和 sitemap，不只检查标签数量。
- [x] 按改动执行 `CI=true pnpm check`、`CI=true pnpm test`、`CI=true pnpm build`；聚焦受影响逻辑，复用现有检查，不新增测试框架。
- [x] 若修改浏览器交互，定向验证受影响的语言切换、CTA 或计算器流程。
- [ ] 发布获授权并完成后，从正式域名回读重点页、robots、sitemap、404 和重定向，保存简明证据。
- [ ] 将“源码已改”“本地检查通过”“已发布”“已收录”“获得有效线索”分别记录；不承诺排名或固定时间内获取流量。

本文仅整理任务，不修改页面或运行生产操作；本次文档更新无需运行应用测试。

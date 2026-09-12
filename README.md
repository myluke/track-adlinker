# AdLinker

AdLinker 的独立代理营销站，参考 [ConTrack](https://contrack.ad/zh-hans)，使用自有品牌与 [第二版 logo](docs/adlinker-logo-v2/README.md)。正式营销域名：**https://adlinker.work**。

## 已实现

- Home、Why、Calculator、Terms、Privacy，7 种语言，共 35 个预渲染页面。
- English、简体中文、繁體中文、한국어、日本語、Português、Español；根路径转到 `/zh-hans/`。
- 响应式布局、浅色/深色主题、可交互归因示意、原生语言菜单与 FAQ。
- 本地报价计算器：选择四档预设套餐后只填 3 个核心用量，单价和额度自动带入；手动改价和更深层事件放在高级设置中。支持落地页/直跳模式、账号超额、UV/事件赠送额度和最深阶段计费。
- canonical、hreflang、Open Graph、sitemap、robots 和静态 404。
- Svelte 5 / SvelteKit 2、`adapter-static`、Cloudflare Pages `build/` 输出。

没有产品应用、数据库、认证、应用 API、Blog、代理招募页、追踪运行时或 secrets。字体和品牌素材均随站点托管。

## 本地开发

使用 Node.js **20.19+**（建议 `.nvmrc` 的 Node 24）和 pnpm 10：

```bash
pnpm install
pnpm dev
```

首页：`http://localhost:5173/zh-hans/`。

```bash
CI=true pnpm check
CI=true pnpm test
CI=true pnpm build
pnpm preview
```

`build` 同时核对 35 个页面、语言与 canonical、内部链接和资源；生成 `build/sitemap.xml` 与 `build/robots.txt`。本地测试结果不等于 CI、部署或正式服务开通。

## 定制入口

先修改根目录 [`config.json`](config.json)：

| 区域 | 内容 |
| --- | --- |
| `brand` | 名称、辅助标语、浅/深 logo、图标、favicon、分享图 |
| `appearance` | 强调色、默认浅/深主题 |
| `urls` | 营销域名、独立应用域名、登录和注册路径 |
| `contact` / `legal` | 支持邮箱、主体、适用法律、生效日期、法律审定状态 |
| `pricing` | 币种与符号、确认状态、套餐、事件单价和计算器默认用量 |

配置是**公开数据**，构建会拒绝未知字段。不得添加密钥、账号凭据或内部配置。品牌路径必须对应 `static/` 中的文件，`/brand/logo.svg` 对应 `static/brand/logo.svg`。文字翻译位于根目录 `locales/`，按 `en.json`、`zh-hans.json`、`zh-hant.json`、`ko.json`、`ja.json`、`pt.json`、`es.json` 分开维护；`src/lib/i18n.js` 仅保留导入、语言元数据和读取函数。

目前应用入口、登录/注册路径和适用法律尚未确认，因此：

- 主要按钮指向站内工作流程/计算器；未提供的登录注册入口不显示。
- 计算器按用户要求采用 2026-09-12 核对的 ConTrack 公开套餐（月费 ¥0 / ¥799 / ¥1,999 / ¥4,499），在 `config.json` 维护；可在高级设置调整报价。¥0 为套餐月费，超额用量仍计费。
- Terms/Privacy 已写入主体 `adlinker`、支持邮箱 `support@adlinker.work`、适用法律 `the laws of New South Wales, Australia` 和生效日期 `2026-09-12`，满足生效条件并进入正常索引流程。应用入口与登录/注册路径仍待补齐。
- `pnpm release:check` 会列出正式开放前需补齐的字段；它与本地构建检查分开运行。

## Cloudflare Pages

| 设置 | 值 |
| --- | --- |
| 构建命令 | `pnpm build` |
| 输出目录 | `build` |
| Node.js | 20.19+，建议 24 |
| 环境变量 | 无 |

发布前补齐真实配置、审定条款与报价，运行 `pnpm release:check` 及上述检查，再将 `adlinker.work` 接到 Pages 项目。产品应用使用独立域名，写入 `urls.application`；不要把登录请求指向静态站。

本仓库没有执行部署、DNS 修改或外部账号操作。正式上线后仍需从 `https://adlinker.work` 回读页面、资源、语言深链、计算器与应用跳转。

详见 [实施与配置说明](docs/adlinker-implementation.md)、[原始范围](docs/adlinker-marketing-site-spec.md) 和 [未决事项](implementation-notes.md)。

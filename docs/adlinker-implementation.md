# AdLinker 实施与配置说明

## 三位专家的取舍

用户授权三名专家参与，只读调研与建议由主代理整合实现；未创建额外任务或执行外部写入。

| 角色 | 实际模型 | 采纳结果 |
| --- | --- | --- |
| 产品定位与转化文案 | gpt-5.6-terra / medium | 以 TikTok → WhatsApp 的来源、对话里程碑和回传状态为核心；不把上游价格、AI 规划或效果保证当作 AdLinker 已开通能力 |
| 品牌视觉与体验 | gpt-5.6-terra / medium | 深墨绿与青绿、清晰留白、可交互的归因流程示意、移动端重排、键盘可达与减少动态效果偏好 |
| 工程架构与安全边界 | gpt-5.6-sol / high | 静态预渲染、严格公开配置、HTTPS 应用跳转、整数金额计算、法律草案状态及发布配置检查 |

视觉采用 `docs/adlinker-logo-v2/` 中的真实 logo。流程示意图没有虚构转化量、客户评价或营收指标。AdLinker 对外介绍自己的咨询与接入支持，不承诺 TikTok/WhatsApp 的平台接受率或广告效果。

## 页面与路由

语言：`en`、`zh-hans`、`zh-hant`、`ko`、`ja`、`pt`、`es`。每种语言都有：

```text
/{lang}/
/{lang}/why/
/{lang}/calculator/
/{lang}/terms/
/{lang}/privacy/
```

`/` 转到 `/zh-hans/`；所有有效页面使用尾斜杠。语言切换保留当前页面类型。未知语言、未知页面、Blog 和登录路由不作为静态应用入口返回。

构建时 SvelteKit 生成 HTML；部署产物中没有服务器。`hooks.server.ts` 只在构建/本地开发时设置 HTML 的语言、主题和颜色，根 `+page.server.ts` 只提供预渲染重定向。浏览器的计算器不调用 API。

## 配置合同

`config.json` 是品牌、外部入口、联系方式、法律事实和价格的单一来源。未知字段会被拒绝，防止误把非公开配置打入客户端。翻译与网站布局属于源码。

七语文案按语言存放在根目录 `locales/*.json`。修改对应 JSON 即可更新翻译；保持七份文件的字段结构一致。`src/lib/i18n.js` 保留语言元数据与 `getCopy()` 入口，未知语言继续回退到英文文案。

- `urls.marketing` / `urls.application`：HTTPS origin，不含账号密码、路径、query 或 hash。
- `signInPath` / `registrationPath`：以单个 `/` 开始的路径，可以带普通查询参数；拒绝协议相对链接、反斜杠和控制字符。
- 应用 origin 与路径均存在时才产生入口；例如 `https://app.example.com` + `/register?ref=agency`。示例不代表 AdLinker 已有此入口。
- `brand` 的素材必须为本地路径；默认 SVG 已转路径，无外部字体引用。分享图使用本地 PNG。
- `appearance.defaultTheme` 为 `light` 或 `dark`。只有用户切换主题时才写入本地存储；存储受限时仍可切换。
- `legal.reviewed=true` 表示用户确认主体、生效日期、联系渠道及七语文案已审定；完整发布检查仍要求提供 `legal.governingLaw`。应用处理的数据不由本营销站隐私文本代替说明。

## 计费计算器

按用户要求采用 2026-09-12 核对的 ConTrack 公开套餐。首屏选择套餐并填写每月总用量，价格与额度自动带入。落地页模式展示访问量、WhatsApp 账号数和开始聊天总人数；直跳模式仅展示账号数和开始聊天总人数，同时隐藏 UV 赠送额度和 UV 费用明细，切回落地页恢复原访问量。计算结果不提交、不扣费；切换语言不会换算币种。

所有聊天量默认 0。深入聊天人数和重新互动次数在可选区域填写，其当前数值在折叠时仍展示；两项留空按 0 估算，表示没有纳入这些可选用量，并不表示真实使用时免收对应费用。深入聊天人数包含在开始聊天总人数内，超过总数会报错；重置恢复配置默认值。基础版直跳、5 个账号、聊天量全为 0 时总价为 ¥799；开始聊天人数明确填为 1,000 时，才产生 ¥80 对话超额费用。

| 套餐 | 月费 | 包含 WA | 赠送 UV | 每 UV | 深度事件额度 | 额外 WA |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 按量付费 | ¥0 | 1 | 3,000 | ¥0.03 | ¥15 | ¥120 |
| 基础版 | ¥799 | 5 | 20,000 | ¥0.03 | ¥120 | ¥99 |
| 专业版 | ¥1,999 | 20 | 60,000 | ¥0.025 | ¥250 | ¥69 |
| 旗舰版 | ¥4,499 | 60 | 200,000 | ¥0.017 | ¥1,000 | ¥49 |

事件单价统一为意向 ¥0.20、深度互动 ¥0.50、重新互动 ¥0.30。`pricing.confirmed=true` 表示用户已选择这套公开价格用于本地估算，不表示代理合同或产品服务已开通；后续价格更新在 `config.json` 手动维护。

公式：

```text
额外账号费 = max(0, 账号数 − 包含账号数) × 额外账号单价
UV 费用   = 落地页模式 ? max(0, UV × UV 单价 − UV 赠送额度) : 0
UV 抵扣   = 落地页模式 ? UV 单价 : 0
事件费用  = max(0,
              (意向人数 − 深度互动人数) × max(0, 意向单价 − UV 抵扣)
              + 深度互动人数 × max(0, 深度互动单价 − UV 抵扣)
              + 重新互动事件数 × 重新互动单价
              − 事件赠送额度)
月度估算  = 套餐费 + 额外账号费 + UV 费用 + 事件费用
```

深度互动人数是意向人数的子集。同一人只保留最深阶段计费，重新互动作为独立事件次数输入；无法从营销站验证实际上游事件资格或对话窗口。估算不包含税费、汇兑、其他服务，也不是上游正式账单复现器。

配置中的金额使用整数：

| 字段 | 单位 |
| --- | --- |
| `monthlyMinor`、`extraAccountMinor`、`uvCreditMinor`、`eventCreditMinor` | 货币最小单位，例如 CNY 的分（100 = ¥1） |
| `plans[].visitorTenThousandths`、`eventPrices.*TenThousandths` | 货币的万分之一（10000 = ¥1，100 = ¥0.01）；UV 单价按套餐维护 |
| `includedAccounts`、`uvIncluded`、各默认用量 | 非负整数 |

当前支持两位小数的币种，默认 CNY / ¥。小数单价在解析时转为整数万分位，使用 BigInt 计算，每个费用类别四舍五入到分后求和；输入非法、超范围或未填的报价不会变成零费用。

确认后的套餐示例（**仅展示格式，不是业务报价**）：

```json
{
  "id": "example-plan",
  "name": { "en": "Example", "zh-hans": "示例方案" },
  "monthlyMinor": 1000,
  "includedAccounts": 1,
  "extraAccountMinor": 100,
  "visitorTenThousandths": 300,
  "uvIncluded": 3000,
  "uvCreditMinor": 200,
  "eventCreditMinor": 300
}
```

UV 单价已从 `pricing.eventPrices.visitorTenThousandths` 移到每个 `pricing.plans[]`，并用 `uvIncluded` 展示套餐赠送的 UV 数量；`eventPrices` 仅保留三个对话事件单价。套餐名称可提供七语映射，未提供的语言回退到 `en`。

## 验证与发布边界

本次实际验证：

- `CI=true pnpm check`：0 错误、0 警告。
- `CI=true node --test tests/site.test.js`（`pnpm test` 的实际命令）：8 组通过，覆盖四档真实配置、最深阶段计费及 UV 抵扣、赠送额度、直跳模式、万分位舍入、输入边界、URL/公开配置和七语完整性。
- 默认聊天量修复回归：基础版直跳 5 账号、0 聊天为 ¥799；明确填 1,000 人为 ¥879。浏览器验证可选输入留空按 0、深入人数超出总数时拒绝估算、折叠栏展示当前可选用量、重置恢复零聊天量；直跳时无 UV 额度、输入或费用项。
- `CI=true pnpm build`：35 页面、canonical/hreflang、本地链接/资源、法律草案 noindex 与纯静态产物检查；生成 21 条非法律草案 sitemap 记录。
- 静态 HTTP 回读：35 页 200；5 个未知/非本站功能路径 404。
- 2026-09-12 浏览器回归：50,000 UV、10 WA、2,000 意向、500 深度互动、10 重新互动时，四档落地页总价依次为 ¥2,968 / ¥2,567 / ¥2,252 / ¥4,499；直跳总价为 ¥1,618 / ¥1,727 / ¥2,302 / ¥4,499，与参考站相同。套餐切换带入 UV 单价，手动改价切为自定义，非法漏斗拒绝，重置恢复默认套餐及用量。
- 本次七语计算器通过 320px 窄屏检查：默认均仅 3 个可访问输入框，无横向溢出。此前首页窄屏、语言切换保留 Why 页面及深色主题持久化验证已通过，历史截图位于忽略提交的 `artifacts/`。

`pnpm release:check` 目前预期失败：仅应用入口、登录/注册路径尚未提供。支持邮箱、主体、适用法律、生效日期和法律审定已写入配置；价格已按用户要求确认用于估算。该命令是单独的发布前检查，不改变 `pnpm build` 的本地预览能力。

以上是本地源码、测试与产物验证；没有声称 CI、DNS、部署或业务开通已完成。正式发布仍需授权，并在 Cloudflare Pages 与正式域名边界回读。

## 公开参考

2026-09-11 初次读取，2026-09-12 重新核对公开套餐及计算器样例：

- [ConTrack 首页](https://contrack.ad/zh-hans)
- [ConTrack Why](https://contrack.ad/zh-hans/why)
- [ConTrack Calculator](https://contrack.ad/zh-hans/calculator)
- [SvelteKit adapter-static](https://svelte.dev/docs/kit/adapter-static)
- [SvelteKit prerender / entries](https://svelte.dev/docs/kit/page-options)
- [Cloudflare Pages 的 SvelteKit 部署说明](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/)

使用公开页面和官方文档，没有向 AgentKey 发送信息，也没有使用登录态研究。

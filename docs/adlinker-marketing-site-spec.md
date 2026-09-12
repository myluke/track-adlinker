# AdLinker 营销站定制说明

> 范围基线。站点已按此范围完成本地实现，当前配置合同、计算器规则及验证结果见 [实施说明](./adlinker-implementation.md)。正式入口、报价和法律主体仍待补齐。

## 目标

基于静态 SvelteKit 模板创建 AdLinker 的营销站，发布到 Cloudflare Pages。站点只承载品牌介绍、定价计算与法律页面，不包含产品应用逻辑。

## 已确认范围

- 页面：首页（Home）、Why、Calculator、Terms、Privacy。
- 语言：English、简体中文、繁体中文、한국어、日本語、Português、Español。
- 配置入口：根目录 `config.json`。
- 输出：静态站点，Cloudflare Pages 输出目录为 `build`。
- 运行时：无数据库、认证、应用 API、Blog、追踪运行时和 secrets。
- 构建：`pnpm build`；Node.js 20.19 或更高版本（当前工具链最低要求；建议 24）。

## 域名

营销站主域名确定为：

```text
https://adlinker.work
```

`config.json` 的 `urls.marketing` 应使用该地址。`urls.application`、`urls.signInPath` 和 `urls.registrationPath` 暂不填写真实值，待产品应用域名和登录注册路径确定后再补齐；营销站实现不得自行假设应用已存在。

## 品牌与素材

logo 素材来源：[`docs/adlinker-logo-v2/`](./adlinker-logo-v2/)。

| 配置项 | 使用文件或值 | 说明 |
| --- | --- | --- |
| 横向 Logo（浅色背景） | `adlinker-logo.svg` | 默认页头和浅色背景使用；透明 SVG，自包含 |
| 横向 Logo（深色背景） | `adlinker-logo-dark.svg` | 深色区域使用 |
| 独立图标 | `adlinker-icon.svg` | 小尺寸或仅显示图标的位置使用 |
| 应用图标 | `adlinker-app-icon.svg` | 圆角图标、社交分享或应用入口使用 |
| Favicon | `favicon.ico` | 直接作为站点 favicon |
| 主深墨绿 | `#122C2A` | 文字、深色背景 |
| 主青绿色 | `#00AA86` | 强调色、按钮和链接 |
| 浅底辅助色 | `#E6F7F2` | 浅色区块背景 |
| 深色背景强调色 | `#38D9B0` | 深色背景上的高亮 |
| 品牌辅助标语 | `Link. Track. Grow.` | 可用于首页品牌文案；不并入 logo |

横向 logo 最小建议宽度为 150px；更小位置改用独立图标，并保持原始宽高比和安全留白。

## `config.json` 定制合同

实现时只从 `config.json` 读取以下产品化信息：

- `brand` / `appearance`：品牌名、tagline、logo、favicon、accent color、默认主题。
- `urls`：营销站域名、应用域名、登录路径、注册路径。
- `contact` / `legal`：支持邮箱、法律实体、适用法律、生效日期。
- `pricing`：货币符号、套餐、事件价格和计算器默认值。

初始已确认配置记录：

```json
{
  "urls": {
    "marketing": "https://adlinker.work"
  },
  "appearance": {
    "accentColor": "#00AA86",
    "defaultTheme": "light"
  }
}
```

上段是已确认字段的最小记录，不代表完整 schema。支持邮箱、法律实体、管辖法律、生效日期、实际套餐价格、应用域名和登录注册路径必须在上线前补齐，并由当前实现的构建期配置校验器检查。

## 发布与验收

本地检查顺序：

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

Cloudflare Pages：构建命令为 `pnpm build`，输出目录为 `build`，不配置环境变量。发布后需要从 `https://adlinker.work` 回读首页、语言切换、Calculator、Terms、Privacy 和 favicon，确认静态资源路径及 canonical URL 正确。

## 待补信息

1. 产品应用的正式域名，以及登录和注册路径。
2. 支持邮箱、法律实体、适用法律和隐私条款生效日期。
3. 各套餐名称、价格、事件单价、货币符号和 Calculator 默认参数。
4. 首页最终 tagline；当前可先使用 `Link. Track. Grow.` 作为品牌辅助标语。


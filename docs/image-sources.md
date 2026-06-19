# 图片来源清单（安全图源）

> 配合本站「编辑设计风 + 局部插画点缀」的方向，以下图源都**允许公开站点使用**。
> 商用/署名要求各不相同，挑图前看清单条。

## 完全免费、无需署名（CC0 / 公共领域）

| 图源 | 类型 | 备注 |
|---|---|---|
| [unDraw](https://undraw.co) | SVG 插画 | 极简扁平风，可一键改主题色（直接换成 `#1E3A5F`） |
| [Unsplash](https://unsplash.com) | 摄影 | 关键词搜 `letter / window / morning / library / autumn` 出氛围照 |
| [Pixabay](https://pixabay.com/zh) | 综合 | 摄影 + 插画 + SVG 都有 |

## 免费、需署名（CC-BY）

| 图源 | 类型 | 备注 |
|---|---|---|
| [Storyset](https://storyset.com) | 插画 | 有 `Pana` / `Bro` / `Amico` 三套风格，最接近"日系/二次元"温度感 |
| [Freepik](https://freepik.com) | 综合 | 免费版需署名 + 链接回原作者 |
| [Blush](https://blush.design) | 插画 | 大量插画师作品，部分免费 |

## 二次元 / 日系氛围（要小心版权）

- **Pixiv** — 搜图时务必看作品页右下角的「転載・利用」标签：
  - ✅ 「転載 OK」「自由転載 OK」 → 可用，需署名作者 + 原链接
  - ❌ 没有明确标注 → 默认不可转载
- **ぴくしぶ百科 / 公式画集** → 有版权，**不能用**
- **京阿尼 / Aniplex 官方截图（薇尔莉特、亚托莉等）** → 有版权，公开站点不建议用，被发律师函的概率虽低但不为零

如果你确实想要二次元角色感，**最安全的两条路**：

1. 在 Storyset 选 `Pana` 风格的插画（接近二次元温度，CC-BY 即可使用）
2. 找 Pixiv 上明确标 `転載 OK` 的同人画师作品，留作者名 + 原链接

## 用法

挑好的图丢到：

```
public/illustrations/
  hero-letter.png       # 替换 HeroDecoration 用
  letters-bg.png        # 学长来信列表页氛围图（Phase 3）
  about-portrait.png    # 关于我侧栏（可选）
```

然后在对应组件里把现在的 `<svg>` 换成：

```tsx
import Image from "next/image";

<Image
  src="/illustrations/hero-letter.png"
  alt="信件氛围插画"
  width={420}
  height={520}
  priority
  className="select-none"
/>
```

记得在页脚或图旁加一行小字署名（CC-BY 要求），例如：
> 插画：[作者名] · [来源链接] · CC BY 4.0

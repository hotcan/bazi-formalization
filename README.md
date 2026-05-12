# 中华命理学的形式化分析与计算系统

> A Mathematical Formalization of Chinese Bazi (Four Pillars) Destiny Analysis

把传统八字命理用现代代数语言（循环群、向量空间、线性映射、参数扰动）形式化描述，并实现为一套可在浏览器中运行、可被测试套件回归验证的算法。配套学术风格的形式化分析文档共八章。

**作者**：[hotcan](https://github.com/hotcan) · MIT License · v2.2 (2026-04)

---

## 🪞 项目动机

笔者在复旦大学"哲学课堂"修习王德峰教授开设的《中华命理学》课程后，尝试把传统命理学内部的组合结构用现代代数语言重述：

- 阴阳 = $\mathbb{Z}/2\mathbb{Z}$、五行 = $\mathbb{Z}/5\mathbb{Z}$
- 天干 = $\mathbb{Z}/10\mathbb{Z}$、地支 = $\mathbb{Z}/12\mathbb{Z}$、六十甲子 = $\mathbb{Z}/60\mathbb{Z}$
- 相生映射 $\Sigma(w) = w + 1$、相克映射 $\mathcal{K}(w) = w + 2$
- 排盘公式（五虎遁、五鼠遁）→ 代数等式
- 用神选取 → 多目标优化 + 参数扰动置信区间

本文目标**不是证明命理学的科学性**，而是<strong>显式化其内部逻辑结构</strong>，让传统口诀变成可验证的代数等式。

---

## 🚀 快速开始

```bash
git clone https://github.com/hotcan/bazi-formalization.git
cd bazi-formalization

# 启动本地 HTTP 服务
python3 -m http.server 8765

# 浏览器打开
open http://localhost:8765/index.html        # 输入出生信息
open http://localhost:8765/destiny.html?year=1990&month=8&day=9&hh=14&mm=30&lon=106.7&gender=1  # 直链
open http://localhost:8765/中华命理学的形式化分析.html  # 形式化文档
```

无需任何依赖。纯 HTML + JavaScript，所有计算在浏览器本地完成。

---

## 📁 项目结构

```
.
├── bazi-core.js                    # 核心引擎（~4400 行）— 排盘、五行向量、用神、大运流年
├── destiny.html                    # 主分析页面 — 22 节命盘报告
├── index.html                      # 出生信息输入页
├── match.html                      # 合婚分析页面
├── 中华命理学的形式化分析.html         # 形式化框架文档（八章 + 附录）
├── test/                           # 测试套件 (230+ 检查点)
│   ├── test-suite.js              # 29 盘基础覆盖
│   ├── test-suite2.js             # 32 盘 F 综分布
│   ├── test-suite3.js             # 100 盘随机大样本
│   ├── test-hour-pillar.js        # 100 盘时柱验证
│   ├── test-corner.js             # 21 项基础边界
│   ├── test-corner2.js            # 21 项时间/对称边界
│   ├── test-corner3.js            # 17 项深度构造
│   └── ...                         # 历史调试脚本
├── LICENSE                         # MIT
└── README.md                       # 本文件
```

---

## 🧮 核心算法清单

| 模块 | 实现位置 | 说明 |
|----|----|----|
| 真太阳时修正 | `bazi-core.js` §3 | 经度差 + 均时差（EoT）+ 夏令时（1986-91 中国 DST） |
| 晚子时派别 | `bazi-core.js` `lateZiMode` | 归本日 / 子初换日 两派显式选择 |
| 五行向量 V | §3 `calcWxVector` | 位置权重 $\lambda^T, \lambda^D$ + 空亡折损 $\varepsilon$ |
| 合冲刑害 | §4 `detectDzRelations` + `applyDzEffects` | 冲战三级（将/臣/众）+ 刑 0.92 + 害 0.9 + 合化 |
| 月令旺衰 | §5 `calcWxVector` 内 | 旺/相/死/囚/休 五档 (1.5/1.2/0.5/0.7/1.0) |
| 日主旺衰 $r^*$ | `calcDayMasterStrength` | 月令动态权重 0.85/0.55 + 燥土脆金修正 |
| 用神选取 | `selectUsefulGod` | 扶抑+调候+泄秀+印旺夺食+相战通关+从格+十干性情 |
| 真假神分型 | `selectUsefulGod` | true / trueMinor / halfTrue / structural / weak / defect |
| 源流气-力评估 | `calcSourceFlow` | 节点质量分（透干+占比）→ 拓扑分扣减 |
| 大运起法 | `calcDaYun` | 3天=1岁 + 节气精确到分钟 |
| 流年综合系数 | `calcYearFortune` | $\tanh$ 软饱和 + 9 组参数扰动置信区间 |
| 神煞系统 | `calcShenSha` | 13 种（天乙/文昌/学堂/国印/驿马/桃花/华盖/将星/禄神/羊刃/月德/天德/金舆/太极/天医） |

---

## 🧪 测试

```bash
cd test
node test-suite.js           # 29 盘基础（包含曾国藩、宋庆龄等历史盘四柱验证）
node test-suite3.js          # 100 盘随机大样本（种子 2026 可复现）
node test-hour-pillar.js     # 1900-2000 年随机 100 盘时柱独立验证
node test-corner.js          # 21 项边界 case
node test-corner2.js         # 21 项时间对称性
node test-corner3.js         # 17 项深度构造（古代/未来/全同柱）
```

测试覆盖 230+ 检查点，包括：
- 节气分钟级边界、闰年、夏令时
- 60 甲子日柱完整覆盖
- 四同天干 / 四同地支构造盘
- 起运岁数合理性、大运 period 连续性
- F 综 NaN/Infinity 检测、置信区间有序性
- 重复调用确定性、性别对称性
- 日主合化展示一致性

---

## 📖 形式化文档

[`中华命理学的形式化分析.html`](./中华命理学的形式化分析.html) 共八章 + 附录：

1. **第一章** 阴阳五行与干支（含晚子时派别、夏令时与其他时区）
2. **第二章** 地支藏干与五行量化（位置权重、空亡折损）
3. **第三章** 五行生克与四时旺衰（月令五档、十二长生）
4. **第四章** 干支合冲刑害（冲战三级、刑害量化）
5. **第五章** 日主强弱与用神（10 小节：扶抑/调候/泄秀/印旺夺食/相战通关/特殊格局/十干性情/真假神分型/源流评估）
6. **第六章** 十神与格局（10 正格气质画像）
7. **第七章** 大运与流年（软饱和 + 置信区间）
8. **第八章** 论命算法（六步流程图）
9. **附录** 符号总表（A.1-A.4，约 50 个数学符号）

所有公式由 [KaTeX](https://katex.org/) 渲染，约 430 个数学公式。

---

## ⚠️ 免责声明

本项目基于《子平真诠》《滴天髓》《穷通宝鉴》《三命通会》《五行结构论》等经典命理学典籍的现代量化建模，**仅供文化研究、学术探讨与娱乐参考**，不构成任何投资、就业、医疗或重大人生决策建议。

命理量化框架本质上是把传统口诀显式化为可被审视、可被反驳、可被改进的算法——其价值在于让讨论变得**可辩驳**，而非证明其"正确"。所有判定均带参数扰动置信区间，跨零标 `*` 表示模型误差范围内的不确定结论。

---

## 🤝 贡献

欢迎以下方向的 PR：
- **算法层**：新增/修正命理规则，须配套测试 case
- **建模层**：参数再校准（基于古籍引证或大样本分析）
- **测试层**：扩充 corner case，捕获潜在 bug
- **文档层**：形式化文档错误修正、新增数学等价表述

请遵循"代码改动 → 测试 → 文档同步"的原则。

---

## 📚 致谢

- **王德峰教授**（复旦大学）——课程《中华命理学》是本项目的最初动力
- **Anthropic Claude**——在形式化推导、代码实现、文档撰写、测试设计上的深度协作
- 所有在这个时代仍认真对待中华传统文化的人们

---

## License

MIT © 2026 [hotcan](https://github.com/hotcan)

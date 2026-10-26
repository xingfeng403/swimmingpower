# 中国游泳 · 年龄段纪录与领军人物

一个纯静态网页，展示**国内不同年龄段游泳分项纪录**与**中国游泳领军人物**，数据来自公开记录，
由 WorkBuddy 智能体**定时检索并自动刷新**（每次刷新后自动 push，GitHub Pages 随之更新）。

## 页面内容

| 标签页 | 内容 |
| --- | --- |
| 青少年年龄组纪录 | U9–U10 / U11–U12 / U13–U14 / U15–U16 / U17–U18 五个年龄组，17 个分项，男女成绩对照 |
| 成人年龄组纪录 | 18–24 岁组、25–29 岁组全国纪录，含纪录保持者与时间地点 |
| 领军人物 | 老将（精神压舱石）/ 中生代（中流砥柱）/ 新生代（破浪新星）三档人物卡 |
| 2026 突破动态 | 亚运会、全国游泳冠军赛、全国青少年 U 系列赛、全国青年锦标赛等破纪录时间线 |

## 目录结构

```
swim-records/
├── index.html    # 页面结构
├── style.css     # 样式（浅色主题，响应式）
├── app.js        # 渲染逻辑
└── data.js       # 数据源：window.SWIM_DATA = { ... }
```

`data.js` 是唯一的数据文件，页面通过 `<script src="data.js">` 加载，
因此**无需构建、无需服务器**，直接双击 `index.html` 或部署到任意静态托管都能工作。

## 数据说明

- 全部为**长池（50 米池）**公开成绩。
- 年龄组纪录主要来自《游泳》杂志整理的「2025 全国青少年游泳 U 系列总决赛秩序册」；
  成人纪录来自《成人游泳全国纪录》（截至 2023-11-14）。
- 纪录数据为公开报道汇编，可能与官方最新发布存在时间差，**以中国游泳协会正式发布为准**。
- 页面页脚列出了全部引用来源链接。

## 数据刷新机制

定时任务会：
1. 检索中国游泳协会、国家体育总局、《游泳》杂志及权威媒体上的最新公开记录；
2. 按原有结构重写 `data.js`（并更新 `meta.lastUpdated` 与来源列表）；
3. `git add` → `git commit` → `git push origin main`，GitHub Pages 自动重新部署。

## 本地预览

```bash
cd swim-records
python -m http.server 8000 --bind 127.0.0.1
# 打开 http://127.0.0.1:8000
```

## GitHub Pages

仓库：<https://github.com/xingfeng403/swimmingpower>
站点：<https://xingfeng403.github.io/swimmingpower/>

Pages 配置：仓库 **Settings → Pages → Build and deployment → Source** 选 `Deploy from a branch`，
分支 `main`、目录 `/ (root)`。

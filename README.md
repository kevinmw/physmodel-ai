# PhysModel AI - 高中物理动态模型生成器

<p align="center">
  <strong>拍照识别物理题目 → AI 自动分析 → GeoGebra 动态模型动画</strong>
</p>

---

## 🎯 项目简介

PhysModel AI 是一款面向高中师生的物理学习工具，通过拍照上传物理题目，利用 AI 视觉语言模型（VLM）识别和理解题目内容，再由大语言模型（LLM）自动生成 [GeoGebra](https://www.geogebra.org/) 动态物理模型命令，最终在页面中渲染可交互的物理动画。

### 核心流程

```
📷 拍照/上传 → 🤖 VLM 视觉理解 → 💬 LLM 生成命令 → ⚙️ GeoGebra 动态渲染
```

## ✨ 功能特性

- **📸 多方式输入**：支持拍照、相册选择、拖拽上传、截图粘贴
- **🤖 AI 双模型驱动**：VLM 理解图片 + LLM 生成模型命令
- **⚙️ GeoGebra 动态模型**：实时渲染交互式物理动画，支持播放/暂停/重置/全屏
- **📚 6 种预设模型**：抛体运动、单摆、自由落体、斜面滑块、圆周运动、弹簧振子
- **🔧 自定义 API 配置**：支持任意 OpenAI 兼容 API（地址、密钥、模型名均可自定义）
- **📜 历史记录**：保存和回顾之前的分析结果

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 15** | React 全栈框架 |
| **TypeScript** | 类型安全 |
| **Tailwind CSS** | 样式系统 |
| **GeoGebra Applet** | 动态数学/物理模型渲染 |
| **OpenAI Compatible API** | VLM + LLM 双模型调用 |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 3. 配置 API

首次使用需要点击右上角 **⚙️ API设置**，配置以下信息：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| VLM API 地址 | 视觉模型接口 | `https://api.openai.com/v1/chat/completions` |
| VLM API 密钥 | 视觉模型密钥 | `sk-...` |
| VLM 模型名称 | 视觉模型 | `gpt-4o` |
| LLM API 地址 | 文本模型接口 | `https://api.openai.com/v1/chat/completions` |
| LLM API 密钥 | 文本模型密钥 | `sk-...` |
| LLM 模型名称 | 文本模型 | `gpt-4o` |

> 💡 支持所有兼容 OpenAI API 格式的服务商（如 DeepSeek、智谱、硅基流动等）

### 4. 构建部署

```bash
npm run build
npm start
```

## 📁 项目结构

```
physics-model/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 主页面（三步 Tab 流程）
│   │   ├── globals.css             # 全局样式
│   │   └── api/analyze/
│   │       └── route.ts            # AI 分析 API（VLM + LLM 双调用）
│   └── components/
│       ├── PhotoCapture.tsx        # 拍照/上传组件
│       ├── AnalysisPanel.tsx       # AI 分析结果展示
│       ├── GeoGebraViewer.tsx      # GeoGebra 动态模型渲染器
│       ├── ExampleProblems.tsx     # 6 种预设物理模型
│       └── ApiConfigDialog.tsx     # API 配置对话框
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🔬 支持的物理模型

| 模型 | 物理类型 | 关键参数 |
|------|----------|----------|
| 🎯 抛体运动 | projectile_motion | v0, theta, t |
| 🔄 单摆运动 | pendulum | L, alpha0, t |
| ⬇️ 自由落体 | free_fall | h, t |
| 📐 斜面滑块 | inclined_plane | angle, mu, t |
| ⭕ 匀速圆周运动 | circular_motion | r, omega, t |
| 〰️ 弹簧振子 | spring | A, omega, t |

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

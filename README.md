# iResume

一个基于 React + TypeScript + Tailwind CSS 的在线简历生成器，支持实时预览、本地存储和一键导出 PDF。

https://resume.dogxi.me

![screenshot](./docs/screenshot.webp)

## ✨ 特性

- **实时编辑**：所见即所得的编辑体验，左侧编辑右侧实时预览
- **简历管理**：本地管理多份简历，支持新建空白简历、命名、标签、版本号和上次修改时间
- **本地存储**：自动保存到浏览器 LocalStorage，刷新不丢失
- **一键导出**：优化的打印样式，支持保存为 PDF 或导出 PNG 图片
- **GitHub 云同步**：可通过 GitHub OAuth 同步加密后的本地数据
- **样式设置**：支持主题切换、主题收藏、字号、页边距和区块标题图标开关，JSON 备份会保留外观设置
- **分页预览**：预览区显示预计页数与分页线，方便提前控制一页简历
- **专业设计**：符合 ATS（应聘者跟踪系统）的简洁排版
- **响应式布局**：适配桌面和移动端
- **隐私安全**：所有数据存储在本地，不上传服务器
- **性能优化**：使用 Vite 构建，快速加载
- **TypeScript**：完整的类型支持，代码更健壮

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm / yarn / pnpm / bun

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:5173](http://localhost:5173) 查看效果。

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
# 或
bun build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
# 或
bun preview
```

## 📖 使用指南

### 编辑简历

打开应用后会先进入「简历库」，可以新建空白简历、编辑已有简历、复制简历。点击虚线新建卡片后，可以先填写简历名称和标签。

进入编辑页后，可以在左侧顶部维护简历名称、标签和版本号，并继续填写个人信息、技能、工作经历等。右侧会实时显示简历预览效果。所有修改会自动保存到浏览器本地存储。

### 调整样式

右上角可以切换简历主题，并通过字号、页边距控件微调 PDF 预览。默认字号为 10.5pt，默认页边距为 12mm，默认主题、字号和 PDF 边距保持原始样式。

主题列表右侧的星标可以收藏常用主题，收藏会保存到浏览器本地并优先排序。

在左侧「区块标题」区域可以逐项控制标题前的小图标是否显示，适合在极简排版和直观识别之间做取舍。

### 导出 PDF

1. 点击右上角的 **"保存 PDF"** 按钮
2. 在打印对话框中：
   - **目标打印机**：选择 "另存为 PDF"
   - **边距**：选择 "无" 或 "最小"
   - **背景图形**：**必须勾选**（否则样式会丢失）
   - **页眉和页脚**：取消勾选
3. 点击保存即可

### 导出图片

点击右上角的 **"图片"** 按钮可以将当前简历导出为 PNG 图片，适合快速预览、投递前沟通或移动端查看。

### 云同步

首页右上角「设置」里的「云同步」支持通过 GitHub 同步所有本地简历数据。首次使用时点击连接 GitHub 后即可上传；在新设备上登录同一个 GitHub 账号后，点击从云端恢复即可取回数据。

同步内容会在浏览器内用 GitHub 账号级密钥加密后再写入 gist。云端 gist 里不会保存明文简历内容。

部署 OAuth 同步需要创建 GitHub OAuth App，并在 Vercel 环境变量中配置：

```bash
VITE_GITHUB_OAUTH_CLIENT_ID=你的 GitHub OAuth App Client ID
GITHUB_OAUTH_CLIENT_ID=你的 GitHub OAuth App Client ID
GITHUB_OAUTH_CLIENT_SECRET=你的 GitHub OAuth App Client Secret
```

GitHub OAuth App 的 Authorization callback URL 设置为应用访问地址，例如 `https://resume.example.com/`。本地开发时可增加 `http://localhost:5173/` 用于调试。

### 重置数据

点击 **"重置"** 按钮可以恢复到默认模版数据（会弹出确认对话框）。

## 🛠️ 技术栈

- **框架**：React 19
- **语言**：TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS 4
- **图标**：Lucide React
- **代码规范**：ESLint + Prettier

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献步骤

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 💡 常见问题

### Q: 数据存储在哪里？

A: 默认存储在浏览器的 LocalStorage 中。开启 GitHub 云同步后，数据会先在浏览器内加密，再保存到你的 GitHub 账号下。

### Q: 支持多语言吗？

A: 当前版本仅支持中文，如需英文版简历，可以直接在编辑器中填写英文内容。

### Q: 如何部署到线上？

A: 运行 `npm run build` 后，将 `dist` 目录部署到任意静态网站托管服务（如 Vercel、Netlify、GitHub Pages）即可。

## 🙏 鸣谢

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

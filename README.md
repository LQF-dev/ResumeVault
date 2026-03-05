# ResumeVault

> 简历信息本地存储与一键复制的浏览器插件，告别重复填写校招表单。

## 解决什么问题

校招季需要在各大招聘网站反复填写个人信息，而网站自带的简历解析往往识别效果差、格式混乱，每次都要打开简历手动复制粘贴。ResumeVault 让你**一次录入，随处粘贴**——所有信息保存在浏览器本地，随时一键复制到任何网站。

## 功能列表

### 核心功能

- **简历上传参考**：支持上传 PDF / Word (.docx) 文件，本地提取文本内容作为填写参考（不联网、不调用 AI）
- **完整信息管理**：支持录入和编辑以下信息模块：
  - 基本信息（姓名、性别、出生日期、手机号、邮箱、政治面貌、民族、籍贯、现居城市）
  - 教育经历（学校、专业、学历、GPA、时间、描述）
  - 实习经历（公司、职位、时间、工作内容）
  - 项目经历（项目名称、角色、技术栈、时间、描述）
  - 技能
  - 荣誉/证书
  - 自我评价
  - 自定义字段（可自由添加任意键值对）
- **一键复制**：点击任意字段即可复制到剪贴板，直接粘贴到招聘网站表单
- **搜索过滤**：在侧边栏中快速搜索定位需要的字段

### 快速访问

- **侧边栏（Side Panel）**：在任何网页旁边常驻显示个人信息，无需切换标签页
- **键盘快捷键**：默认 `Alt+Shift+V` 开关侧边栏（可自定义）
- **Popup 弹窗**：点击扩展图标快速打开侧边栏或跳转编辑页

### 数据管理

- **本地存储**：所有数据仅存储在浏览器本地（chrome.storage.local），**绝不上传到任何服务器**
- **导出/导入**：支持将数据导出为 JSON 文件备份，也可从 JSON 文件导入恢复
- **清除数据**：一键清除所有已保存的信息

### 兼容性

- Chrome 浏览器（Manifest V3）
- Edge 浏览器（基于 Chromium）

## 使用指南

### 安装方式

#### 方式一：从源码加载（开发者模式）

1. 克隆本仓库并安装依赖：

```bash
git clone <repo-url>
cd ResumeVault
npm install
```

2. 构建项目：

```bash
npm run build
```

3. 打开 Chrome，访问 `chrome://extensions/`
4. 开启右上角的 **开发者模式**
5. 点击 **加载已解压的扩展程序**，选择项目中的 `dist` 目录
6. 扩展安装完成，工具栏会出现 ResumeVault 图标

#### 方式二：Chrome 商店安装

> 即将上线，敬请期待。

### 使用流程

#### 第一步：录入信息

1. 点击工具栏的 ResumeVault 图标
2. 选择 **上传简历开始填写** 或 **直接手动填写**
3. 如果上传了简历，左侧会显示提取的原文文本供参考
4. 在右侧表单中逐项填写或修改信息，点击 **保存**

#### 第二步：使用信息

1. 访问任意招聘网站
2. 通过以下任一方式打开侧边栏：
   - 按快捷键 `Alt+Shift+V`
   - 点击工具栏图标 → **打开侧边栏**
3. 在侧边栏中点击需要的字段，自动复制到剪贴板
4. 在网站表单中 `Ctrl+V` / `Cmd+V` 粘贴

#### 自定义快捷键

1. 点击 Popup 弹窗底部的 **自定义快捷键** 链接
2. 或手动访问 `chrome://extensions/shortcuts`（Edge 为 `edge://extensions/shortcuts`）
3. 找到 ResumeVault，设置你喜欢的快捷键组合

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Tailwind CSS 4 | 样式 |
| Vite 6 | 构建工具 |
| @crxjs/vite-plugin | Chrome 扩展开发支持 |
| pdfjs-dist | PDF 文本提取 |
| mammoth | Word (.docx) 文本提取 |
| Chrome Extension Manifest V3 | 扩展规范 |

## 项目结构

```
src/
├── background/          # Service Worker（快捷键、侧边栏状态管理）
├── components/          # 共享 UI 组件
│   ├── AutoTextArea.tsx  # 自适应高度文本域
│   ├── CopyableField.tsx # 可复制字段
│   ├── Icons.tsx         # 统一 SVG 图标
│   ├── InfoCard.tsx      # 信息卡片（可折叠、可搜索）
│   ├── ResumeUploader.tsx# 简历上传组件
│   ├── TextReference.tsx # 原文参考展示
│   └── Toast.tsx         # 提示消息
├── hooks/               # React Hooks
│   ├── useCopy.ts        # 剪贴板操作
│   └── useStorage.ts     # chrome.storage 封装
├── options/             # 选项页（完整信息管理界面）
├── popup/               # 弹窗（入口页）
├── services/            # 文件解析服务
│   ├── docxParser.ts     # Word 解析
│   └── pdfParser.ts      # PDF 解析
├── sidepanel/           # 侧边栏（快速查看与复制）
├── styles/              # 全局样式
├── types/               # TypeScript 类型定义
└── manifest.ts          # 扩展清单配置
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 生产构建
npm run build
```

开发模式下，在 `chrome://extensions/` 加载 `dist` 目录即可实时调试。

## 隐私声明

ResumeVault 的所有数据均存储在浏览器本地（`chrome.storage.local`），**不会向任何外部服务器发送数据**。简历文件的文本提取完全在本地完成，不调用任何云端 API。

## License

MIT

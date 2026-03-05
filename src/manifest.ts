/**
 * Chrome Extension Manifest V3 配置
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "ResumeVault",
  description: "简历信息本地存储与一键复制，告别重复填写",
  version: "1.1.0",
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
    },
  },
  options_page: "src/options/index.html",
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  permissions: ["storage", "clipboardWrite", "sidePanel"],
  commands: {
    "toggle-sidepanel": {
      suggested_key: {
        default: "Alt+Shift+V",
        mac: "Alt+Shift+V",
      },
      description: "打开 ResumeVault 侧边栏",
    },
  },
});

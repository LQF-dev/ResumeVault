/**
 * Chrome Extension Service Worker
 * 使用 Port 连接可靠追踪侧边栏状态，实现快捷键 toggle
 *
 * @author QinFeng Luo
 * @date 2026/03/05
 */

let activeTabId: number | undefined;
let panelPort: chrome.runtime.Port | null = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("ResumeVault installed");
});

chrome.tabs.onActivated.addListener((info) => {
  activeTabId = info.tabId;
});

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (tab?.id) activeTabId = tab.id;
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    panelPort = port;
    port.onDisconnect.addListener(() => {
      panelPort = null;
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-sidepanel") {
    if (panelPort) {
      panelPort.postMessage({ type: "close-panel" });
    } else if (activeTabId) {
      chrome.sidePanel.open({ tabId: activeTabId });
    }
  }
});

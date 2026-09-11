const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getGames: () => ipcRenderer.invoke("get-games"),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
  addGame: (placeId) => ipcRenderer.invoke("add-game", placeId),
  removeGame: (universeId) => ipcRenderer.invoke("remove-game", universeId),
  refreshGame: (universeId) => ipcRenderer.invoke("refresh-game", universeId),
  getGameEvents: (universeId) => ipcRenderer.invoke("get-game-events", universeId),
  getNotifHistory: () => ipcRenderer.invoke("get-notif-history"),
  clearNotifHistory: () => ipcRenderer.invoke("clear-notif-history"),

  onGameUpdated: (callback) =>
    ipcRenderer.on("game-updated", (_, game) => callback(game)),
  onGamesList: (callback) =>
    ipcRenderer.on("games-list", (_, games) => callback(games)),
  onSelectGame: (callback) =>
    ipcRenderer.on("select-game", (_, gameId) => callback(gameId)),
  onShowToast: (callback) =>
    ipcRenderer.on("show-toast", (_, toast) => callback(toast)),
  onNotifHistoryUpdate: (callback) =>
    ipcRenderer.on("notif-history-update", (_, history) => callback(history)),

  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  close: () => ipcRenderer.send("close"),
});

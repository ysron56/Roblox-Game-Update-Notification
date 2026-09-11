const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, nativeImage } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store({
  defaults: {
    games: [],
    notifiedEvents: {},
    notificationHistory: [],
    settings: {
      checkInterval: 5,
      notificationsEnabled: true,
      eventNotificationsEnabled: true,
      eventReminderMinutes: 30,
      robloxCookie: "",
    },
  },
});

let mainWindow;
let tray;
let checkTimer;

function addNotification(title, body, type) {
  const notif = { title, body, type, time: Date.now() };
  const history = store.get("notificationHistory", []);
  history.unshift(notif);
  if (history.length > 100) history.length = 100;
  store.set("notificationHistory", history);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("show-toast", { title, body, type });
    mainWindow.webContents.send("notif-history-update", history);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: "#0f0f13",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "src", "icon.png"),
  });

  if (process.env.NODE_ENV === "development" || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip("Roblox Game Notifier");
  updateTrayMenu();
}

function updateTrayMenu() {
  const games = store.get("games", []);
  const gameMenuItems = games.map((g) => ({
    label: `${g.name} - Last: ${formatDate(g.lastUpdated)}`,
    click: () => {
      mainWindow.show();
      mainWindow.webContents.send("select-game", g.id);
    },
  }));

  const contextMenu = Menu.buildFromTemplate([
    { label: "Roblox Notifier", enabled: false },
    { type: "separator" },
    ...gameMenuItems,
    { type: "separator" },
    {
      label: "Show",
      click: () => mainWindow.show(),
    },
    {
      label: "Check Now",
      click: () => checkAllGames(),
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
}

function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchGameDetails(placeId) {
  try {
    const fetch = require("node-fetch");

    const universeRes = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
    );
    if (!universeRes.ok) throw new Error("Failed to get universe ID");
    const universeData = await universeRes.json();
    const universeId = universeData.universeId;

    const gameRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`
    );
    if (!gameRes.ok) throw new Error("Failed to get game details");
    const gameData = await gameRes.json();
    if (!gameData.data || gameData.data.length === 0) throw new Error("Game not found");
    const game = gameData.data[0];

    let thumbnail = "";
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
    );
    if (thumbRes.ok) {
      const thumbData = await thumbRes.json();
      thumbnail = thumbData.data?.[0]?.imageUrl || "";
    }

    return {
      id: universeId,
      placeId: placeId,
      name: game.name,
      description: game.description || "",
      creator: game.creator?.name || "Unknown",
      thumbnail,
      playing: game.playing || 0,
      visits: game.visits || 0,
      maxPlayers: game.maxPlayers || 0,
      created: game.created,
      lastUpdated: game.updated,
      genre: game.genre || "N/A",
    };
  } catch (err) {
    console.error("Fetch error:", err.message);
    return null;
  }
}

async function fetchGameEvents(universeId) {
  try {
    const fetch = require("node-fetch");
    const cookie = store.get("settings.robloxCookie", "");
    const headers = {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };
    if (cookie) {
      headers["Cookie"] = `.ROBLOSECURITY=${cookie}`;
    }

    const endpoints = [
      `https://apis.roblox.com/virtual-events/v3/universes/${universeId}/game-events?pageSize=25&sortOrder=Asc`,
      `https://apis.roblox.com/virtual-events/v1/universes/${universeId}/virtual-events?pageSize=25`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          const events = data.gameEvents || data.data || data.events || [];
          if (events.length > 0) {
            return events.map((e) => ({
              id: e.id,
              name: e.title || e.name || "",
              description: e.displayDescription || e.description || "",
              startTime: e.eventTime?.startUtc || e.startTime || "",
              endTime: e.eventTime?.endUtc || e.endTime || "",
              type: e.eventStatus || e.type || "Event",
              host: e.host?.hostName || e.creator?.name || "",
            }));
          }
        }
      } catch (e) {
        // continue to next endpoint
      }
    }
    return [];
  } catch (err) {
    console.error("Fetch events error:", err.message);
    return [];
  }
}

async function checkAllGames() {
  const games = store.get("games", []);
  const settings = store.get("settings");
  let hasChanges = false;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const details = await fetchGameDetails(game.placeId);
    if (!details) continue;

    if (details.lastUpdated !== game.lastUpdated) {
      games[i] = { ...games[i], ...details };
      hasChanges = true;

      if (settings.notificationsEnabled) {
        addNotification(
          "Game Updated!",
          `${details.name} was updated!\nNew update: ${formatDate(details.lastUpdated)}`,
          "info"
        );
      }

      mainWindow.webContents.send("game-updated", details);
    } else {
      games[i].playing = details.playing;
      games[i].visits = details.visits;
    }
  }

  if (hasChanges) {
    store.set("games", games);
    mainWindow.webContents.send("games-list", games);
    updateTrayMenu();
  }
}

function startAutoCheck() {
  const settings = store.get("settings");
  const intervalMs = settings.checkInterval * 60 * 1000;

  if (checkTimer) clearInterval(checkTimer);
  checkTimer = setInterval(() => {
    checkAllGames();
    checkEventNotifications();
  }, intervalMs);
}

async function checkEventNotifications() {
  const settings = store.get("settings");
  if (!settings.notificationsEnabled || !settings.eventNotificationsEnabled) return;

  const games = store.get("games", []);
  const notified = store.get("notifiedEvents", {});
  const reminderMs = (settings.eventReminderMinutes || 30) * 60 * 1000;
  const now = Date.now();
  let hasChanges = false;

  for (const game of games) {
    const events = await fetchGameEvents(game.id);
    for (const event of events) {
      const eventKey = `${game.id}_${event.id}`;
      const startTime = new Date(event.startTime).getTime();
      const notifState = notified[eventKey] || {};

      // Notif saat event mulai (status jadi active / waktu sudah lewat)
      if (event.startTime && startTime <= now && !notifState.started) {
        addNotification(
          "Event Started!",
          `${event.name}\nby ${event.host || game.name}\nis now live!`,
          "success"
        );
        notifState.started = true;
        hasChanges = true;
      }

      // Notif sebelum event mulai
      if (event.startTime && startTime > now && startTime - now <= reminderMs && !notifState.reminded) {
        const minsLeft = Math.round((startTime - now) / 60000);
        addNotification(
          "Event Starting Soon!",
          `${event.name}\nby ${event.host || game.name}\nstarts in ${minsLeft} minutes!`,
          "warning"
        );
        notifState.reminded = true;
        hasChanges = true;
      }

      notified[eventKey] = notifState;
    }
  }

  if (hasChanges) {
    store.set("notifiedEvents", notified);
  }
}

// IPC Handlers
ipcMain.handle("get-games", () => store.get("games", []));

ipcMain.handle("get-settings", () => store.get("settings"));

ipcMain.handle("save-settings", (_, newSettings) => {
  store.set("settings", newSettings);
  startAutoCheck();
  return store.get("settings");
});

ipcMain.handle("add-game", async (_, placeId) => {
  const games = store.get("games", []);
  if (games.find((g) => g.placeId === placeId)) {
    return { error: "Game already added" };
  }

  const details = await fetchGameDetails(placeId);
  if (!details) return { error: "Failed to fetch game. Check the Place ID." };

  games.push({ ...details, addedAt: new Date().toISOString() });
  store.set("games", games);
  updateTrayMenu();
  return { success: true, game: details };
});

ipcMain.handle("remove-game", (_, universeId) => {
  let games = store.get("games", []);
  games = games.filter((g) => g.id !== universeId);
  store.set("games", games);
  updateTrayMenu();
  return games;
});

ipcMain.handle("refresh-game", async (_, universeId) => {
  const games = store.get("games", []);
  const idx = games.findIndex((g) => g.id === universeId);
  if (idx === -1) return { error: "Game not found" };

  const details = await fetchGameDetails(games[idx].placeId);
  if (!details) return { error: "Failed to refresh" };

  games[idx] = { ...games[idx], ...details };
  store.set("games", games);
  updateTrayMenu();
  return { success: true, game: details };
});

ipcMain.handle("get-game-events", async (_, universeId) => {
  return await fetchGameEvents(universeId);
});

ipcMain.handle("get-notif-history", () => {
  return store.get("notificationHistory", []);
});

ipcMain.handle("clear-notif-history", () => {
  store.set("notificationHistory", []);
  return [];
});

ipcMain.on("minimize", () => mainWindow.minimize());
ipcMain.on("maximize", () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on("close", () => {
  if (tray) tray.destroy();
  app.quit();
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();
  startAutoCheck();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

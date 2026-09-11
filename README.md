<div align="center">

# Roblox Game Update Notification

**Desktop application for tracking Roblox game updates and events in real-time.**

![Electron](https://img.shields.io/badge/Electron-33.4.11-47848F?style=for-the-badge&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/ysron56/Roblox-Notification?style=for-the-badge&color=yellow)
![Forks](https://img.shields.io/github/forks/ysron56/Roblox-Notification?style=for-the-badge&color=purple)
![Issues](https://img.shields.io/github/issues/ysron56/Roblox-Notification?style=for-the-badge&color=red)

<br/>

[Download](https://github.com/ysron56/Roblox-Notification/releases/latest) • [Report Bug](https://github.com/ysron56/Roblox-Notification/issues) • [Request Feature](https://github.com/ysron56/Roblox-Notification/issues)

</div>

---

## Preview

<div align="center">
  <img src="preview.png" alt="App Preview" width="800"/>
</div>

---

## Features

<div align="center">

| Feature | Description |
|:-------:|:-----------:|
| 🎮 | **Game Tracking** - Add any Roblox game and monitor it in real-time |
| 🔔 | **Update Notifications** - Get notified instantly when a tracked game gets updated |
| 📅 | **Upcoming Events** - See all upcoming events with dates, hosts, and status |
| ⏰ | **Event Notifications** - Alert when events start or are about to begin |
| 📜 | **Notification History** - View all past notifications in one place |
| 📊 | **Live Stats** - See player count, visits, and game info |
| 🌙 | **Dark Theme** - Sleek Roblox-inspired dark UI |
| 🖥️ | **System Tray** - Runs in the background with tray icon |
| ⚡ | **Auto Check** - Configurable check interval (1-60 minutes) |

</div>

---

## Download

<div align="center">

[![Download Latest](https://img.shields.io/badge/Download-Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/ysron56/Roblox-Notification/releases/latest)

**Roblox.Game.Update.Notification.1.0.0.exe** (~80MB)

</div>

### Verify Download

```
SHA256: 5403DB9B37DEE6A756A30B7515E66C1221C338B58CF0F9F7314FC3305251757E
```

---

## Quick Start

```bash
# 1. Download and run the exe
# 2. Click + to add a game (enter Place ID)
# 3. Enable notifications in Settings
# 4. Done!
```

---

## Tech Stack

<div align="center">

| Frontend | Backend | Build Tools |
|:--------:|:-------:|:-----------:|
| React 18 | Electron 33 | Vite 5.4 |
| Tailwind CSS 3.4 | Node.js | electron-builder |
| | electron-store | |

</div>

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    MAIN PROCESS                     │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Fetcher   │  │   Checker   │  │  Notifier   │ │
│  │   (API)     │  │  (Updates)  │  │  (Events)   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │         │
│         └────────────────┼────────────────┘         │
│                          │                          │
│                    ┌─────┴─────┐                    │
│                    │  Storage  │                    │
│                    │ (electron)│                    │
│                    └───────────┘                    │
└──────────────────────┬──────────────────────────────┘
                       │ IPC Bridge
┌──────────────────────┴──────────────────────────────┐
│                  RENDERER PROCESS                    │
│                                                      │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────┐  │
│  │  Sidebar  │  │   Game    │  │   Notification  │  │
│  │   List    │  │  Details  │  │     Panel       │  │
│  └───────────┘  └───────────┘  └─────────────────┘  │
│                                                      │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────┐  │
│  │   Add     │  │  Settings │  │     Toast       │  │
│  │   Game    │  │   Modal   │  │   Notifications │  │
│  └───────────┘  └───────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Configuration

| Setting | Default | Description |
|:-------:|:-------:|:-----------:|
| Check Interval | 5 min | How often to check for updates |
| Notifications | ON | Desktop notifications toggle |
| Event Notifications | ON | Event start/reminder alerts |
| Event Reminder | 30 min | Minutes before event to notify |
| Roblox Cookie | - | Required for event fetching |

---

## For Developers

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Installation

```bash
git clone https://github.com/ysron56/Roblox-Notification.git
cd Roblox-Notification
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

Output: `release/Roblox Game Update Notification 1.0.0.exe`

---

## Project Structure

```
roblox-notif/
├── main.js              # Electron main process
├── preload.js           # IPC bridge
├── package.json         # Dependencies & scripts
├── src/
│   ├── App.jsx          # Root component
│   ├── index.jsx        # Entry point
│   ├── index.css        # Global styles
│   └── components/
│       ├── Sidebar.jsx           # Game list
│       ├── GameDetail.jsx        # Game info view
│       ├── AddGameModal.jsx      # Add game dialog
│       ├── Settings.jsx          # App settings
│       ├── Toast.jsx             # In-app notifications
│       └── NotificationPanel.jsx # Notification history
├── tailwind.config.js   # Tailwind config
├── vite.config.js       # Vite config
└── LICENSE              # MIT License
```

---

## What I Learned

Building this project helped me understand:

- **Electron Architecture** - Main vs Renderer process communication
- **IPC Security** - Context isolation and preload scripts
- **REST APIs** - Fetching and caching external data
- **State Management** - Local persistence with electron-store
- **Desktop UX** - System tray, notifications, and window management

---

## License

[MIT](LICENSE) © [ysron56](https://github.com/ysron56)

---

<div align="center">

**Made with ❤️ for the Roblox community**

If this project helped you, consider giving it a ⭐

</div>

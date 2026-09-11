import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import GameDetail from "./components/GameDetail";
import AddGameModal from "./components/AddGameModal";
import Settings from "./components/Settings";
import Toast from "./components/Toast";
import NotificationPanel from "./components/NotificationPanel";

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getGames().then((g) => {
      setGames(g);
      setLoading(false);
    });

    window.electronAPI.onGamesList((updatedGames) => {
      setGames(updatedGames);
    });

    window.electronAPI.onGameUpdated((updatedGame) => {
      setGames((prev) =>
        prev.map((g) => (g.id === updatedGame.id ? { ...g, ...updatedGame } : g))
      );
      if (selectedGame?.id === updatedGame.id) {
        setSelectedGame((prev) => ({ ...prev, ...updatedGame }));
      }
    });

    window.electronAPI.onSelectGame((gameId) => {
      const game = games.find((g) => g.id === gameId);
      if (game) setSelectedGame(game);
    });

    window.electronAPI.getNotifHistory().then((h) => {
      setNotifCount(h.length);
    });

    window.electronAPI.onNotifHistoryUpdate((h) => {
      setNotifCount(h.length);
    });
  }, []);

  const handleAddGame = async (placeId) => {
    const result = await window.electronAPI.addGame(placeId);
    if (result.error) return result;
    setGames((prev) => [...prev, result.game]);
    setShowAddModal(false);
    return result;
  };

  const handleRemoveGame = async (universeId) => {
    const updated = await window.electronAPI.removeGame(universeId);
    setGames(updated);
    if (selectedGame?.id === universeId) setSelectedGame(null);
  };

  const handleRefreshGame = async (universeId) => {
    const result = await window.electronAPI.refreshGame(universeId);
    if (result.success) {
      setGames((prev) =>
        prev.map((g) => (g.id === universeId ? { ...g, ...result.game } : g))
      );
      if (selectedGame?.id === universeId) {
        setSelectedGame((prev) => ({ ...prev, ...result.game }));
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Toast />
      {/* Custom Title Bar */}
      <div className="drag-bar flex items-center justify-between bg-roblox-dark border-b border-roblox-border/50 select-none">
        <div className="flex items-center gap-3 pl-4">
          <img src="icon.png" alt="Logo" className="w-5 h-5 rounded" />
          <span className="text-sm font-semibold text-gray-200">
            Roblox Game Update Notification
          </span>
        </div>
        <div className="flex no-drag">
          <button
            className="titlebar-btn relative"
            onClick={() => setShowNotifPanel(true)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-roblox-red text-[9px] text-white font-bold rounded-full flex items-center justify-center">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
          <button className="titlebar-btn" onClick={() => window.electronAPI.minimize()}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
            </svg>
          </button>
          <button className="titlebar-btn" onClick={() => window.electronAPI.maximize()}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
          <button className="titlebar-btn hover:!bg-red-600/80" onClick={() => window.electronAPI.close()}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          games={games}
          selectedGame={selectedGame}
          onSelectGame={setSelectedGame}
          onAddGame={() => setShowAddModal(true)}
          onRemoveGame={handleRemoveGame}
          onOpenSettings={() => setShowSettings(true)}
          loading={loading}
        />

        <main className="flex-1 overflow-y-auto">
          {selectedGame ? (
            <GameDetail
              game={selectedGame}
              onRefresh={handleRefreshGame}
              onRemove={handleRemoveGame}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center fade-in">
                <img src="icon.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-sm">
                  {games.length === 0
                    ? "Click + Add Game to get started"
                    : "Select a game from the sidebar"}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddGameModal
          onAdd={handleAddGame}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
      {showNotifPanel && (
        <NotificationPanel onClose={() => setShowNotifPanel(false)} />
      )}
    </div>
  );
}

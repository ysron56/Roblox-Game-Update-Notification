import React from "react";

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function timeAgo(dateStr) {
  if (!dateStr) return "Unknown";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Sidebar({
  games,
  selectedGame,
  onSelectGame,
  onAddGame,
  onRemoveGame,
  onOpenSettings,
  loading,
}) {
  return (
    <div className="w-72 bg-roblox-card/50 border-r border-roblox-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-roblox-border/50">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            Watchlist
          </h1>
          <span className="text-xs text-gray-500 bg-roblox-dark px-2 py-0.5 rounded-full">
            {games.length} games
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddGame}
            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Game
          </button>
          <button onClick={onOpenSettings} className="btn-icon" title="Settings">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Game List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-roblox-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>No games tracked</p>
            <p className="text-xs mt-1">Add a game to start monitoring</p>
          </div>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={`game-card slide-in ${
                selectedGame?.id === game.id ? "selected" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      game.thumbnail ||
                      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${game.id}&returnPolicy=PlaceHolder&size=100x100&format=Png&isCircular=false`
                    }
                    alt={game.name}
                    className="w-12 h-12 rounded-lg object-cover bg-roblox-dark"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M5.164 0L0 18.534l12.626 5.347L24 5.347 18.836 0H5.164z'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-200 truncate">
                    {game.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{game.creator}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="status-badge bg-roblox-green/20 text-roblox-green">
                      <span className="inline-block w-1.5 h-1.5 bg-roblox-green rounded-full mr-1" />
                      {formatNumber(game.playing)} playing
                    </span>
                    <span className="text-xs text-gray-500">
                      {timeAgo(game.lastUpdated)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

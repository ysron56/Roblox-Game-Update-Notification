import React from "react";

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
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
    <div className="w-60 bg-roblox-card border-r border-roblox-border flex flex-col">
      <div className="p-3 border-b border-roblox-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Watchlist
          </span>
          <span className="text-xs text-gray-500">
            {games.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddGame}
            className="flex-1 bg-roblox-accent hover:bg-roblox-accent/90 text-white text-sm font-medium py-1.5 rounded-md transition-colors"
          >
            + Add Game
          </button>
          <button onClick={onOpenSettings} className="btn-icon" title="Settings">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : games.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-gray-500">No games tracked</p>
            <p className="text-xs text-gray-600 mt-1">Click + Add Game to start</p>
          </div>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-100 ${
                selectedGame?.id === game.id
                  ? "bg-roblox-hover"
                  : "hover:bg-roblox-hover/50"
              }`}
            >
              <img
                src={
                  game.thumbnail ||
                  `https://thumbnails.roblox.com/v1/games/icons?universeIds=${game.id}&returnPolicy=PlaceHolder&size=100x100&format=Png&isCircular=false`
                }
                alt={game.name}
                className="w-10 h-10 rounded-md object-cover bg-roblox-dark flex-shrink-0"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23444'%3E%3Cpath d='M5.164 0L0 18.534l12.626 5.347L24 5.347 18.836 0H5.164z'/%3E%3C/svg%3E";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {game.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 bg-roblox-green rounded-full" />
                  <span className="text-xs text-gray-400">
                    {formatNumber(game.playing)} playing
                  </span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500">
                    {timeAgo(game.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

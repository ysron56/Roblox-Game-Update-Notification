import React, { useState, useEffect } from "react";

function formatNumber(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEventDate(iso) {
  if (!iso) return "TBA";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHrs / 24);

  const formatted = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMs < 0) return `${formatted}`;
  if (diffHrs < 1) return `${formatted} (in ${Math.floor(diffMs / 60000)}m)`;
  if (diffHrs < 24) return `${formatted} (in ${diffHrs}h)`;
  return `${formatted} (in ${diffDays}d)`;
}

export default function GameDetail({ game, onRefresh, onRemove }) {
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    setLoadingEvents(true);
    window.electronAPI.getGameEvents(game.id).then((e) => {
      setEvents(e);
      setLoadingEvents(false);
    });
  }, [game.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh(game.id);
    setRefreshing(false);
  };

  const isRecentlyUpdated =
    game.lastUpdated &&
    Date.now() - new Date(game.lastUpdated).getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <img
            src={game.thumbnail || ""}
            alt={game.name}
            className="w-16 h-16 rounded-lg object-cover bg-roblox-card"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{game.name}</h1>
            <p className="text-sm text-gray-400">by {game.creator}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-roblox-hover transition-colors"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
              <path d="M21 3v5h-5" />
            </svg>
            Refresh
          </button>
          <a
            href={`https://www.roblox.com/games/${game.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-roblox-hover transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            Open in Roblox
          </a>
          <div className="flex-1" />
          <button
            onClick={() => onRemove(game.id)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-roblox-card rounded-lg p-3">
            <p className="text-2xl font-bold text-white">{formatNumber(game.playing)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Playing Now</p>
          </div>
          <div className="bg-roblox-card rounded-lg p-3">
            <p className="text-2xl font-bold text-white">{formatNumber(game.visits)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Visits</p>
          </div>
          <div className="bg-roblox-card rounded-lg p-3">
            <p className="text-2xl font-bold text-white">{game.maxPlayers}</p>
            <p className="text-xs text-gray-500 mt-0.5">Max Players</p>
          </div>
          <div className="bg-roblox-card rounded-lg p-3">
            <p className="text-2xl font-bold text-white truncate">{game.genre}</p>
            <p className="text-xs text-gray-500 mt-0.5">Genre</p>
          </div>
        </div>
      </div>

      {/* Update Info */}
      <div className="px-6 pb-4">
        <div className="bg-roblox-card rounded-lg p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Update Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm text-gray-200 mt-0.5">{formatDate(game.created)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Updated</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-gray-200">{formatDate(game.lastUpdated)}</p>
                {isRecentlyUpdated && (
                  <span className="text-[10px] font-medium bg-roblox-green/20 text-roblox-green px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {game.description && (
        <div className="px-6 pb-4">
          <div className="bg-roblox-card rounded-lg p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Description
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {game.description}
            </p>
          </div>
        </div>
      )}

      {/* Events */}
      <div className="px-6 pb-4">
        <div className="bg-roblox-card rounded-lg p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Upcoming Events
          </h2>
          {loadingEvents ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming events</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-roblox-dark rounded-md p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200">{event.name}</p>
                      {event.host && (
                        <p className="text-xs text-gray-500 mt-0.5">by {event.host}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-medium bg-roblox-accent/20 text-roblox-accent px-1.5 py-0.5 rounded ml-2">
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{formatEventDate(event.startTime)}</span>
                    {event.endTime && (
                      <>
                        <span>→</span>
                        <span>{formatEventDate(event.endTime)}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* IDs */}
      <div className="px-6 pb-6">
        <div className="bg-roblox-card rounded-lg p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            IDs
          </h2>
          <div className="flex gap-4">
            <div>
              <span className="text-xs text-gray-500">Universe: </span>
              <code className="text-xs text-gray-300">{game.id}</code>
            </div>
            <div>
              <span className="text-xs text-gray-500">Place: </span>
              <code className="text-xs text-gray-300">{game.placeId}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

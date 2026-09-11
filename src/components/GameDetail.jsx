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
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return "Unknown";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} months ago`;
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
    <div className="h-full overflow-y-auto fade-in">
      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-br from-roblox-red/20 via-roblox-dark to-roblox-card">
        {game.thumbnail && (
          <img
            src={game.thumbnail}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-roblox-dark via-roblox-dark/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            <img
              src={game.thumbnail || ""}
              alt={game.name}
              className="w-20 h-20 rounded-xl object-cover border-2 border-roblox-border shadow-xl bg-roblox-card"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{game.name}</h1>
              <p className="text-gray-400 mt-0.5">by {game.creator}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-b border-roblox-border/50 px-6 py-3 flex items-center gap-3">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-ghost flex items-center gap-2 text-sm"
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
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          Open in Roblox
        </a>
        <div className="flex-1" />
        <button
          onClick={() => onRemove(game.id)}
          className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Remove
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
            label="Playing Now"
            value={formatNumber(game.playing)}
            color="text-roblox-green"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            label="Total Visits"
            value={formatNumber(game.visits)}
            color="text-roblox-accent"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
            label="Max Players"
            value={game.maxPlayers}
            color="text-roblox-yellow"
          />
          <StatCard
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
            label="Genre"
            value={game.genre}
            color="text-purple-400"
          />
        </div>

        {/* Update Info */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
            Update Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm text-gray-200">{formatDate(game.created)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Last Updated</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-200">
                  {formatDate(game.lastUpdated)}
                </p>
                {isRecentlyUpdated && (
                  <span className="status-badge bg-roblox-green/20 text-roblox-green">
                    Recent
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-roblox-dark rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Time Since Last Update</p>
            <p className="text-sm text-gray-200">{timeAgo(game.lastUpdated)}</p>
          </div>
        </div>

        {/* Description */}
        {game.description && (
          <div className="glass-card p-5">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
              Description
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {game.description}
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
            Upcoming Events
          </h2>
          {loadingEvents ? (
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-500">
              No upcoming events.{" "}
              <span className="text-xs text-gray-600">
                (Make sure your Roblox cookie is set in Settings)
              </span>
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-roblox-dark rounded-lg border border-roblox-border/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-200">{event.name}</h3>
                      {event.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                      )}
                      {event.host && (
                        <p className="text-xs text-gray-500 mt-1">Host: {event.host}</p>
                      )}
                    </div>
                    <span className="status-badge bg-roblox-accent/20 text-roblox-accent text-xs ml-2">
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      {formatEventDate(event.startTime)}
                    </div>
                    {event.endTime && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        Ends: {formatEventDate(event.endTime)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Game ID Info */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
            Game Info
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Universe ID:</span>
              <code className="text-xs text-roblox-accent bg-roblox-dark px-2 py-0.5 rounded">
                {game.id}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Place ID:</span>
              <code className="text-xs text-roblox-accent bg-roblox-dark px-2 py-0.5 rounded">
                {game.placeId}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass-card p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-xl font-bold text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
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

  if (diffMs < 0) return `${formatted} (ended)`;
  if (diffHrs < 1) return `${formatted} (in ${Math.floor(diffMs / 60000)}m)`;
  if (diffHrs < 24) return `${formatted} (in ${diffHrs}h)`;
  return `${formatted} (in ${diffDays}d)`;
}

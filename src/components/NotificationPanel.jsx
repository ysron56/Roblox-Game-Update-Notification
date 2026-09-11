import React, { useState, useEffect } from "react";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationPanel({ onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getNotifHistory().then((h) => {
      setHistory(h);
      setLoading(false);
    });

    window.electronAPI.onNotifHistoryUpdate((h) => {
      setHistory(h);
    });
  }, []);

  const handleClear = async () => {
    const updated = await window.electronAPI.clearNotifHistory();
    setHistory(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative glass-card w-full max-w-sm mx-4 p-5 fade-in shadow-2xl max-h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-roblox-accent/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-roblox-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Notifications</h2>
              <p className="text-xs text-gray-500">{history.length} notifications</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            history.map((notif, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  notif.type === "success"
                    ? "bg-green-500/10 border-green-500/20"
                    : notif.type === "warning"
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-roblox-accent/10 border-roblox-accent/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      notif.type === "success"
                        ? "bg-green-500/30"
                        : notif.type === "warning"
                        ? "bg-yellow-500/30"
                        : "bg-roblox-accent/30"
                    }`}
                  >
                    {notif.type === "success" ? (
                      <svg className="w-3 h-3 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : notif.type === "warning" ? (
                      <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v4m0 4h.01M12 2l10 18H2L12 2z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-roblox-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-100">{notif.title}</p>
                      <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                        {timeAgo(notif.time)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 whitespace-pre-line leading-relaxed">
                      {notif.body}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function AddGameModal({ onAdd, onClose }) {
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = placeId.trim();
    if (!trimmed) {
      setError("Please enter a Place ID");
      return;
    }
    if (!/^\d+$/.test(trimmed)) {
      setError("Place ID must be a number");
      return;
    }

    setLoading(true);
    setError("");

    const result = await onAdd(Number(trimmed));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card w-full max-w-md mx-4 p-6 fade-in shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-roblox-red/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-roblox-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-100">Add New Game</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the Place ID of the Roblox game to track
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Place ID
            </label>
            <input
              type="text"
              value={placeId}
              onChange={(e) => {
                setPlaceId(e.target.value);
                setError("");
              }}
              placeholder="e.g. 920587237"
              className="input-field w-full"
              autoFocus
              disabled={loading}
            />
            <p className="text-xs text-gray-600 mt-1.5">
              Find it in the game URL: roblox.com/games/<span className="text-gray-400">920587237</span>/...
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-roblox-border text-gray-400 hover:text-white hover:bg-roblox-hover transition-all text-sm font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !placeId.trim()}
              className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                    <path d="M21 3v5h-5" />
                  </svg>
                  Add Game
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

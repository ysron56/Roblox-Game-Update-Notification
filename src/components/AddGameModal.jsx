import React, { useState } from "react";

export default function AddGameModal({ onAdd, onClose }) {
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = placeId.trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) {
      setError("Enter a valid Place ID (numbers only)");
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
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-roblox-card border border-roblox-border rounded-lg w-full max-w-sm mx-4 p-5 fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-base font-semibold text-white mb-1">Add Game</h2>
        <p className="text-xs text-gray-500 mb-4">
          Enter the Place ID from the game's URL
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={placeId}
            onChange={(e) => {
              setPlaceId(e.target.value);
              setError("");
            }}
            placeholder="Place ID (e.g. 920587237)"
            className="input-field w-full mb-2"
            autoFocus
            disabled={loading}
          />

          {error && (
            <p className="text-xs text-red-400 mb-2">{error}</p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm text-gray-400 hover:text-white border border-roblox-border rounded-md hover:bg-roblox-hover transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !placeId.trim()}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-roblox-accent hover:bg-roblox-accent/90 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

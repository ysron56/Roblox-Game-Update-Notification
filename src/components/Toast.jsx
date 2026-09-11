import React, { useState, useEffect } from "react";

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    window.electronAPI.onShowToast((toast) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto max-w-sm w-80 p-4 rounded-xl shadow-2xl border backdrop-blur-xl fade-in ${
            toast.type === "success"
              ? "bg-green-500/20 border-green-500/40"
              : toast.type === "warning"
              ? "bg-yellow-500/20 border-yellow-500/40"
              : "bg-roblox-accent/20 border-roblox-accent/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                toast.type === "success"
                  ? "bg-green-500/30"
                  : toast.type === "warning"
                  ? "bg-yellow-500/30"
                  : "bg-roblox-accent/30"
              }`}
            >
              {toast.type === "success" ? (
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : toast.type === "warning" ? (
                <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M12 2l10 18H2L12 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-roblox-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-100">{toast.title}</p>
              <p className="text-xs text-gray-400 mt-1 whitespace-pre-line">{toast.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

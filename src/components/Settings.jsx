import React, { useState, useEffect } from "react";

export default function Settings({ onClose }) {
  const [settings, setSettings] = useState({
    checkInterval: 5,
    notificationsEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.electronAPI.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await window.electronAPI.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative glass-card w-full max-w-md mx-4 p-6 fade-in shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 bg-roblox-accent/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-roblox-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-100">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure notification behavior</p>
        </div>

        <div className="space-y-5">
          {/* Check Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Check Interval
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="60"
                value={settings.checkInterval}
                onChange={(e) =>
                  setSettings({ ...settings, checkInterval: Number(e.target.value) })
                }
                className="flex-1 accent-roblox-red h-1.5 bg-roblox-border rounded-full appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-200 bg-roblox-dark px-3 py-1 rounded-lg min-w-[60px] text-center">
                {settings.checkInterval} min
              </span>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Notifications</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Show desktop notification on game update
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  notificationsEnabled: !settings.notificationsEnabled,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                settings.notificationsEnabled ? "bg-roblox-green" : "bg-roblox-border"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.notificationsEnabled ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Event Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Event Notifications</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Notify when events start or are about to start
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  eventNotificationsEnabled: !settings.eventNotificationsEnabled,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                settings.eventNotificationsEnabled ? "bg-roblox-green" : "bg-roblox-border"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.eventNotificationsEnabled ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Event Reminder Minutes */}
          {settings.eventNotificationsEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Event Reminder
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={settings.eventReminderMinutes || 30}
                  onChange={(e) =>
                    setSettings({ ...settings, eventReminderMinutes: Number(e.target.value) })
                  }
                  className="flex-1 accent-roblox-red h-1.5 bg-roblox-border rounded-full appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-200 bg-roblox-dark px-3 py-1 rounded-lg min-w-[60px] text-center">
                  {settings.eventReminderMinutes || 30} min
                </span>
              </div>
            </div>
          )}

          {/* Roblox Cookie */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Roblox Cookie (.ROBLOSECURITY)
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Required for Upcoming Events. Get it from your browser cookies while logged into Roblox.
            </p>
            <textarea
              value={settings.robloxCookie || ""}
              onChange={(e) =>
                setSettings({ ...settings, robloxCookie: e.target.value })
              }
              placeholder="Paste your .ROBLOSECURITY cookie here..."
              className="w-full bg-roblox-dark border border-roblox-border rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-roblox-accent resize-none h-20"
            />
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="w-full btn-primary py-2.5 mt-2">
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Saved!
              </span>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

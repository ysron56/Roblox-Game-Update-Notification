import React, { useState, useEffect } from "react";

export default function Settings({ onClose }) {
  const [settings, setSettings] = useState({
    checkInterval: 5,
    notificationsEnabled: true,
    eventNotificationsEnabled: true,
    eventReminderMinutes: 30,
    robloxCookie: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.electronAPI.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await window.electronAPI.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
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

        <h2 className="text-base font-semibold text-white mb-4">Settings</h2>

        <div className="space-y-4">
          {/* Check Interval */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Check Interval ({settings.checkInterval} min)
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={settings.checkInterval}
              onChange={(e) =>
                setSettings({ ...settings, checkInterval: Number(e.target.value) })
              }
              className="w-full accent-roblox-accent h-1 bg-roblox-border rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-200">Notifications</p>
              <p className="text-xs text-gray-500">Game update alerts</p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })
              }
              className={`w-10 h-5 rounded-full transition-colors ${
                settings.notificationsEnabled ? "bg-roblox-green" : "bg-roblox-border"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
                  settings.notificationsEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* Event Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-200">Event Alerts</p>
              <p className="text-xs text-gray-500">Event start reminders</p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, eventNotificationsEnabled: !settings.eventNotificationsEnabled })
              }
              className={`w-10 h-5 rounded-full transition-colors ${
                settings.eventNotificationsEnabled ? "bg-roblox-green" : "bg-roblox-border"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
                  settings.eventNotificationsEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* Reminder */}
          {settings.eventNotificationsEnabled && (
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                Reminder ({settings.eventReminderMinutes || 30} min before)
              </label>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.eventReminderMinutes || 30}
                onChange={(e) =>
                  setSettings({ ...settings, eventReminderMinutes: Number(e.target.value) })
                }
                className="w-full accent-roblox-accent h-1 bg-roblox-border rounded-full appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Cookie */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">
              Roblox Cookie (.ROBLOSECURITY)
            </label>
            <textarea
              value={settings.robloxCookie || ""}
              onChange={(e) =>
                setSettings({ ...settings, robloxCookie: e.target.value })
              }
              placeholder="Required for events..."
              className="input-field w-full h-16 resize-none text-xs"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-2 text-sm font-medium text-white bg-roblox-accent hover:bg-roblox-accent/90 rounded-md transition-colors"
          >
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

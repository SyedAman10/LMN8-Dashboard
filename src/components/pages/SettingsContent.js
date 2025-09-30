export default function SettingsContent() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
          <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input type="text" className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white" defaultValue="Dr. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white" defaultValue="jane.doe@lmn8.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">License Number</label>
              <input type="text" className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white" defaultValue="LCSW-12345" />
            </div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
          <h3 className="text-xl font-semibold text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Email Notifications</span>
              <input type="checkbox" className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Session Reminders</span>
              <input type="checkbox" className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Dark Mode</span>
              <input type="checkbox" className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-600 rounded" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

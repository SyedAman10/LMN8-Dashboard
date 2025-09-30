export default function OnboardingContent({ onAddPatient, onImportPatient, onCreatePlan }) {

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
          <h3 className="text-xl font-semibold text-white mb-4">Patient Onboarding Process</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400">1</span>
              </div>
              <span className="text-white">Clinical Assessment</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400">2</span>
              </div>
              <span className="text-white">Medical History Review</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400">3</span>
              </div>
              <span className="text-white">Informed Consent & Safety Protocol</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400">4</span>
              </div>
              <span className="text-white">Treatment Plan Creation</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={onAddPatient}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Add New Patient
            </button>
            <button 
              onClick={onImportPatient}
              className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Import Patient Records
            </button>
            <button 
              onClick={onCreatePlan}
              className="w-full bg-slate-600/50 hover:bg-slate-600/70 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Create Treatment Plan
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

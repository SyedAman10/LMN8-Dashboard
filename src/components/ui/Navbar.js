export default function Navbar({ children }) {
  return (
    <nav className="nav-lmn8 fixed top-4 left-4 right-4 z-50 flex justify-between items-center px-5 py-3 rounded-2xl">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-accent-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(91,192,190,0.35)]">
          <span className="text-bg-dark font-bold text-sm tracking-tight">MT8</span>
        </div>
        <div>
          <span className="text-text-100 font-semibold tracking-widest" style={{letterSpacing: '-0.02em'}}>METAT8</span>
          <span className="text-text-60 text-[9px] block -mt-0.5 uppercase tracking-[0.2em]">ClinicOS</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {children}
      </div>
    </nav>
  );
}

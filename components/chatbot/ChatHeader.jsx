export default function ChatHeader({ onClose }) {
  return (
    <div className="bg-black text-white p-4 flex justify-between items-center rounded-t-2xl shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
          A
        </div>
        <div>
          <h3 className="font-semibold text-md">Advayur Support</h3>
          <p className="text-xs text-gray-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
            Online
          </p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="text-gray-300 hover:text-white transition-colors"
        aria-label="Close chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className={`p-3 rounded-full flex items-center justify-center transition-all ${
          text.trim() && !isLoading
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}

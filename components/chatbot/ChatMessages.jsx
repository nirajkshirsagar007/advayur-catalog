import MessageBubble from './MessageBubble';

export default function ChatMessages({ messages, isLoading, onSendMessage, messagesEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white custom-scrollbar">
      {messages.map((msg) => (
        <MessageBubble 
          key={msg.id} 
          message={msg} 
          onSelectSuggestion={onSendMessage} 
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

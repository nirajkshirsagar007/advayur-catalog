import ProductCard from './ProductCard';
import SuggestedQuestions from './SuggestedQuestions';
import QuickActions from './QuickActions';

export default function MessageBubble({ message, onSelectSuggestion }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 w-full`}>
      <div className={`max-w-[85%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div 
          className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm ${
            isBot 
              ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
              : 'bg-black text-white rounded-tr-none'
          }`}
        >
          {message.text}
        </div>
        
        {message.type === 'greeting' && (
          <SuggestedQuestions 
            suggestions={message.suggestions} 
            onSelect={onSelectSuggestion} 
          />
        )}

        {message.type === 'product' && message.product && (
          <ProductCard product={message.product} />
        )}

        {(message.type === 'unknown' || message.type === 'contact') && (
          <QuickActions />
        )}
        
        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

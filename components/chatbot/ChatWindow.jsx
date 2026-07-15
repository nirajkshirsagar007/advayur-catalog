"use client";

import { useChat } from '../../hooks/useChat';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatButton from './ChatButton';

export default function ChatWindow() {
  const { 
    messages, 
    isOpen, 
    isLoading, 
    toggleChat, 
    sendMessage, 
    messagesEndRef 
  } = useChat();

  return (
    <>
      {/* The Chat UI */}
      <div 
        className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ChatHeader onClose={toggleChat} />
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={sendMessage}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading} 
        />
      </div>

      {/* The Floating Toggle Button */}
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
    </>
  );
}

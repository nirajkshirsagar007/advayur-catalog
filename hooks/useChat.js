import { useState, useEffect, useRef } from 'react';
import { INITIAL_GREETING, CHATBOT_SUGGESTIONS } from '../lib/chatbot';

const STORAGE_KEY = 'advayur_chatbot_history';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load from local storage or set initial
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
        setInitialGreeting();
      }
    } else {
      setInitialGreeting();
    }
  }, []);

  // Save to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const setInitialGreeting = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        type: 'greeting',
        text: INITIAL_GREETING,
        suggestions: CHATBOT_SUGGESTIONS,
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Small artificial delay to feel more natural
      await new Promise(res => setTimeout(res, 300));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        type: data.type || 'text',
        text: data.text,
        product: data.product, // optional
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        type: 'text',
        text: 'Sorry, I am having trouble connecting right now. Please try again later.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setInitialGreeting();
  };

  return {
    messages,
    isOpen,
    isLoading,
    toggleChat,
    sendMessage,
    clearHistory,
    messagesEndRef
  };
}

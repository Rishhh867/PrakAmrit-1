
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAyurvedicAdvice } from '../services/geminiService';

const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste! I am your *Milanà Ayurvedic Guide*. How can I help you with *Vata*, *Pitta*, or *Kapha* balancing herbs today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await getAyurvedicAdvice(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsTyping(false);
  };

  // Helper to parse formatting (single asterisks for bold)
  const renderMessageText = (text: string) => {
    // Split by single asterisks
    const parts = text.split('*');
    return parts.map((part, index) => {
      // Even indices are normal text, Odd indices are bold (wrapped in *)
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-prak-dark/90">{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 p-0 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 group ${
          isOpen ? 'rotate-0' : 'rotate-0'
        }`}
        aria-label="Toggle AI Consultant"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden ${isOpen ? 'bg-red-500' : 'bg-prak-dark'}`}>
          {/* Animated glow background */}
          {!isOpen && <div className="absolute inset-0 bg-gradient-to-tr from-prak-green to-prak-gold opacity-50 animate-spin-slow"></div>}
          
          <div className="relative z-10 text-white">
            {isOpen ? <X size={28} /> : <Sparkles size={28} className="animate-pulse" />}
          </div>
        </div>
        {/* Tooltip */}
        {!isOpen && (
           <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold text-prak-dark whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             Ask AI Consultant
           </span>
        )}
      </button>

      {/* Modern Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] glass-panel rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up border-white/40">
          {/* Header */}
          <div className="bg-gradient-to-r from-prak-dark to-prak-green p-5 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/20">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-serif font-bold text-lg leading-tight">Veda AI</h3>
                <p className="text-white/60 text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors relative z-10">
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-white/40 backdrop-blur-sm scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-prak-brown text-white' : 'bg-white text-prak-green border border-prak-green/20'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-prak-brown to-[#b07d5b] text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-white text-prak-green border border-prak-green/20 flex items-center justify-center shadow-sm">
                   <Bot size={16} />
                 </div>
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-prak-green/60 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-prak-green/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-prak-green/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/80 border-t border-white/50 backdrop-blur-md">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Doshas, herbs..."
                className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl pl-5 pr-14 py-3.5 text-sm focus:ring-2 focus:ring-prak-green/30 focus:border-prak-green/30 outline-none transition-all placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-prak-dark text-white rounded-xl hover:bg-prak-green disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIConsultant;

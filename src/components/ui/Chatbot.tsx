"use client";

import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { X, Send, Smile, ChevronDown, Phone, Mail, User, PhoneCall, MessageSquare } from 'lucide-react';
import ChatbotIcon from "./ChatbotIcon";

const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  type?: 'text' | 'options';
  options?: string[];
}

interface QuickReply {
  text: string;
  category?: string;
}

const EnhancedChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  const [userData, setUserData] = useState({ name: '', phone: '', email: '' });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm Design House Assistant. Ask me anything about our services!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  // Audio for "Pop" sound
  const popSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
  }, []);

  const playPopSound = () => {
    if (popSound.current) {
      popSound.current.currentTime = 0;
      popSound.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('chatbot_user');
    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
        setIsIdentified(true);
      } catch (e) {
        localStorage.removeItem('chatbot_user');
      }
    }
  }, []);

  const portfolioQuestions: QuickReply[] = [
    { text: 'What interior services do you offer?', category: 'interiors' },
    { text: 'Retail Interior design solutions?', category: 'retail' },
    { text: 'Corporate & Office interiors?', category: 'corporate' },
    { text: 'Restaurant & Cafe designs?', category: 'restaurant' },
    { text: 'What are Shop in Shop services?', category: 'shopinshop' },
    { text: 'Tell me about Merchandising?', category: 'merchandising' },
    { text: 'What are Kiosk services?', category: 'kiosk' },
    { text: 'Exhibition & Events setups?', category: 'events' },
    { text: 'How can I contact your team?', category: 'contact' },
  ];

  const responses: Record<string, string> = {
    interiors: `We offer a full spectrum of interior design services:
• Retail Interiors
• Corporate Offices
• Luxury Residential
• Hospitality & Restaurants
• Turnkey Solutions

View our projects: www.designhouseindia.com/portfolio`,

    retail: `Retail Interiors are our core specialty!
✓ Brand-centric layouts
✓ Optimized customer flow
✓ Custom lighting & displays
✓ High-end finishes

We turn retail spaces into engaging customer experiences.`,

    corporate: `Corporate Interior Solutions:
✓ Productive Office Layouts
✓ Modular Workstations
✓ Executive Cabins
✓ Conference & Meeting Rooms
✓ Sustainable Office Environments

We focus on ergonomics and employee well-being!`,

    restaurant: `Restaurant & Hospitality Design:
✓ Thematic Dining Concepts
✓ Commercial Kitchen Planning
✓ Ambient Lighting & Acoustics
✓ Custom Furniture & Bar Units

We create unique atmospheres that keep customers coming back!`,

    shopinshop: `Shop In Shop (SIS) Concepts:
✓ Modular boutique structures
✓ Brand identity integration
✓ Easy-to-install display units
✓ High-quality fabrication

Perfect for malls and multi-brand outlets!`,

    merchandising: `Retail Merchandising Solutions:
✓ Window & Facade Displays
✓ In-store Signage & Banners
✓ Product Display Stands
✓ Visual Merchandising Strategy

Drive sales with eye-catching product presentations!`,

    kiosk: `Retail Kiosks & Pavement Booths:
✓ Compact & Durable Designs
✓ Integrated Power & Lighting
✓ Mobile / Portable Options
✓ 360-degree Brand Visibility

Optimized for high-traffic mall corridors and lobbies!`,

    events: `Exhibition & Event Fabrications:
✓ Custom Stall Designs (3D)
✓ Trade Show Booths
✓ Product Launch Setups
✓ Corporate Brand Activations

We handle everything from design to onsite installation!`,

    contact: `Our team is ready to assist you!
📧 Email: info@designhouseindia.com
📞 Phone: +91-9876543210
📍 Visit us: Design House India Pvt. Ltd. [HQ Address]

Would you like a call back from our design expert?`,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 1) {
       playPopSound();
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMinimized]);

  const addBotResponse = async (text: string) => {
    // 1st Message starts typing after a VERY SHORT initial delay to confirm user click
    setTimeout(() => {
        setIsTyping(true);
        
        // Simulating thinking (3.5s - 4.5s) - Increased for realism
        const thinkingDelay = Math.floor(Math.random() * 1000) + 3500;
        
        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now().toString(),
                text,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);

            // pause, then type closing message
            setTimeout(() => {
                setIsTyping(true);
                
                // Final closing typing delay (3s)
                setTimeout(() => {
                    const closingMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "✨ Our expert team will review your requirement and contact you soon for more details!",
                        sender: 'bot',
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, closingMsg]);
                    setIsTyping(false);
                }, 3000);
            }, 2000); // 2s gap before starting to type closing message
        }, thinkingDelay);
    }, 500); // 500ms small gap
  };

  const handleQuickReply = (reply: QuickReply) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setShowQuickReplies(false);

    const responseText = reply.category
      ? responses[reply.category]
      : "Thank you for showing interest! Our specialized team will reach out to you with more information.";
    addBotResponse(responseText);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue.toLowerCase();
    setInputValue('');
    setShowQuickReplies(false);

    let responseText = "Thanks for reaching out! A design expert from Design House will analyze your query and contact you at the earliest.";

    if (query.includes('interior')) responseText = responses.interiors;
    else if (query.includes('retail')) responseText = responses.retail;
    else if (query.includes('corporate') || query.includes('office')) responseText = responses.corporate;
    else if (query.includes('restaurant')) responseText = responses.restaurant;
    else if (query.includes('shop')) responseText = responses.shopinshop;
    else if (query.includes('merchandising')) responseText = responses.merchandising;
    else if (query.includes('kiosk')) responseText = responses.kiosk;
    else if (query.includes('event') || query.includes('exhibition')) responseText = responses.events;
    else if (query.includes('contact')) responseText = responses.contact;

    addBotResponse(responseText);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name && userData.phone && userData.email) {
      setIsIdentified(true);
      localStorage.setItem('chatbot_user', JSON.stringify(userData));
      
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        text: `Hello ${userData.name}! Thank you for sharing your details. How can I help you with your interior design needs today?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, welcomeMsg]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-10 z-50 group p-2"
          aria-label="Open chat"
        >
          <div className="relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
              <svg width="140" height="70" viewBox="0 0 140 70">
                <defs>
                  <path id="curve" d="M 10 55 Q 70 10 130 55" fill="transparent" />
                </defs>
                <text>
                  <textPath
                    href="#curve"
                    startOffset="50%"
                    textAnchor="middle"
                    style={{
                      fill: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '800',
                      fontFamily: 'Arial, sans-serif',
                      letterSpacing: '1.1px',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))'
                    }}
                  >
                    We Are Here!
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#1E3988] rounded-full animate-ping opacity-75"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#1E3988] to-[#152B6B] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#1E3988]/50 transition-all hover:scale-110">
                <ChatbotIcon size={50} />
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-0 sm:bottom-6 right-0 sm:right-10 z-[1000] bg-white sm:rounded-2xl shadow-2xl transition-all duration-300 overscroll-contain
            ${isMinimized ? 'w-full sm:w-72 h-14' : 'w-full sm:w-96 h-full sm:h-[500px] max-h-screen sm:max-h-[600px]'} 
            flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E3988] via-[#2A4AA8] to-[#1E3988] text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[#1E3988] rounded-full flex items-center justify-center shadow-md">
                  <ChatbotIcon size={40} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-[#1E3988] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-base">Design House India</h3>
                <p className="text-xs text-green-300 flex items-center gap-2 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-[#152B6B]/50 p-2 rounded-lg transition"
              >
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-[#152B6B]/50 p-2 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 flex flex-col overflow-hidden overscroll-contain">
              {!isIdentified ? (
                /* Lead Form View */
                <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50 overflow-y-auto overscroll-contain">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-8 h-8 text-[#1E3988]" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Hi There!</h4>
                        <p className="text-sm text-gray-500">Before we start, please let us know how to reach you.</p>
                    </div>
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="text"
                                placeholder="Your Name"
                                value={userData.name}
                                onChange={(e) => setUserData({...userData, name: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3988] outline-none text-sm transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <PhoneCall className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="tel"
                                placeholder="Phone Number"
                                value={userData.phone}
                                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3988] outline-none text-sm transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="email"
                                placeholder="Email Address"
                                value={userData.email}
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3988] outline-none text-sm transition-all shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#1E3988] to-[#152B6B] text-white font-bold rounded-xl shadow-lg hover:shadow-[#1E3988]/40 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Start Chatting
                        </button>
                    </form>
                    <p className="text-[10px] text-center text-gray-400 mt-6 uppercase tracking-widest font-medium">Design House India Private Limited</p>
                </div>
              ) : (
                /* Chat View */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200 overscroll-contain">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-bubblePop`}>
                        {message.sender === 'bot' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-[#1E3988] to-[#152B6B] rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-sm self-end mb-1">
                            <ChatbotIcon size={20} />
                          </div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-line ${message.sender === 'user' ? 'bg-[#1E3988] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <span className="text-[10px] opacity-70 mt-1 block font-medium">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start animate-bubblePop">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#1E3988] to-[#152B6B] rounded-full flex items-center justify-center mr-2 self-end mb-1">
                          <ChatbotIcon size={20} />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-[#1E3988] rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-[#1E3988] rounded-full animate-bounce [animation-delay:0.1s]"></span>
                            <span className="w-1.5 h-1.5 bg-[#1E3988] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {showQuickReplies && !isTyping && (
                      <div className="space-y-2 pt-2 pb-4">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Quick Services:</p>
                        <div className="flex flex-col gap-2 overscroll-contain">
                          {portfolioQuestions.map((reply, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickReply(reply)}
                              className="text-left px-5 py-3 bg-white border-2 border-[#1E3988]/10 text-[#1E3988] rounded-xl text-sm font-semibold hover:bg-blue-50 hover:border-[#1E3988] transition-all shadow-sm flex items-center gap-2 group"
                            >
                                <MessageSquare className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                {reply.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-100 relative flex-shrink-0">
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 right-0 z-50 bg-white border-t shadow-2xl p-2 h-[200px] overflow-hidden">
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#134698] border-t-transparent rounded-full animate-spin" /></div>}>
                          <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height={200} searchDisabled skinTonesDisabled previewConfig={{ showPreview: false }} />
                        </Suspense>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type message here…"
                        className="flex-1 px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#1E3988] focus:bg-white rounded-xl outline-none text-sm transition-all"
                      />
                      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-gray-400 hover:text-[#1E3988] transition">
                        <Smile className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className={`p-3 rounded-xl transition-all shadow-lg ${inputValue.trim() ? "bg-[#1E3988] text-white hover:scale-105 active:scale-95" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bubblePop {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bubblePop {
          animation: bubblePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default EnhancedChatbot;
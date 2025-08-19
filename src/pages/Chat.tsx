import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService, Chat as ChatType, Message } from '../services';
import styles from './Chat.module.css';
import { TooltipProvider } from '../components/ui/tooltip';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState<ChatType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  // Load chat data
  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Load chat info
        const chatResponse = await chatService.getChatById(chatId);
        setChatInfo(chatResponse.chat);
        
        // Load chat messages
        const messagesResponse = await chatService.getChatMessages(chatId);
        setMessages(messagesResponse.messages);
        
      } catch (error) {
        console.error('Error loading chat:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatData();
  }, [chatId, navigate]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !chatId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      // Send message to API
      const response = await chatService.sendMessage(chatId, {
        content: messageContent
      });

      // Add both user and bot messages to state
      setMessages(prev => [...prev, response.userMessage, response.botMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on error
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sr-RS', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getModeDisplayName = (mode: string) => {
    const modeMap = {
      explain: 'Objašnjavanje',
      solve: 'Rešavanje',
      summary: 'Sažetak',
      tests: 'Testovi',
      learning: 'Učenje'
    };
    return modeMap[mode as keyof typeof modeMap] || mode;
  };

  if (isLoading) {
    return (
      <div className={styles.chatPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Učitavam chat...</p>
        </div>
      </div>
    );
  }

  if (!chatInfo) {
    return (
      <div className={styles.chatPage}>
        <div className={styles.errorContainer}>
          <p>Chat nije pronađen</p>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            Nazad na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#0B0F1A] text-white font-inter">
        
        {/* Chat Header */}
        <header className="flex-shrink-0 border-b border-[#4E3CFA]/10 px-6 py-4 bg-[#0B0F1A]">
          <div className="flex items-center gap-4">
            <button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4E3CFA]/30 transition-all duration-300 hover:scale-105 text-gray-400 hover:text-white"
              onClick={() => navigate('/dashboard')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-1">
                {chatInfo.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge 
                  className={`${{
                    explain: 'bg-[#4E3CFA]/10 text-[#4E3CFA] border-[#4E3CFA]/20',
                    solve: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                    summary: 'bg-green-500/10 text-green-400 border-green-500/20',
                    tests: 'bg-red-500/10 text-red-400 border-red-500/20',
                    learning: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }[chatInfo.mode as keyof typeof getModeDisplayName] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'} border`}
                >
                  {getModeDisplayName(chatInfo.mode)}
                </Badge>
                {chatInfo.subject && (
                  <span className="text-sm text-gray-400">
                    {chatInfo.subject.name} ({chatInfo.subject.code})
                  </span>
                )}
              </div>
            </div>

            <button className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4E3CFA]/30 transition-all duration-300 hover:scale-105 text-gray-400 hover:text-white" title="Opcije chata">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs font-semibold ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-[#4E3CFA]/20 via-[#4E3CFA]/10 to-[#4E3CFA]/5 text-[#4E3CFA] border border-[#4E3CFA]/20' 
                        : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent text-white border border-white/20'
                    }`}>
                      {message.type === 'user' ? (user?.firstName?.[0] || 'U') : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Card className={`group transition-all duration-300 hover:shadow-lg backdrop-blur-xl border ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-[#4E3CFA]/20 via-[#4E3CFA]/15 to-[#4E3CFA]/8 border-[#4E3CFA]/40 shadow-xl shadow-[#4E3CFA]/30 hover:shadow-[#4E3CFA]/50'
                      : 'bg-gradient-to-br from-[#1C212B]/95 via-[#1A1F29]/90 to-[#16191F]/85 border-white/30 shadow-lg hover:shadow-white/20'
                  }`}>
                    <CardContent className="p-4">
                      <div className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <span>{formatTime(message.createdAt)}</span>
                        {message.isEdited && (
                          <>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>uređeno</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            
            {isSending && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[85%]">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-white/10 via-white/5 to-transparent text-white border border-white/20">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  
                  <Card className="group transition-all duration-300 backdrop-blur-xl border bg-gradient-to-br from-[#0B0F1A]/90 via-[#0B0F1A]/80 to-[#0B0F1A]/70 border-[#4E3CFA]/10 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#4E3CFA] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-[#4E3CFA] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-[#4E3CFA] rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">Kucam...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <footer className="flex-shrink-0 border-t border-[#4E3CFA]/10 bg-[#0B0F1A] px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white/5 border border-white/10 hover:border-[#4E3CFA]/30 focus-within:border-[#4E3CFA]/50 rounded-xl p-3 transition-all duration-300">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent text-white placeholder:text-gray-400 resize-none outline-none pr-12 text-sm leading-relaxed"
                placeholder="Napišite poruku..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                rows={1}
                style={{ maxHeight: '200px' }}
              />
              <button 
                className="absolute right-2 bottom-2 w-8 h-8 bg-[#4E3CFA] hover:bg-[#4E3CFA]/90 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default Chat;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService, Chat as ChatType, Message } from '../services';
import styles from './Chat.module.css';
import { TooltipProvider } from '../components/ui/tooltip';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Send, MessageCircle, Bot, User, Sparkles } from 'lucide-react';

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
        navigate('/home');
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-screen bg-zinc-950 text-white font-inter"
      >
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div 
              className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-300">Učitavam chat...</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!chatInfo) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-screen bg-zinc-950 text-white font-inter"
      >
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <motion.div 
              className="mx-auto mb-6 p-6 bg-gradient-to-br from-zinc-800/50 via-zinc-700/30 to-zinc-800/20 rounded-3xl w-fit shadow-lg relative"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageCircle className="w-16 h-16 text-gray-400" />
            </motion.div>
            <p className="text-xl font-bold text-white mb-4">Chat nije pronađen</p>
            <motion.button 
              onClick={() => navigate('/home')} 
              className="bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Nazad na početnu
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col h-screen bg-zinc-950 text-white font-inter relative"
      >
        {/* NADRKAN Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-zinc-900/40 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.06),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.03),transparent)] bg-repeat bg-[length:150px_150px] pointer-events-none opacity-40" />
        
        {/* Floating chat elements animation */}
        <div className="absolute inset-0 -z-5 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0.4 + Math.random() * 0.6,
              }}
              animate={{
                y: [null, Math.random() * -100, Math.random() * 100],
                x: [null, Math.random() * -50, Math.random() * 50],
                rotate: [0, Math.random() * 180],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: Math.random() * 30 + 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 10,
              }}
            >
              {[MessageCircle, Sparkles][i % 2] && 
                React.createElement([MessageCircle, Sparkles][i % 2], {
                  className: "w-4 h-4 text-white/10"
                })
              }
            </motion.div>
          ))}
        </div>
        
        {/* NADRKAN Chat Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-shrink-0 px-6 py-6 relative z-10"
        >
          <div className="flex items-center gap-4">
            <motion.button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 text-gray-400 hover:text-white"
              onClick={() => navigate('/home')}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex-1"
            >
              <h1 className="text-xl font-bold bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-1">
                {chatInfo.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge 
                  className={`${{
                    explain: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    solve: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                    summary: 'bg-green-500/20 text-green-400 border-green-500/30',
                    tests: 'bg-red-500/20 text-red-400 border-red-500/30',
                    learning: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  }[chatInfo.mode as keyof typeof getModeDisplayName] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border`}
                >
                  {getModeDisplayName(chatInfo.mode)}
                </Badge>
                {chatInfo.subject && (
                  <span className="text-sm text-gray-300">
                    {chatInfo.subject.name} ({chatInfo.subject.code})
                  </span>
                )}
              </div>
            </motion.div>

            <motion.button 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 text-gray-400 hover:text-white" 
              title="Opcije chata"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* NADRKAN Messages Area */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="w-full mx-auto px-6 py-4 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div 
                  key={message.id} 
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.4, type: "spring" }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    className={`flex gap-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={`text-xs font-semibold ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-500/10 text-blue-400 border border-blue-500/30' 
                            : 'bg-gradient-to-br from-zinc-700/50 via-zinc-600/30 to-zinc-700/20 text-white border border-zinc-600/30'
                        }`}>
                          {message.type === 'user' ? (user?.firstName?.[0] || <User className="w-4 h-4" />) : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Card className={`group transition-all duration-500 backdrop-blur-xl border relative overflow-hidden ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500/20 via-blue-500/15 to-blue-500/8 border-blue-500/40 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30'
                          : 'bg-gradient-to-br from-zinc-900/90 via-zinc-800/80 to-zinc-900/70 border-zinc-700/50 shadow-lg shadow-black/20 hover:shadow-black/30'
                      }`}>
                        {/* Animated glow effect for user messages */}
                        {message.type === 'user' && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-xl"></div>
                          </div>
                        )}
                        
                        {/* Subtle glow for bot messages */}
                        {message.type === 'bot' && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-600/10 via-zinc-500/10 to-zinc-600/10 blur-xl"></div>
                          </div>
                        )}
                        
                        <CardContent className="p-4 relative z-10">
                          <motion.div 
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            className="text-sm leading-relaxed text-white whitespace-pre-wrap"
                          >
                            {message.content}
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 mt-3 text-xs text-gray-400"
                          >
                            <span>{formatTime(message.createdAt)}</span>
                            {message.isEdited && (
                              <>
                                <motion.span 
                                  className="w-1 h-1 bg-gray-400 rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span>uređeno</span>
                              </>
                            )}
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {isSending && (
                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="flex justify-start"
                >
                  <motion.div 
                    className="flex gap-4 max-w-[85%]"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-zinc-700/50 via-zinc-600/30 to-zinc-700/20 text-white border border-zinc-600/30">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    <Card className="group transition-all duration-300 backdrop-blur-xl border bg-gradient-to-br from-zinc-900/90 via-zinc-800/80 to-zinc-900/70 border-zinc-700/30 shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <motion.div 
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 ml-2">Kucam...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* NADRKAN Input Area */}
        <motion.footer 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex-shrink-0 px-6 py-6 relative z-10"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="relative bg-zinc-900/50 border border-zinc-700/50 hover:border-zinc-600/50 focus-within:border-blue-500/50 rounded-xl p-3 transition-all duration-300 backdrop-blur-xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.textarea
                ref={textareaRef}
                className="w-full bg-transparent text-white placeholder:text-gray-400 resize-none outline-none pr-12 text-sm leading-relaxed"
                placeholder="Napišite poruku..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                rows={1}
                style={{ maxHeight: '200px' }}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
              />
              <motion.button 
                className="absolute right-2 bottom-2 w-8 h-8 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 hover:from-zinc-600 hover:via-zinc-700 hover:to-zinc-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-black/30"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </motion.footer>
      </motion.div>
    </TooltipProvider>
  );
};

export default Chat;
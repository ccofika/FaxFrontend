import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService, Chat as ChatType, Message } from '../services';
import styles from './Chat.module.css';

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
    <div className={styles.chatPage}>
      {/* Chat Header */}
      <header className={styles.chatHeader}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/dashboard')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div className={styles.chatHeaderInfo}>
          <h1 className={styles.chatTitle}>{chatInfo.title}</h1>
          <div className={styles.chatMeta}>
            <span className={`${styles.modeIndicator} ${styles[`mode${chatInfo.mode.charAt(0).toUpperCase() + chatInfo.mode.slice(1)}`]}`}>
              {getModeDisplayName(chatInfo.mode)}
            </span>
            {chatInfo.subject && (
              <>
                <span className={styles.metaSeparator}>•</span>
                <span className={styles.subjectInfo}>
                  {chatInfo.subject.name} ({chatInfo.subject.code})
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.chatActions}>
          <button className={styles.actionButton} title="Opcije chata">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className={styles.messagesContainer}>
        <div className={styles.messagesArea}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`${styles.messageWrapper} ${styles[`message${message.type.charAt(0).toUpperCase() + message.type.slice(1)}`]}`}
            >
              <div className={styles.messageBubble}>
                <div className={styles.messageContent}>
                  {message.content}
                </div>
                <div className={styles.messageTime}>
                  {formatTime(message.createdAt)}
                  {message.isEdited && <span className={styles.editedIndicator}> • uređeno</span>}
                </div>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className={`${styles.messageWrapper} ${styles.messageBot}`}>
              <div className={styles.messageBubble}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className={styles.inputArea}>
        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            className={styles.messageInput}
            placeholder="Napišite poruku..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            rows={1}
          />
          <button 
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9 22,2"/>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
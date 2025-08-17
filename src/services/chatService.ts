import { api } from './index';

export interface ChatMode {
  id: 'explain' | 'solve' | 'summary' | 'tests' | 'learning';
  name: string;
  description: string;
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  faculty: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
}

export interface CreateChatRequest {
  title: string;
  mode: 'explain' | 'solve' | 'summary' | 'tests' | 'learning';
  subject?: Subject;
  lessons?: Lesson[];
  initialMessage?: string;
}

export interface Chat {
  id: string;
  title: string;
  mode: 'explain' | 'solve' | 'summary' | 'tests' | 'learning';
  subject?: Subject;
  lessons?: Lesson[];
  messageCount: number;
  lastMessageAt: string;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  attachments?: Array<{
    type: 'image' | 'document' | 'link';
    url: string;
    name: string;
    size?: number;
  }>;
  metadata?: {
    tokenCount?: number;
    processingTime?: number;
    model?: string;
    temperature?: number;
  };
  isEdited?: boolean;
  editedAt?: string;
  reactionEmoji?: string;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  attachments?: Array<{
    type: 'image' | 'document' | 'link';
    url: string;
    name: string;
    size?: number;
  }>;
}

export interface ChatResponse {
  chat: Chat;
}

export interface ChatsResponse {
  chats: Chat[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalChats: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SendMessageResponse {
  message: string;
  userMessage: Message;
  botMessage: Message;
}

class ChatService {
  // Create a new chat
  async createChat(data: CreateChatRequest): Promise<ChatResponse> {
    return await api.post<ChatResponse>('/chats', data);
  }

  // Get user's chats
  async getUserChats(page = 1, limit = 20, archived = false): Promise<ChatsResponse> {
    return await api.get<ChatsResponse>('/chats', { page, limit, archived });
  }

  // Get a specific chat by ID
  async getChatById(chatId: string): Promise<ChatResponse> {
    return await api.get<ChatResponse>(`/chats/${chatId}`);
  }

  // Get messages for a chat
  async getChatMessages(chatId: string, page = 1, limit = 50): Promise<MessagesResponse> {
    return await api.get<MessagesResponse>(`/chats/${chatId}/messages`, { page, limit });
  }

  // Send a message to a chat
  async sendMessage(chatId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
    return await api.post<SendMessageResponse>(`/chats/${chatId}/messages`, data);
  }

  // Update chat (title, archive status)
  async updateChat(chatId: string, data: { title?: string; isArchived?: boolean }): Promise<ChatResponse> {
    return await api.put<ChatResponse>(`/chats/${chatId}`, data);
  }

  // Delete a chat
  async deleteChat(chatId: string): Promise<{ message: string }> {
    return await api.delete<{ message: string }>(`/chats/${chatId}`);
  }

  // Archive/unarchive a chat
  async archiveChat(chatId: string): Promise<ChatResponse> {
    return this.updateChat(chatId, { isArchived: true });
  }

  async unarchiveChat(chatId: string): Promise<ChatResponse> {
    return this.updateChat(chatId, { isArchived: false });
  }

  // Generate a chat title from the initial message
  generateChatTitle(message: string, mode: string): string {
    const maxLength = 50;
    
    // Clean up the message
    let title = message.trim();
    
    // Remove question marks and exclamation points from the end
    title = title.replace(/[?!]+$/, '');
    
    // Truncate if too long
    if (title.length > maxLength) {
      title = title.substring(0, maxLength).trim();
      // Try to cut at a word boundary
      const lastSpace = title.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.7) {
        title = title.substring(0, lastSpace);
      }
      title += '...';
    }
    
    // If title is empty or too short, use mode-based default
    if (title.length < 10) {
      const modeDefaults = {
        explain: 'Objašnjavanje',
        solve: 'Rešavanje problema',
        summary: 'Sažetak materijala',
        tests: 'Priprema za test',
        learning: 'Učenje'
      };
      title = modeDefaults[mode as keyof typeof modeDefaults] || 'Nova konverzacija';
    }
    
    return title;
  }
}

export const chatService = new ChatService();
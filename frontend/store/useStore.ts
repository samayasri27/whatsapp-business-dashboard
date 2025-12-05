import { create } from 'zustand';
import { Contact, Chat, Campaign, Template } from '@/types';

interface AppState {
  // User
  userId: string | null;
  setUserId: (id: string | null) => void;

  // Contacts
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;

  // Chats
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;

  // Campaigns
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;

  // Templates
  templates: Template[];
  setTemplates: (templates: Template[]) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // User
  userId: null,
  setUserId: (id) => set({ userId: id }),

  // Contacts
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  selectedContact: null,
  setSelectedContact: (contact) => set({ selectedContact: contact }),

  // Chats
  chats: [],
  setChats: (chats) => set({ chats }),
  activeChat: null,
  setActiveChat: (chat) => set({ activeChat: chat }),

  // Campaigns
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),

  // Templates
  templates: [],
  setTemplates: (templates) => set({ templates }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

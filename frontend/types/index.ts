// Type Definitions

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  status: 'Active' | 'Inactive' | 'Blocked';
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sent: boolean;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'video';
}

export interface Chat {
  phoneNumber: string;
  contactName: string;
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Scheduled' | 'Draft';
  description: string;
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  readRate: string;
  deliveryRate: string;
  createdAt: string;
  scheduledAt?: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'utility' | 'marketing' | 'transactional' | 'authentication';
  status: 'approved' | 'pending' | 'rejected';
  language: string;
  content: string;
  parameters: string[];
  usageCount: number;
  createdAt: string;
}

export interface Sheet {
  id: string;
  name: string;
  url: string;
  contactCount: number;
  lastSync?: string;
}

export interface DashboardStats {
  totalContacts: number;
  activeChats: number;
  campaigns: number;
  messagesSent: number;
  contactsChange: string;
  chatsChange: string;
  campaignsChange: string;
  messagesChange: string;
}

export interface CampaignAnalytics {
  totalSent: number;
  delivered: number;
  read: number;
  clicked: number;
}

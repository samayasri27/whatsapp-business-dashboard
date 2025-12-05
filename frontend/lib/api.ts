// API Client for WhatsApp Business Backend
import { auth } from '@clerk/nextjs/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Client
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private async getToken(): Promise<string> {
    // Get JWT token from localStorage (for API communication)
    // This JWT is obtained after Clerk authentication
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('jwt_token');
      if (jwtToken) {
        console.log('✅ Using JWT token for API');
        return jwtToken;
      }
    }
    
    console.warn('⚠️ No JWT token available - user may need to authenticate');
    return '';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    return this.request('/');
  }

  // Contacts
  async getContacts(userId: string) {
    return this.request(`/users?login_user=${userId}`);
  }

  async getTags() {
    return this.request('/tags');
  }

  // Chats
  async getChatHistory(phoneNumber: string) {
    return this.request(`/chats/${phoneNumber}`);
  }

  async sendMessage(data: { phone: string; message: string; template?: any }) {
    return this.request('/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Campaigns
  async getCampaigns() {
    return this.request('/campaigns');
  }

  async getCampaignContacts(campaignName: string) {
    return this.request(`/campaign_contacts?campaign=${campaignName}`);
  }

  async getImportedNumbers(sheetName: string) {
    return this.request(`/imported_numbers?sheet_name=${sheetName}`);
  }

  async getCampaignStatus(campaignName: string) {
    return this.request(`/${campaignName}`);
  }

  // Templates
  async getTemplates() {
    return this.request('/templates');
  }

  // Sheets
  async getSheets() {
    return this.request('/sheets');
  }
}

export const apiClient = new ApiClient();

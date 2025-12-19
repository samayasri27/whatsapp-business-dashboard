
import { create } from 'zustand';
import { Agent, AgentLog } from '@/types/agents';
import { apiClient } from '@/lib/api';

interface AgentState {
    agents: Agent[];
    logs: AgentLog[];
    toggleAgent: (id: string) => Promise<void>;
    updateAgentConfig: (id: string, config: Partial<Agent['config']>) => Promise<void>;
    createAgent: (data: Partial<Agent>) => Promise<void>;
    addLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
    fetchAgents: () => Promise<void>; // Added fetch action

    // Logic
    processMessage: (message: string, contactId: string) => Promise<{ reply?: string; tags?: string[]; sentiment?: string }>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
    agents: [], // Initial state empty, fetched on mount
    logs: [],

    fetchAgents: async () => {
        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/agents`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            if (response.ok) {
                const data = await response.json();
                set({ agents: data });
            }
        } catch (error) {
            console.error("Failed to fetch agents:", error);
        }
    },

    toggleAgent: async (id) => {
        const state = get();
        const agent = state.agents.find(a => a.id === id);
        if (!agent) return;

        // Optimistic update
        const newStatus = agent.status === 'active' ? 'inactive' : 'active';
        const newEnabled = !agent.config.enabled;

        set((state) => ({
            agents: state.agents.map((a) =>
                a.id === id
                    ? { ...a, status: newStatus, config: { ...a.config, enabled: newEnabled } }
                    : a
            ),
        }));

        // API Call
        const token = localStorage.getItem('jwt_token');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/agents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({ status: newStatus, config: { ...agent.config, enabled: newEnabled } }),
            });
        } catch (error) {
            console.error("Failed to toggle agent:", error);
        }
    },

    updateAgentConfig: async (id, newConfig) => {
        const state = get();
        const agent = state.agents.find(a => a.id === id);
        if (!agent) return;

        // Optimistic
        set((state) => ({
            agents: state.agents.map((a) =>
                a.id === id
                    ? { ...a, config: { ...a.config, ...newConfig } }
                    : a
            ),
        }));

        // API Call
        const token = localStorage.getItem('jwt_token');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/agents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({ config: { ...agent.config, ...newConfig } }),
            });
        } catch (error) {
            console.error("Failed to update agent:", error);
        }
    },

    createAgent: async (data) => {
        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/agents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const newAgent = await response.json();
                set((state) => ({ agents: [...state.agents, newAgent] }));
            }
        } catch (error) {
            console.error("Failed to create agent:", error);
        }
    },

    addLog: (log) =>
        set((state) => ({
            logs: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date().toISOString(),
                    ...log,
                },
                ...state.logs,
            ],
        })),

    processMessage: async (message, contactId) => {
        const state = get();
        const token = localStorage.getItem('jwt_token');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/ai/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    message,
                    contactId,
                    activeAgents: state.agents.filter(a => a.status === 'active'),
                }),
            });

            if (!response.ok) {
                throw new Error('AI Backend processing failed');
            }

            const result = await response.json();

            // Update logs from backend results
            if (result.logs && result.logs.length > 0) {
                result.logs.forEach((log: any) => {
                    state.addLog({
                        agentId: log.agentId,
                        action: log.action,
                        details: log.details
                    });
                });
            }

            return result;

        } catch (error) {
            console.error('AI processing error:', error);
            return {};
        }
    },
}));


export type AgentType = 'auto-reply' | 'lead-qual' | 'sentiment';

export interface AgentMetric {
    label: string;
    value: string | number;
    change?: string; // e.g. "+12%"
}

export interface AgentConfig {
    enabled: boolean;
    systemPrompt?: string; // Replaces rules/keywords for LLM
    model?: string;       // e.g. "llama3-70b-8192"
    temperature?: number; // 0.0 to 1.0
}

export interface Agent {
    id: string;
    name: string;
    type: AgentType | 'custom'; // Added custom type
    description: string;
    icon: string;
    status: 'active' | 'inactive';
    metrics: AgentMetric[];
    config: AgentConfig;
    lastActive?: string;
}

export interface AgentLog {
    id: string;
    agentId: string;
    timestamp: string;
    action: string; // e.g. "Replied to +12345", "Tagged +12345 as Lead"
    details: string;
}

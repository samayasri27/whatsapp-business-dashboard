
"use client";

import { useState, useEffect } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import AgentCard from './components/AgentCard';
import AgentSettingsDrawer from './components/AgentSettingsDrawer';
import { Agent } from '@/types/agents';
import { Bot, History, Plus, X } from 'lucide-react';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AIAgentsPage() {
    const { agents, logs, toggleAgent, fetchAgents, createAgent } = useAgentStore();
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState('');
    const [newAgentDesc, setNewAgentDesc] = useState('');
    const [newAgentPrompt, setNewAgentPrompt] = useState('');

    // Fetch agents on mount
    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const handleCreateAgent = async () => {
        if (!newAgentName || !newAgentPrompt) return;

        // Pass systemPrompt at top level for backend convenience, 
        // OR better yet, fix backend to respect structure. 
        // For now, let's cast or pass any to bypass strict Partial<Agent> if needed, 
        // but let's try to match the store type.
        // The store defines createAgent(data: Partial<Agent>).
        // So we should construct a valid partial agent.

        await createAgent({
            name: newAgentName,
            description: newAgentDesc,
            type: 'custom',
            icon: 'Bot',
            config: {
                enabled: false,
                systemPrompt: newAgentPrompt
            }
        });

        setIsCreateModalOpen(false);
        setNewAgentName('');
        setNewAgentDesc('');
        setNewAgentPrompt('');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="AI Agents" subtitle="Manage your automation assistants" />

                <div className="flex-1 overflow-auto p-6 space-y-8">
                    {/* Header Details */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Bot className="w-8 h-8 text-emerald-600" />
                                AI Automation Agents
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Deploy intelligent agents to automate your customer interactions 24/7.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Agent
                        </button>
                    </div>

                    {/* Agents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map((agent) => (
                            <AgentCard
                                key={agent.id}
                                agent={agent}
                                onToggle={toggleAgent}
                                onConfigure={setSelectedAgent}
                            />
                        ))}
                    </div>

                    {/* Recent Activity Log */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                            <History className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Automation Activity</h2>
                        </div>

                        <div className="overflow-x-auto">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No activity yet. Enable an agent and run a test to see logs here.
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Time</th>
                                            <th className="px-6 py-3 font-medium">Agent</th>
                                            <th className="px-6 py-3 font-medium">Action</th>
                                            <th className="px-6 py-3 font-medium">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {logs.slice(0, 10).map((log) => {
                                            const agentName = agents.find(a => a.id === log.agentId)?.name || 'Unknown Agent';
                                            return (
                                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                        {new Date(log.timestamp).toLocaleTimeString()}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                                                        {agentName}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                                        {log.action}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-md truncate">
                                                        {log.details}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Settings Drawer */}
                    <AgentSettingsDrawer
                        agent={selectedAgent}
                        isOpen={!!selectedAgent}
                        onClose={() => setSelectedAgent(null)}
                    />

                    {/* Create Agent Modal */}
                    {isCreateModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Agent</h3>
                                    <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="e.g. Sales Assistant"
                                            value={newAgentName}
                                            onChange={(e) => setNewAgentName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="Short description of purpose"
                                            value={newAgentDesc}
                                            onChange={(e) => setNewAgentDesc(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Instructions</label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            rows={5}
                                            placeholder="You are a helpful assistant..."
                                            value={newAgentPrompt}
                                            onChange={(e) => setNewAgentPrompt(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateAgent}
                                        disabled={!newAgentName || !newAgentPrompt}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create Agent
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

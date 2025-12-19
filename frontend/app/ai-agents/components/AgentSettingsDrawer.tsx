
import { Agent } from '@/types/agents';
import { X, Plus, Trash2, Play, Bot } from 'lucide-react';
import { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';

interface AgentSettingsDrawerProps {
    agent: Agent | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AgentSettingsDrawer({ agent, isOpen, onClose }: AgentSettingsDrawerProps) {
    const { updateAgentConfig, processMessage } = useAgentStore();
    const [testMessage, setTestMessage] = useState('');
    const [testResult, setTestResult] = useState<any>(null);

    if (!isOpen || !agent) return null;



    const handleRunTest = async () => {
        try {
            setTestResult(null); // Clear previous result
            // Force enable temporarily for test if needed, or just run logic
            const result = await processMessage(testMessage, 'TestUser');
            setTestResult(result);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            {agent.name}
                            <span className={`px-3 py-1 text-xs rounded-full ${agent.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-200 text-gray-600'
                                }`}>
                                {agent.status.toUpperCase()}
                            </span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{agent.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Instructions Section (LLM Prompt) */}
                    <section>
                        <h3 className="text-lg font-semibold dark:text-white mb-4">Agent Instructions (System Prompt)</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 mb-2">Define how this agent should behave, what it should look for, and how it should respond.</p>
                            <textarea
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed"
                                value={agent.config.systemPrompt || ''}
                                onChange={(e) => updateAgentConfig(agent.id, { systemPrompt: e.target.value })}
                                rows={10}
                                placeholder="You are a helpful assistant..."
                            />
                        </div>
                    </section>

                    {/* Testing Playground */}
                    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
                        <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                            <Bot className="w-5 h-5 text-emerald-600" />
                            Test Simulator
                        </h3>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Type a user message (e.g. 'Hi' or 'Price?')"
                                className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={testMessage}
                                onChange={(e) => setTestMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRunTest()}
                            />
                            <button
                                onClick={handleRunTest}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Play className="w-4 h-4" /> Run
                            </button>
                        </div>

                        {testResult && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Agent Output</div>

                                {testResult.reply && (
                                    <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="font-bold min-w-[60px]">Reply:</span>
                                        <span className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-200">
                                            {testResult.reply}
                                        </span>
                                    </div>
                                )}

                                {testResult.tags && (
                                    <div className="flex items-start gap-3">
                                        <span className="font-bold min-w-[60px] dark:text-gray-300">Tags:</span>
                                        <div className="flex gap-2">
                                            {testResult.tags.map((tag: string) => (
                                                <span key={tag} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {testResult.sentiment && (
                                    <div className="flex items-start gap-3">
                                        <span className="font-bold min-w-[60px] dark:text-gray-300">Tone:</span>
                                        <span className={`px-2 py-0.5 rounded text-sm font-medium ${testResult.sentiment === 'Negative'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {testResult.sentiment}
                                        </span>
                                    </div>
                                )}

                                {Object.keys(testResult).length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No action triggered. Check keywords or ensure agent logic covers this case.</p>
                                )}
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
}

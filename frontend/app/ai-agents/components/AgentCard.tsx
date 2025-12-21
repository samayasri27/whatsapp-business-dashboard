
import { Agent } from '@/types/agents';
import { MessageSquareQuote, UserCheck, HeartPulse, Settings, Power, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentCardProps {
    agent: Agent;
    onToggle: (id: string) => void;
    onConfigure: (agent: Agent) => void;
}

const iconMap: Record<string, any> = {
    MessageSquareQuote,
    UserCheck,
    HeartPulse,
};

export default function AgentCard({ agent, onToggle, onConfigure }: AgentCardProps) {
    const Icon = iconMap[agent.icon] || Activity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-6 rounded-xl border transition-all duration-300 ${agent.status === 'active'
                    ? 'bg-white dark:bg-gray-800 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-80'
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${agent.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                    }`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onConfigure(agent)}
                        className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onToggle(agent.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${agent.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                    >
                        <Power className="w-4 h-4" />
                        {agent.status === 'active' ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{agent.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 h-10">{agent.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {agent.metrics && Array.isArray(agent.metrics) ? agent.metrics.map((metric, idx) => (
                    <div key={idx}>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{metric.label}</p>
                        <div className="flex items-end gap-2">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                {metric.value}
                            </span>
                            {metric.change && (
                                <span className={`text-xs mb-1 ${metric.change.startsWith('+')
                                        ? 'text-emerald-500'
                                        : 'text-red-500'
                                    }`}>
                                    {metric.change}
                                </span>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No metrics available
                    </div>
                )}
            </div>
        </motion.div>
    );
}

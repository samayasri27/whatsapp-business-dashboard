
import { Rocket, Info } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon?: any;
    color?: string;
}

export default function MetricCard({ label, value, subtext, icon: Icon, color = "emerald" }: MetricCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
            {/* Background Decor */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform`} />

            <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</h3>
                {Icon && <Icon className={`w-5 h-5 text-${color}-500`} />}
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold dark:text-white">{value}</span>
                {subtext && <span className="text-xs text-emerald-500 font-medium">{subtext}</span>}
            </div>

            <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color}-500 rounded-full`}
                    style={{ width: typeof value === 'number' ? `${value}%` : '70%' }}
                />
            </div>
        </div>
    );
}

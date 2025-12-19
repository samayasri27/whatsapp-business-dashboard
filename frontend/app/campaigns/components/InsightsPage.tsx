
"use client";

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { Rocket, Brain, CalendarCheck, Zap, AlertCircle } from 'lucide-react';
import MetricCard from './MetricCard';
import { getCampaignPrediction, getABTestSimulation } from '@/services/mockMLService';

export default function InsightsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [abData, setAbData] = useState<any>(null);

    useEffect(() => {
        async function loadData() {
            const pred = await getCampaignPrediction();
            const ab = await getABTestSimulation();
            setData(pred);
            setAbData(ab);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 animate-pulse">Running AI Prediction Models...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* AI Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="w-8 h-8 text-indigo-100" />
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">AI Powered Analysis</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Campaign Optimizer</h2>
                    <p className="text-indigo-100 max-w-xl">
                        Our ML models analyzed your past 50 campaigns. Here are the data-driven recommendations to maximize your ROI.
                    </p>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Engagement Score"
                    value={data.metrics.engagementScore}
                    icon={Zap}
                    subtext="High Potential"
                    color="amber"
                />
                <MetricCard
                    label="Predicted Deliverability"
                    value={`${data.metrics.predictedDeliverability}%`}
                    icon={Rocket}
                    color="emerald"
                />
                <MetricCard
                    label="Cost Efficiency"
                    value={data.metrics.costEfficiency}
                    icon={CalendarCheck}
                    subtext="Optimal"
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Best Time Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold dark:text-gray-100 mb-6 flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5 text-emerald-500" />
                        Best Time to Send
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.bestTime}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="score"
                                    fill="#10B981"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        🚀 <strong>Tuesday at 10:00 AM</strong> has the highest likelihood of response (95%).
                    </p>
                </div>

                {/* Audience Prediction */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold dark:text-gray-100 mb-6 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-blue-500" />
                        Target Audience Insights
                    </h3>
                    <div className="space-y-4">
                        {data.audience.map((seg: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-32 text-sm font-medium dark:text-gray-300">{seg.segment}</div>
                                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${seg.likelihood}%` }}
                                    />
                                </div>
                                <div className="w-12 text-sm font-bold text-right dark:text-gray-200">{seg.likelihood}%</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 items-start">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Recommendation: Target <strong>Recent Purchasers</strong> for 3x higher conversion rates compared to inactive users.
                        </p>
                    </div>
                </div>

            </div>

            {/* A/B Testing Simulator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold dark:text-gray-100 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        A/B Test Simulation
                    </h3>
                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                        {abData.confidence}% Confidence
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Template A */}
                    <div className={`p-4 rounded-lg border-2 ${abData.winner === 'A' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-700'}`}>
                        <div className="font-bold mb-2">Template A</div>
                        <div className="text-sm text-gray-500 mb-4">Standard Text Only</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-400">Open Rate</div>
                                <div className="text-xl font-bold">{abData.templateA.openRate}%</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400">Reply Rate</div>
                                <div className="text-xl font-bold">{abData.templateA.replyRate}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Template B */}
                    <div className={`p-4 rounded-lg border-2 ${abData.winner === 'B' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-100 dark:border-gray-700'} relative`}>
                        {abData.winner === 'B' && (
                            <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">WINNER</div>
                        )}
                        <div className="font-bold mb-2">Template B</div>
                        <div className="text-sm text-gray-500 mb-4">Rich Media + Emojis</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-400">Open Rate</div>
                                <div className="text-xl font-bold text-emerald-600">{abData.templateB.openRate}%</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400">Reply Rate</div>
                                <div className="text-xl font-bold text-emerald-600">{abData.templateB.replyRate}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

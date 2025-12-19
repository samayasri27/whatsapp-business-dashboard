
"use client";

import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function SchedulingPage() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    // Mock "good" times
    const bestTimes = [
        { day: 1, time: 1 }, // Tue 10:00
        { day: 2, time: 5 }, // Wed 14:00
        { day: 3, time: 2 }, // Thu 11:00
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-emerald-500" />
                        Smart Scheduler
                    </h2>
                    <p className="text-gray-500 text-sm">AI-recommended slots for maximum engagement.</p>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Schedule Campaign
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="p-3 text-xs font-semibold text-gray-400 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">GMT+05:30</div>
                    {days.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-semibold dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-0 bg-gray-50 dark:bg-gray-900/50">
                            {day}
                        </div>
                    ))}
                </div>

                {times.map((time, timeIdx) => (
                    <div key={time} className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="p-3 text-xs text-gray-500 font-medium border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-center">
                            {time}
                        </div>
                        {days.map((_, dayIdx) => {
                            const isBest = bestTimes.some(b => b.day === dayIdx && b.time === timeIdx);
                            return (
                                <div
                                    key={dayIdx}
                                    className={`
                     p-1 h-12 border-r border-gray-100 dark:border-gray-800 last:border-0 relative cursor-pointer transition-colors group
                     ${isBest ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                   `}
                                >
                                    {isBest && (
                                        <div className="w-full h-full rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                                            <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 z-10 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                🔥 Best Engagement (90%+)
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Best</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

        </div>
    );
}

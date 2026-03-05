import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Download, ChevronLeft, Lightbulb, TrendingUp, Table } from 'lucide-react';
import { exportNotebook } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DashboardPage = ({ data, onBack }) => {
    const formatValue = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        return value;
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-2"
                    >
                        <ChevronLeft size={20} />
                        <span>New Analysis</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-600 p-2 rounded-lg">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Analytics Insights</h1>
                            <p className="text-slate-500 text-sm">Detailed insights based on your dataset</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => exportNotebook(data)}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl border border-slate-200 flex items-center gap-2 transition-all shadow-sm"
                >
                    <Download size={20} className="text-brand-600" />
                    Export to Jupyter .ipynb
                </button>
            </div>

            {/* Grid Layout inspired by TaskFlow example */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left Column: Metrics & Summary */}
                <div className="xl:col-span-8 space-y-6">

                    {/* Narrative Summary Card */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-brand-50 p-2 rounded-lg">
                                <Lightbulb className="text-brand-600" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Executive Summary</h2>
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                                {data.narrative_summary}
                            </p>
                        </div>
                    </div>

                    {/* Primary Visualization Card */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Main Trend Analysis</h2>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-brand-600 rounded-full"></div>
                                <span className="text-xs font-medium text-slate-500">Auto-generated Visualization</span>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.structured_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={formatValue} />
                                    <Tooltip
                                        formatter={(val) => [formatValue(val), "Value"]}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Secondary metrics & Stats */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Composition</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.structured_data.slice(0, 5)}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        nameKey="label"
                                    >
                                        {data.structured_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(val) => formatValue(val)} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-600/20 rounded-full blur-3xl -mb-24 -mr-24"></div>
                        <h2 className="text-xl font-bold mb-4 relative z-10">Python Context</h2>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">You can replicate this analysis in any Python environment using the export function.</p>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Table size={16} className="text-brand-400" />
                                <span className="text-xs font-mono text-slate-300">Analysis script generated</span>
                            </div>
                            <div className="text-[10px] font-mono text-brand-300 truncate">
                                {data.python_code.split('\n')[0]}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

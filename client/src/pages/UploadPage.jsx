import React, { useState } from 'react';
import { Upload, FileText, BarChart3, Loader2 } from 'lucide-react';
import { analyzeData } from '../services/api';

export const UploadPage = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !prompt) return;

        setLoading(true);
        try {
            const result = await analyzeData(file, prompt);
            onAnalysisComplete(result);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Analysis failed. Please check your API key and file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-20 px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">AI Data Agent</h1>
                <p className="text-lg text-slate-600">Upload your CSV and get AI-powered insights and charts in seconds.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="space-y-6">
                    {/* File Upload Section */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${file ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label htmlFor="csv-upload" className="cursor-pointer">
                            <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="text-brand-600 w-8 h-8" />
                            </div>
                            <p className="text-lg font-medium text-slate-900">
                                {file ? file.name : "Choose a CSV file or drag it here"}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">Maximum file size: 50MB</p>
                        </label>
                    </div>

                    {/* Prompt Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">What do you want to analyze?</label>
                        <textarea
                            className="w-full rounded-xl border-slate-200 focus:border-brand-500 focus:ring-brand-500 min-h-[120px] p-4 text-slate-600"
                            placeholder="E.g., Compare the top 5 players by performance and show their trend over time..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !file || !prompt}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-6 h-6" />
                                Processing Data...
                            </>
                        ) : (
                            <>
                                <BarChart3 className="w-6 h-6" />
                                Run AI Analysis
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

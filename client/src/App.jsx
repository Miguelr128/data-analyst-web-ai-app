import React, { useState } from 'react';
import { UploadPage } from './pages/UploadPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
    const [view, setView] = useState('upload');
    const [data, setData] = useState(null);

    const handleAnalysisComplete = (result) => {
        setData(result);
        setView('dashboard');
    };

    const handleBackToUpload = () => {
        setView('upload');
        setData(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {view === 'upload' ? (
                <UploadPage onAnalysisComplete={handleAnalysisComplete} />
            ) : (
                <DashboardPage data={data} onBack={handleBackToUpload} />
            )}
        </div>
    );
}

export default App;

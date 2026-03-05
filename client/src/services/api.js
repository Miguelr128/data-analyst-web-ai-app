import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const analyzeData = async (file, prompt) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    const response = await api.post('/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const exportNotebook = async (analysisResult) => {
    const response = await api.post('/export-notebook', analysisResult, {
        responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analysis_report.ipynb');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

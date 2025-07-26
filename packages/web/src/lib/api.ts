import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const urlShortenerApi = {
  shortenUrl: async (url: string, customCode?: string) => {
    const response = await api.post('/tools/url-shortener', { url, customCode });
    return response.data;
  },
};

export const qrCodeApi = {
  generateQRCode: async (text: string) => {
    const response = await api.post('/tools/qr-code', { text });
    return response.data;
  },
};

export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

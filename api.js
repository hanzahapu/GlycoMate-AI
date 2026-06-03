import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendMessage = async (message, history = []) => {
    try {
        const response = await api.post('/chat', { message, history });
        return response.data.response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

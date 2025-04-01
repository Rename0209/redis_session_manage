import express from 'express';
import cors from 'cors';
import { saveSession, getSession } from './src/sessionService.js';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

const app = express();

// Cấu hình CORS
const corsOptions = {
    origin: process.env.CORS_ORIGINS.split(','),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/session', async (req, res) => {
    const { token, timestamp } = req.body;
    if (!token || !timestamp) {
        return res.status(400).json({ error: 'Missing token or timestamp' });
    }

    const { key, session_timestamp } = await saveSession(token, timestamp);
    res.json({ message: 'Session saved', key, timestamp: session_timestamp });
});

app.get('/session/:token/:timestamp', async (req, res) => {
    const { token, timestamp } = req.params;

    const session_timestamp = await getSession(token, timestamp);
    if (!session_timestamp) {
        return res.status(404).json({ error: 'Session not found or expired' });
    }

    res.json(session_timestamp);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

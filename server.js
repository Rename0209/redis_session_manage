import express from 'express';
import cors from 'cors';
import { saveSession, getSession } from './src/sessionService.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/session', async (req, res) => {
    const { psid, timestamp } = req.body;
    if (!psid || !timestamp) {
        return res.status(400).json({ error: 'Missing psid or timestamp' });
    }

    const { key, session_timestamp } = await saveSession(psid, timestamp);
    res.json({ message: 'Session saved', key, timestamp: session_timestamp });
});

app.get('/session/:psid/:timestamp', async (req, res) => {
    const { psid, timestamp } = req.params;

    const session_timestamp = await getSession(psid, timestamp);
    if (!session_timestamp) {
        return res.status(404).json({ error: 'Session not found or expired' });
    }

    res.json(session_timestamp);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

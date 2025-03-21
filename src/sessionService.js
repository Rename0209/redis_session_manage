import client from './redisClient.js';

const SESSION_TTL = 20 * 60; // 20 phút

export const saveSession = async (psid, timestamp) => {
    const key = `${psid}:${timestamp}`;
    const session_timestamp = Math.floor(Date.now() / 1000) + SESSION_TTL;

    // Lưu session với TTL khớp với session_timestamp
    await client.sendCommand(['SET', key, session_timestamp.toString(), 'EXAT', session_timestamp]);

    return { key, session_timestamp };
};

export const getSession = async (psid, timestamp) => {
    const key = `${psid}:${timestamp}`;
    const session_timestamp = await client.get(key);

    if (session_timestamp) {
        // Lấy thời gian hiện tại + 20 phút
        const new_session_timestamp = Math.floor(Date.now() / 1000) + SESSION_TTL;

        // Chuyển đổi thành chuỗi để tránh lỗi "Invalid argument type"
        await client.set(key, new_session_timestamp.toString(), {
            EXAT: new_session_timestamp
        });

        return {
            isExpired: false
        };
    }

    return { isExpired: true };
};
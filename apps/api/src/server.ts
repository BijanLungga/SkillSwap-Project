import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app';
import { webSocketService } from './services/WebSocketService';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Inisialisasi WebSocket Server untuk Fitur Notifikasi Push Real-time
webSocketService.init(server);

server.listen(PORT, () => {
  console.log(`[SkillSwap API] Server berjalan di http://localhost:${PORT}`);
  console.log(`[SkillSwap API] WebSocket endpoint aktif di ws://localhost:${PORT}/ws`);
});

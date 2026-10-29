import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Set<WebSocket>> = new Map();

  public init(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req) => {
      let currentUserId: string | null = null;

      // Check query param e.g. /ws?userId=xyz
      try {
        const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const userId = url.searchParams.get('userId');
        if (userId) {
          currentUserId = userId;
          this.registerClient(userId, ws);
        }
      } catch (err) {
        // Ignored
      }

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === 'IDENTIFY' && data.userId) {
            if (currentUserId && currentUserId !== data.userId) {
              this.unregisterClient(currentUserId, ws);
            }
            currentUserId = data.userId;
            this.registerClient(data.userId, ws);
            ws.send(JSON.stringify({ type: 'CONNECTED', message: 'WebSocket terhubung' }));
          }
        } catch (err) {
          // Ignore invalid messages
        }
      });

      ws.on('close', () => {
        if (currentUserId) {
          this.unregisterClient(currentUserId, ws);
        }
      });

      ws.on('error', () => {
        if (currentUserId) {
          this.unregisterClient(currentUserId, ws);
        }
      });
    });
  }

  public registerClient(userId: string, ws: WebSocket) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)?.add(ws);
  }

  public unregisterClient(userId: string, ws: WebSocket) {
    const userSockets = this.clients.get(userId);
    if (userSockets) {
      userSockets.delete(ws);
      if (userSockets.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  public sendToUser(userId: string, payload: any) {
    const userSockets = this.clients.get(userId);
    if (userSockets) {
      const message = JSON.stringify(payload);
      userSockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  public getConnectedUserCount(): number {
    return this.clients.size;
  }
}

export const webSocketService = new WebSocketService();


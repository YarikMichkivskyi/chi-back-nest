import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    namespace: '/notifications',
    cors: {
        origin: '*',
    },
})
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('NotificationsGateway');
    private clients: Map<string, number> = new Map();

    afterInit(server: Server) {
        this.logger.log('WebSocket initialized');
    }

    handleConnection(client: Socket) {
        const userId = Number(client.handshake.query.userId); // Получаем ID пользователя из query параметров
        if (userId) {
            this.clients.set(client.id, userId);
        }
        this.logger.log(`Client connected: ${client.id} (User ID: ${userId})`);
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    sendNotification(excludeUserId: number) {
        for (const [socketId, userId] of this.clients.entries()) {
            if (userId !== excludeUserId) {
                this.server.to(socketId).emit('newPost');
            }
        }
    }
}
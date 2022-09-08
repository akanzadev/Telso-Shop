import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets/decorators';
import { Socket, Server } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log('message-from-client', payload);

    // ! Emite unicamente al cliente que envio el mensaje
    /* client.emit('message-from-server', {
      fullName: client.id,
      message: payload.message || 'empty message',
    }); */

    // ! Emite a todos los clientes conectado menos al que envio el mensaje
    /* client.broadcast.emit('message-from-server', {
      fullName: client.id,
      message: payload.message || 'empty message',
    }); */

    // ! Emite a todos los clientes conectados
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'empty message',
    });
  }
}

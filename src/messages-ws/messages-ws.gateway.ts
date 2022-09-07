import { WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { OnGatewayConnection } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface.d';
import { OnGatewayDisconnect } from './../../node_modules/@nestjs/websockets/interfaces/hooks/on-gateway-disconnect.interface.d';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    console.log('client connected', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('client disconnected', client);
  }
}

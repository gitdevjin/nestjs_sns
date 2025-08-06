import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat-dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';
import { ChatsMessagesService } from './messages/messages.service';

@WebSocketGateway({
  //ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: ChatsMessagesService
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connect called : ${socket.id}`);
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket
  ) {
    const chat = await this.chatsService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(@MessageBody() data: EnterChatDto, @ConnectedSocket() socket: Socket) {
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.chatIfChatExists(chatId);
      console.log(exists);
      if (!exists) {
        throw new WsException({ code: 100, message: `${chatId} not exists` });
      }
    }
    socket.join(data.chatIds.map((x) => x.toString()));
  }

  // socket.on('message', (cb) = > {console.log(cb)})
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket
  ) {
    const chatExists = await this.chatsService.chatIfChatExists(dto.chatId);
    if (!chatExists) {
      throw new WsException(`${dto.chatId} doesn't exists`);
    }

    const message = await this.messageService.createMessage(dto);
    //broadcast : send message to others in the room except for the person who send the message
    socket.to(message.chat.id.toString()).emit('receive_message', message.message);

    // send the message to all in the room
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', 'hello from server');
  }
}

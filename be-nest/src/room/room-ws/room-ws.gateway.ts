import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, type Socket } from 'socket.io'
import {
  RoomWsCommandPayloadMap,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'

function getRoomId(socket: Socket) {
  const urlString = socket.request.url
  if (!urlString) {
    return null
  }

  const ID_EXTRACT_REGEXP = /\/room-([^/]+)/
  return ID_EXTRACT_REGEXP.exec(urlString)?.[1] ?? null
}

function wrapEmitter(emitter: Pick<Socket, 'emit'>) {
  return <K extends keyof RoomWsEventPayloadMap>(
    event: K,
    payload: RoomWsEventPayloadMap[K],
  ) => {
    emitter.emit(event, payload)
  }
}

@WebSocketGateway(/^room-(.+)/)
export class RoomWsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(private logger: Logger) {}

  private roomMembers: Record<string, Set<string>> = {}
  private getMembers(roomId: string): RoomUser[] {
    return Array.from(this.roomMembers[roomId] ?? []).map((id) => ({
      id,
    }))
  }
  private addMember(roomId: string, socket: Socket) {
    let roomObj = this.roomMembers[roomId]
    if (!roomObj) {
      roomObj = new Set()
      this.roomMembers[roomId] = roomObj
    }

    roomObj.add(socket.id)
  }

  private getRoomBroadcaster(roomId: string) {
    return this.server.of(`/room-${roomId}`)
  }

  handleDisconnect(client: Socket) {
    const roomId = getRoomId(client)

    this.logger.debug('Client has disconnected', [client.id, roomId].join('/'))

    const set = this.roomMembers[roomId]
    set.delete(client.id)

    const emit = wrapEmitter(this.getRoomBroadcaster(roomId))
    emit('user_left', {
      id: client.id,
    })

    this.broadcastUserList(roomId)
  }

  handleConnection(socket: Socket) {
    const roomId = getRoomId(socket)

    this.logger.debug(
      'Client has established connection',
      [socket.id, roomId].join('/'),
    )

    this.addMember(roomId, socket)

    const emit = wrapEmitter(socket.broadcast)
    emit('user_joined', {
      id: socket.id,
    })

    this.broadcastUserList(roomId)
  }

  @WebSocketServer()
  private server: Server

  private broadcastUserList(roomId: string) {
    const users = this.getMembers(roomId)

    const emit = wrapEmitter(this.getRoomBroadcaster(roomId))
    emit('user_list_synced', {
      users,
    })

    this.logger.debug('sync_user_list', roomId)
  }

  @SubscribeMessage('send_description')
  async handleSendDescription(
    @MessageBody()
    payload: RoomWsCommandPayloadMap['send_description'],
    @ConnectedSocket() socket: Socket,
  ) {
    const emit = wrapEmitter(socket.to(payload.toClientId))
    emit('description_sent', {
      fromClientId: socket.id,
      description: payload.description,
    })
  }

  @SubscribeMessage('send_candidate')
  async handleSendCandidate(
    @MessageBody()
    payload: RoomWsCommandPayloadMap['send_candidate'],
    @ConnectedSocket() socket: Socket,
  ) {
    const emit = wrapEmitter(socket.to(payload.toClientId))
    emit('candidate_sent', {
      fromClientId: socket.id,
      candidate: payload.candidate,
    })
  }

  @SubscribeMessage('sync_user_list')
  handleSyncUserList(@ConnectedSocket() socket: Socket) {
    const roomId = getRoomId(socket)
    const users = this.getMembers(roomId)

    const emit = wrapEmitter(socket)
    emit('user_list_synced', {
      users,
    })

    this.logger.debug('sync_user_list - specific', roomId)
  }
}

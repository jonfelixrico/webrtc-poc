import { Injectable } from '@nestjs/common'
import { RoomUser } from '@webrtcpoc/common'
import { nanoid } from 'nanoid'
import { Room } from 'src/room/room.class'

@Injectable()
export class RoomService {
  private _rooms: Map<string, Room> = new Map()

  create(name: string) {
    const id = nanoid()
    const room = new Room(id, name)
    this._rooms.set(id, room)

    return room
  }

  checkIfExists(roomId: string) {
    return this._rooms.has(roomId)
  }

  find(roomId: string) {
    return this._rooms.get(roomId)
  }

  private _getRoom(roomId: string) {
    const room = this._rooms.get(roomId)
    if (!room) {
      throw new Error()
    }

    return room
  }

  setRoomName(roomId: string, name: string) {
    this._getRoom(roomId).name = name
  }

  addUser(roomId: string, user: RoomUser) {
    this._getRoom(roomId).addUser(user)
  }

  removeUser(roomId: string, userId: string) {
    this._getRoom(roomId).removeUser(userId)
  }

  patchUser<K extends keyof Omit<RoomUser, 'id'>>(
    roomId: string,
    userId: string,
    key: K,
    value: RoomUser[K],
  ) {
    this._getRoom(roomId).patchUser(userId, key, value)
  }

  getUsers(roomId: string) {
    return this._getRoom(roomId).users
  }

  getUser(roomId: string, userId: string) {
    return this._getRoom(roomId).userMap[userId] ?? null
  }
}

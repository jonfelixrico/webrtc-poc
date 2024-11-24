import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { IRoomUser, Room } from 'src/room/room.class'

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

  addMember(roomId: string, user: IRoomUser) {
    this._getRoom(roomId).addUser(user)
  }

  removeMember(roomId: string, userId: string) {
    this._getRoom(roomId).removeUser(userId)
  }

  patchMember<K extends keyof Omit<IRoomUser, 'id'>>(
    roomId: string,
    userId: string,
    key: K,
    value: IRoomUser[K],
  ) {
    this._getRoom(roomId).patchUser(userId, key, value)
  }

  getUsers(roomId: string) {
    return this._rooms.get(roomId)?.users
  }
}

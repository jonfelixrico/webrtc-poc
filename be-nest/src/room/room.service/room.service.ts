import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { IRoomUser, Room } from 'src/room/room.class'

@Injectable()
export class RoomService {
  private _rooms: Map<string, Room> = new Map()

  create(name: string) {
    const id = nanoid()
    this._rooms.set(id, new Room(id, name))
  }

  checkIfExists(roomId: string) {
    return this._rooms.has(roomId)
  }

  getUsers(roomId: string) {
    return this._rooms.get(roomId)?.users
  }

  private getRoom(roomId: string) {
    const room = this._rooms.get(roomId)
    if (!room) {
      throw new Error()
    }

    return room
  }

  setRoomName(roomId: string, name: string) {
    this.getRoom(roomId).name = name
  }

  addMember(roomId: string, user: IRoomUser) {
    this.getRoom(roomId).addUser(user)
  }

  removeMember(roomId: string, userId: string) {
    this.getRoom(roomId).removeUser(userId)
  }

  patchMember<K extends keyof Omit<IRoomUser, 'id'>>(
    roomId: string,
    userId: string,
    key: K,
    value: IRoomUser[K],
  ) {
    this.getRoom(roomId).patchUser(userId, key, value)
  }
}

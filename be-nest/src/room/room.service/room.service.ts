import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { Room } from 'src/room/room.class'

@Injectable()
export class RoomService {
  private _rooms: Map<string, Room> = new Map()
  create(name: string) {
    const id = nanoid()
    this._rooms.set(id, new Room(id, name))
  }

  checkIfExists(id: string) {
    return this._rooms.has(id)
  }
}

import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'

@Injectable()
export class RoomService {
  // TODO use a DB instead of having an in-memory storage
  private rooms = new Set<string>()

  create() {
    const id = nanoid()
    this.rooms.add(id)
    return id
  }

  list() {
    return Array.from(this.rooms).sort()
  }

  exists(id: string) {
    return this.rooms.has(id)
  }
}

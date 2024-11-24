import { Room as IRoom, RoomUser } from '@webrtcpoc/common'

export class Room implements IRoom {
  private _users: Map<string, RoomUser> = new Map()

  constructor(
    public readonly id: string,
    public name: string,
  ) {}

  get users(): RoomUser[] {
    return Array.from(this._users)
      .map(([_, user]) => user)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  addUser(user: RoomUser) {
    if (this._users.has(user.id)) {
      throw new Error()
    }

    this._users.set(user.id, user)
  }

  patchUser<K extends keyof RoomUser>(id: string, key: K, value: RoomUser[K]) {
    const user = this._users.get(id)
    if (!user) {
      throw new Error()
    }

    user[key] = value
  }

  removeUser(id: string) {
    this._users.delete(id)
  }
}

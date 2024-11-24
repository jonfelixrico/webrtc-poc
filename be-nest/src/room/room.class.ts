export interface IRoomUser {
  readonly id: string
  name: string
}

export interface IRoom {
  users: IRoomUser[]
  name: string
  id: string
}

export class Room implements IRoom {
  private _users: Map<string, IRoomUser> = new Map()

  constructor(
    public readonly id: string,
    public name: string,
  ) {}

  get users(): IRoomUser[] {
    return Array.from(this._users)
      .map(([_, user]) => user)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  addUser(user: IRoomUser) {
    if (this._users.has(user.id)) {
      throw new Error()
    }

    this._users.set(user.id, user)
  }

  patchUser<K extends keyof IRoomUser>(
    id: string,
    key: K,
    value: IRoomUser[K],
  ) {
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

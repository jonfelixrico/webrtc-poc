export interface IRoomUser {
  readonly id: string
  name: string
}

export class Room {
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

  setUser(user: IRoomUser) {
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

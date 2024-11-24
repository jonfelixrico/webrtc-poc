interface IRoomUser {
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

  patchUser(id: string, values: Partial<Omit<IRoomUser, 'id'>>) {
    const user = this._users.get(id)
    this._users.set(id, {
      ...user,
      ...values,
    })
  }

  removeUser(id: string) {
    this._users.delete(id)
  }
}

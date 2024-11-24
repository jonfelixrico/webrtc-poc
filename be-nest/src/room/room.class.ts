interface IRoomUser {
  readonly id: string
  name: string
}

export class Room {
  private users: Map<string, IRoomUser> = new Map()

  constructor(
    public readonly id: string,
    public name: string,
  ) {}

  get usersArr(): IRoomUser[] {
    return Array.from(this.users)
      .map(([_, user]) => user)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  setUser(user: IRoomUser) {
    this.users.set(user.id, user)
  }

  patchUser(id: string, values: Partial<Omit<IRoomUser, 'id'>>) {
    const user = this.users.get(id)
    this.users.set(id, {
      ...user,
      ...values,
    })
  }

  removeUser(id: string) {
    this.users.delete(id)
  }
}

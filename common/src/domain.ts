export interface RoomUser {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  users: RoomUser[]
}
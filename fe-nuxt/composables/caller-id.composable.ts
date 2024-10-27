import { nanoid } from 'nanoid'

export function useCallerId() {
  if (import.meta.server) {
    return 'caller-id'
  }

  let callerId = sessionStorage.getItem('callerId')
  if (!callerId) {
    callerId = nanoid()
    sessionStorage.setItem('callerId', callerId)
  }

  return callerId
}

import { useQuasar } from 'quasar'

export function useCallerId() {
  const { sessionStorage } = useQuasar()

  /*
   * No need to wrap with any reactivity stuff since this is only
   * set once per tab. No mutations are expected.
   */
  return sessionStorage.getItem('callerId')
}

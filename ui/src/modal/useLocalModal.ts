import { inject, InjectionKey, provide, Ref } from 'vue'

interface InternalProps {
  model: Ref<boolean>
  emitDismissDone: () => void
}

const INTERNAL_PROPS_KEY: InjectionKey<InternalProps> = Symbol(
  'internal local modal props',
)

/**
 * @private
 */
export function useProvideInternalLocalModalProps(props: InternalProps) {
  provide(INTERNAL_PROPS_KEY, props)
}

/**
 * @private
 */
export function useInternalLocalModalProps() {
  return inject(INTERNAL_PROPS_KEY)
}

interface Props {
  close: () => void
}

const PROPS_KEY: InjectionKey<Props> = Symbol('public local modal props')

/**
 * @private
 */
export function useProvideLocalModalProps(props: Props) {
  provide(PROPS_KEY, props)
}

export function useLocalModalActions() {
  const injected = inject(PROPS_KEY)
  if (!injected) {
    throw new Error('local modal props not provided')
  }

  return {
    close,
  }
}

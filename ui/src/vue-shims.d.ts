import { SFComponent } from '@/utils/vue-types'

declare module '*.vue' {
  const component: SFComponent
  export default component
}

import { Component } from 'vue'
import { ComponentEmit, ComponentProps } from 'vue-component-type-helpers'

type PrefixWithOn<T extends string> = `on${Capitalize<T>}`
type EmitToEmitBindNotation<T> = T extends (
  event: infer E,
  ...args: infer A
) => infer R
  ? { [K in E & string as PrefixWithOn<K>]: (...args: A) => R }
  : never

export type BindTypes<T extends Component> = ComponentProps<T> &
  EmitToEmitBindNotation<ComponentEmit<T>>

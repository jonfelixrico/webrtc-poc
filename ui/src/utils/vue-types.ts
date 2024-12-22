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
  /*
   * We can't use ComponentEmit as is because it produces a type of something like
   * (event: 'foo', ...args: any[]): void && (event: 'bar', ...args: any[]): void;
   * which produces { foo: (...args: any[]) => void), bar: (...args: any[]) => void) }.
   *
   * BindTypes are intended to be v-binded into a component; emits in v-binds are prefixed with
   * `on*`, e.g. `onFoo`, `onBar`. EmitToEmitBindNotation does this conversion for us.
   */
  EmitToEmitBindNotation<ComponentEmit<T>>

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { DefineComponent, ExtractPropTypes } from 'vue'

export type SFComponent = DefineComponent<{}, {}, any>

type ExtractEmitsValueType = string[] | {}
type ExtractEmitsValue<T extends ExtractEmitsValueType> = T extends string[]
  ? {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      [K in T[number]]: T[number] extends Function
        ? (...args: any[]) => void
        : never
    }
  : T extends {}
  ? {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      [K in keyof T]: T[K] extends Function ? T[K] : never
    }
  : never

type PrefixStringWithOn<T extends string> = `on${Capitalize<T>}`
type PrefixKeysWithOn<T extends {}> = {
  [K in keyof T as PrefixStringWithOn<K extends string ? K : never>]: T[K]
}

export type ExtractEmitTypes<T extends SFComponent> = PrefixKeysWithOn<
  ExtractEmitsValue<Exclude<T['emits'], undefined>>
>

export type ExtractPropAndEmitTypes<T extends SFComponent> =
  ExtractEmitTypes<T> & ExtractPropTypes<T>

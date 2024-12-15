/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { DefineComponent } from 'vue'

export type SFComponent = DefineComponent<{}, {}, any>

type ExtractEmitsValueType = string[] | ThisType<void>
type ExtractEmitsValue<T extends ExtractEmitsValueType> = T extends string[]
  ? {
      [K in T[number]]: (...args: any[]) => void
    }
  : T extends ThisType<void>
  ? {
      [K in keyof T]: T[K]
    }
  : never

type ToOnFormat<T extends string> = `on${Capitalize<T>}`

type PrefixWithOn<T extends {}> = {
  [K in keyof T as ToOnFormat<K extends string ? K : never>]: T[K]
}

type ExtractEmits<T extends SFComponent> = PrefixWithOn<
  ExtractEmitsValue<Exclude<T['emits'], undefined>>
>

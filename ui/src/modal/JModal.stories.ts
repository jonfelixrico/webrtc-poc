import { setup, type ArgTypes, type Meta, type StoryObj } from '@storybook/vue3'
import Component from './JModal.vue'
import Renderer from './JModalAggregator.vue'

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
  decorators: [
    (story) => {
      return {
        components: { story, Renderer },

        template: `
          <Renderer />
          <div class="w-full h-full">
            <div class="grid grid-cols-4 gap-2">
              <div v-for="i in 80" :key="i" class="h-[25dvh] flex flex-row items-center justify-center bg-slate-200">
                {{ i + 1 }}
              </div>
            </div>
            <story />
          </div>
        `,
      }
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof Component>

type ExtendedStory<S extends StoryObj, T> = S &
  Partial<{
    argTypes: Partial<ArgTypes<T>>
    args: Partial<T>
  }>

export const Default: Story = {
  args: {
    default: 'Content',
    modelValue: false,
  },

  render: (args) => ({
    setup() {
      return {
        args,
      }
    },

    components: {
      Component,
    },

    template: `
      <Component @hide="args.hide" :modelValue="args.modelValue">
        <div class="w-[20dvw] h-[20dvh] flex flex-row justify-center items-center bg-white">
          {{ args.default }}
        </div>
      </Component>
    `,
  }),
}

export const Multi: ExtendedStory<
  Story,
  { modalA: boolean; modalB: boolean; modalC: boolean }
> = {
  argTypes: {
    default: {
      table: { disable: true },
    },

    modelValue: {
      table: { disable: true },
    },

    modalA: {
      type: 'boolean',
    },

    modalB: {
      type: 'boolean',
    },

    modalC: {
      type: 'boolean',
    },
  },

  args: {
    modalA: false,
    modalB: false,
    modalC: false,
  },

  render: (args) => ({
    setup() {
      return {
        args,
      }
    },

    components: {
      Component,
    },

    template: `
      <Component @hide="args.hide" :modelValue="args.modalA">
        <div class="w-[20dvw] h-[20dvh] flex flex-row justify-center items-center bg-white">
          A
        </div>
      </Component>

      <Component @hide="args.hide" :modelValue="args.modalB">
        <div class="w-[20dvw] h-[20dvh] flex flex-row justify-center items-center bg-white">
          B
        </div>
      </Component>

      <Component @hide="args.hide" :modelValue="args.modalC">
        <div class="w-[20dvw] h-[20dvh] flex flex-row justify-center items-center bg-white">
          C
        </div>
      </Component>
    `,
  }),
}

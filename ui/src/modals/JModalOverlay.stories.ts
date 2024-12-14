import type { Meta, StoryObj } from '@storybook/vue3'
import Component from './JModalOverlay.vue'
import Target from './JModalTarget.vue'

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
  decorators: [
    (story) => {
      return {
        components: { story, Target },
        template: `
          <Target />
          <div class="w-full h-full">
            Outer content
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

export const Defualt: Story = {
  args: {
    default: 'Content',
    onHide: () => console.debug('Hide trggered'),
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
      <Component @hide="args.hide">
        <div class="w-[20dvw] h-[20dvh] flex flex-row justify-center items-center bg-white">
          {{ args.default }}
        </div>
      </Component>
    `,
  }),
}

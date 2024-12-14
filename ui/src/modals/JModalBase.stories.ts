import type { Meta, StoryObj } from '@storybook/vue3'
import Component from './JModalBase.vue'

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    onHide: {
      type: 'function',
      description:
        'Emitted if the backdrop was clicked or if the content called the injected hide method',
    },

    default: {
      type: 'string',
      description: 'Default slot',
    },
  },
}
export default meta

type Story = StoryObj<typeof Component>

export const Defualt: Story = {
  args: {
    default: 'Content',
  },
}

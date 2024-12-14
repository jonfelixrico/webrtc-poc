import type { Meta, StoryObj } from '@storybook/vue3'
import Component from './JModal.vue'

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Component>

export const Defualt: Story = {
  args: {},
}

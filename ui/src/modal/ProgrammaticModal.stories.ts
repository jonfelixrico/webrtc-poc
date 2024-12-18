import { type Meta, type StoryObj } from '@storybook/vue3'
import Renderer from './JModalAggregator.vue'
import { useModalActions } from './useModal'
import DemoModal from './DemoModal.storybook.vue'

const meta: Meta = {
  decorators: [
    (story) => {
      return {
        components: { story, Renderer },

        template: `
          <story />  
          <Renderer />
        `,
      }
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  args: {
    default: 'Content',
    modelValue: false,
  },

  render: () => ({
    setup() {
      const { open } = useModalActions()
      function openModal() {
        open(DemoModal)
      }

      return {
        openModal,
      }
    },

    template: `
      <button @click="openModal">Open a modal</button>
    `,
  }),
}

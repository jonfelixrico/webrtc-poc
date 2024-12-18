import type { Meta, StoryObj } from '@storybook/vue3'
import Target from './JModalTarget.vue'
import { useBodyScrollManager } from '@/utils/useBodyScroll'
import {
  useProgrammaticModalOpen,
  useProvideProgrammaticModalManager,
} from './useProgrammaticModal'
import Renderer from './JProgrammaticModalsRenderer.vue'
import DemoModal from './DemoModal.storybook.vue'

const meta: Meta = {
  decorators: [
    (story) => {
      return {
        components: { story, Target, Renderer },

        setup() {
          useBodyScrollManager()
          useProvideProgrammaticModalManager()
        },

        template: `
          <Target>
            <story />  
            <Renderer />
          </Target>
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

export const Defualt: Story = {
  args: {
    default: 'Content',
    modelValue: false,
  },

  render: () => ({
    setup() {
      const open = useProgrammaticModalOpen()
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

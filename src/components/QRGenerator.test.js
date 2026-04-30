import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRGenerator from './QRGenerator.vue'
import QRCode from 'qrcode'

// Mock QRCode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,mock-qr-code')),
  },
}))

describe('QRGenerator', () => {
  let wrapper

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mountComponent = () => {
    return mount(QRGenerator, {
      global: {
        stubs: {
          'img': true,
        },
      },
    })
  }

  describe('Rendering', () => {
    it('renders the generator container', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.generator').exists()).toBe(true)
    })

    it('renders the header with title', () => {
      wrapper = mountComponent()
      expect(wrapper.find('h1').text()).toBe('QR Generator')
    })

    it('renders the tagline', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.tagline').text()).toBe('Transform text into scannable codes')
    })

    it('renders the text input field', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.text-input').exists()).toBe(true)
    })

    it('renders the generate button', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.generate-btn').exists()).toBe(true)
    })

    it('renders placeholder when no QR code generated', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.qr-placeholder').exists()).toBe(true)
    })

    it('does not render download button initially', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.download-btn').exists()).toBe(false)
    })
  })

  describe('User Input', () => {
    it('updates inputText when typing', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Hello World')
      expect(input.element.value).toBe('Hello World')
    })

    it('displays character count', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Test')
      await flushPromises()
      expect(wrapper.find('.char-count').text()).toBe('4 characters')
    })

    it('enables copy button when text is entered', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Test')
      expect(wrapper.find('.copy-btn').attributes('disabled')).toBeUndefined()
    })

    it('disables copy button when no text', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.copy-btn').attributes('disabled')).toBe('')
    })
  })

  describe('QR Code Generation', () => {
    it('generates QR code on button click', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Hello World')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(vi.mocked(QRCode).toDataURL).toHaveBeenCalledWith('Hello World', expect.any(Object))
    })

    it('generates QR code with correct options', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Test URL')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(vi.mocked(QRCode).toDataURL).toHaveBeenCalledWith('Test URL', {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
    })

    it('displays QR code image after generation', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Hello World')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(wrapper.find('.qr-container').exists()).toBe(true)
      expect(wrapper.find('.qr-image').exists()).toBe(true)
    })

    it('hides placeholder after QR code generated', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Hello World')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(wrapper.find('.qr-placeholder').exists()).toBe(false)
    })

    it('clears QR code when input is empty', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(wrapper.find('.qr-placeholder').exists()).toBe(true)
      expect(wrapper.find('.qr-container').exists()).toBe(false)
    })

    it('handles QR generation error gracefully', async () => {
      vi.mocked(QRCode).toDataURL.mockRejectedValueOnce(new Error('Generation failed'))
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Error Test')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(wrapper.find('.qr-placeholder').exists()).toBe(true)
    })
  })

  describe('Copy to Clipboard', () => {
    it('copies text to clipboard on button click', async () => {
      const writeTextMock = vi.fn()
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })
      writeTextMock.mockResolvedValue(undefined)

      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Copy me')

      const copyBtn = wrapper.find('.copy-btn')
      await copyBtn.trigger('click')

      await flushPromises()
      expect(writeTextMock).toHaveBeenCalledWith('Copy me')
    })

    it('shows feedback after copying', async () => {
      const writeTextMock = vi.fn()
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })
      writeTextMock.mockResolvedValue(undefined)

      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Copy me')

      const copyBtn = wrapper.find('.copy-btn')
      await copyBtn.trigger('click')

      await flushPromises()
      expect(wrapper.find('.copy-btn').classes()).toContain('active')
    })

    it('does not copy when input is empty', async () => {
      const writeTextMock = vi.fn()
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })

      wrapper = mountComponent()
      const copyBtn = wrapper.find('.copy-btn')
      await copyBtn.trigger('click')

      await flushPromises()
      expect(writeTextMock).not.toHaveBeenCalled()
    })

    it('handles clipboard error gracefully', async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard access denied'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })

      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Copy me')

      const copyBtn = wrapper.find('.copy-btn')
      await copyBtn.trigger('click')

      await flushPromises()
      // Should not throw, error is caught and logged
      expect(writeTextMock).toHaveBeenCalledWith('Copy me')
    })

    it('logs error when clipboard copy fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard access denied'))
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })

      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Copy me')

      const copyBtn = wrapper.find('.copy-btn')
      await copyBtn.trigger('click')

      await flushPromises()
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Download', () => {
    it('shows download button when QR code exists', async () => {
      wrapper = mountComponent()
      const input = wrapper.find('.text-input')
      await input.setValue('Download Test')

      const btn = wrapper.find('.generate-btn')
      await btn.trigger('click')

      await flushPromises()
      expect(wrapper.find('.download-btn').exists()).toBe(true)
    })

    it('does not show download button when no QR code', () => {
      wrapper = mountComponent()
      expect(wrapper.find('.download-btn').exists()).toBe(false)
    })
  })

})
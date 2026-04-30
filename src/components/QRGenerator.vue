<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const inputText = ref('')
const qrDataUrl = ref('')
const copyFeedback = ref(false)
const downloadRef = ref(null)


const generateQR = async () => {
  if (!inputText.value.trim()) {
    qrDataUrl.value = ''
    return
  }

  try {
    const url = await QRCode.toDataURL(inputText.value, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    qrDataUrl.value = url
  } catch (err) {
    console.error('QR generation failed:', err)
    qrDataUrl.value = ''
  }
}

const copyToClipboard = async () => {
  if (!inputText.value) return

  try {
    await navigator.clipboard.writeText(inputText.value)
    copyFeedback.value = true
    setTimeout(() => {
      copyFeedback.value = false
    }, 1500)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const downloadQR = () => {
  if (!qrDataUrl.value) return

  const link = document.createElement('a')
  link.download = 'qr-code.png'
  link.href = qrDataUrl.value
  link.click()
  qrDataUrl.value = ''
  inputText.value = ''
}
</script>

<template>
  <div class="generator">
    <header class="header">
      <h1>QR Generator</h1>
      <p class="tagline">Transform text into scannable codes</p>
    </header>

    <div class="input-section">
      <div class="input-wrapper">
        <input
          v-model="inputText"
          type="text"
          class="text-input"
          placeholder="Enter text or URL..."
          autocomplete="off"
        />
        <button
          class="copy-btn"
          :class="{ active: copyFeedback }"
          @click="copyToClipboard"
          :disabled="!inputText"
          title="Copy to clipboard"
        >
          <span v-if="!copyFeedback" class="icon">📋</span>
          <span v-else class="icon">✓</span>
        </button>
      </div>
      <div class="input-meta">
        <span class="char-count">{{ inputText.length }} characters</span>
      </div>
    </div>

    <button class="generate-btn" @click="generateQR" :disabled="!inputText">
      Generate QR Code
    </button>

    <div class="qr-section">
      <div v-if="qrDataUrl" class="qr-container">
        <img :src="qrDataUrl" alt="Generated QR Code" class="qr-image" />
      </div>
      <div v-else class="qr-placeholder">
        <span>Enter text above to generate QR code</span>
      </div>
    </div>

    <button
      v-if="qrDataUrl"
      class="download-btn"
      @click="downloadQR"
    >
      Download PNG
    </button>
  </div>
</template>

<style scoped>
.generator {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0 0 8px 0;
}

.tagline {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

.input-section {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.text-input {
  width: 100%;
  height: 52px;
  padding: 0 48px 0 18px;
  font-size: 16px;
  font-family: 'DM Sans', sans-serif;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.text-input::placeholder {
  color: #9ca3af;
}

.text-input:focus {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.copy-btn {
  position: absolute;
  right: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-btn:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.08);
}

.copy-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.copy-btn.active .icon {
  color: #7c3aed;
}

.icon {
  font-size: 16px;
}

.input-meta {
  margin-top: 8px;
  text-align: right;
}

.char-count {
  font-size: 12px;
  color: #9ca3af;
}

.generate-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.5px;
  color: #ffffff;
  background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
}

.generate-btn:active {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.generate-btn:disabled:hover {
  transform: none;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
}

.qr-section {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.qr-container {
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.qr-image {
  display: block;
  width: 200px;
  height: 200px;
}

@media (max-width: 280px) {
  .qr-image {
    width: 160px;
    height: 160px;
  }
}

.qr-placeholder {
  width: 252px;
  height: 252px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px dashed #d1d5db;
}

.qr-placeholder span {
  font-size: 14px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.5;
}

.download-btn {
  width: 100%;
  height: 48px;
  margin-top: 16px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.5px;
  color: #7c3aed;
  background: transparent;
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s, transform 0.2s;
}

.download-btn:hover {
  background: rgba(124, 58, 237, 0.06);
  border-color: rgba(124, 58, 237, 0.5);
  transform: translateY(-1px);
}
</style>
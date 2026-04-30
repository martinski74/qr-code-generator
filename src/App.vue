<script setup>
import QRGenerator from './components/QRGenerator.vue'
</script>

<template>
  <main class="app">
    <div class="card">
      <QRGenerator />
    </div>
  </main>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  background:
    linear-gradient(135deg, #f8f0ff 0%, #fff5f5 25%, #f0f4ff 50%, #f0fffa 75%, #faf0ff 100%);
}

.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: transparent;
}

.card {
  width: 100%;
  max-width: 480px;
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(139, 92, 246, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.6);
}
</style>
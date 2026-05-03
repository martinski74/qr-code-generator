# QR Code Generator

A lightweight, single-page web app for generating QR codes from any text or URL. Built with Vue 3 and zero backend dependencies.

**[Live Demo](https://qr-code-generator-eye.pages.dev)**

## Features

- Generate QR codes instantly from text or URLs
- Auto-generate as you type (300ms debounce)
- Copy text to clipboard
- Download QR code as PNG
- Dark mode UI with a polished, minimal design

## Tech Stack

- Vue 3 + Composition API
- Vite
- [qrcode](https://www.npmjs.com/package/qrcode)

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/martinski74/qr-code-generator.git
cd qr-code-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Usage

1. Enter any text or URL in the input field
2. The QR code generates automatically as you type
3. Click **Download PNG** to save the QR code
4. Use the clipboard icon to copy your input text

## Project Structure

```
qr-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   └── style.css
└── public/
```





# qr-code-generator

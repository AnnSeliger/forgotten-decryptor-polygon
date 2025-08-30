// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './wagmi.js';
import App from './App.jsx';
import './styles.css';

console.log('main.jsx loaded (локальный запуск)');

const queryClient = new QueryClient();

// Кастомная тема для RainbowKit с явным шрифтом и стилями
const customTheme = darkTheme({
  accentColor: '#ff6fff',
  accentColorForeground: '#fff',
  fontStack: 'custom',
  borderRadius: 'medium',
  overlayBlur: 'small',
  colors: {
    modalBackground: 'rgba(10, 0, 31, 0.7)',
    modalText: '#ffffff',
    modalBorder: '#ff6fff',
    modalShadow: '0 0 15px rgba(255, 111, 255, 0.6)',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <BrowserRouter basename="/forgotten-decryptor-polygon">
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
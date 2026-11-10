import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// Configuração do Vite + Electron.
// - O plugin `electron` compila o processo principal (electron/main.ts) e o preload.
// - O plugin `renderer` permite usar APIs do Node no renderer quando necessário.
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Processo principal (cria a janela, controla o ciclo de vida do app).
        entry: 'electron/main.ts',
      },
      {
        // Preload: ponte segura entre o processo principal e a interface (renderer).
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
});

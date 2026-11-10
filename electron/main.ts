import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

// Processo principal do Electron.
// Responsável por criar a janela da aplicação e gerenciar o ciclo de vida.

// URL do servidor de desenvolvimento do Vite (injetada pelo vite-plugin-electron em dev).
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    title: 'DevSetup AI',
    webPreferences: {
      // preload: ponte segura entre o processo principal e a interface.
      preload: path.join(__dirname, 'preload.js'),
      // Boas práticas de segurança do Electron:
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // Em desenvolvimento: carrega do servidor do Vite (hot reload).
    window.loadURL(VITE_DEV_SERVER_URL);
    window.webContents.openDevTools();
  } else {
    // Em produção: carrega o HTML buildado.
    window.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// Abre o diálogo nativo para o usuário escolher a pasta do projeto Java.
// Retorna o caminho e um indicador de projeto Maven válido (presença de pom.xml).
ipcMain.handle('project:select', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Selecione a pasta do projeto Java',
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const projectPath = result.filePaths[0];
  const hasPom = fs.existsSync(path.join(projectPath, 'pom.xml'));

  return {
    path: projectPath,
    name: path.basename(projectPath),
    isMaven: hasPom,
  };
});

// O app só pode criar janelas após o Electron estar pronto.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // No macOS é comum recriar a janela ao clicar no ícone do dock.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Encerra o app quando todas as janelas forem fechadas (exceto no macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

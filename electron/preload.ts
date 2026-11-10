import { contextBridge, ipcRenderer } from 'electron';

// Preload: executa num contexto isolado, com acesso controlado ao Node/Electron.
// Tudo que a interface (renderer) puder chamar do sistema deve ser exposto aqui,
// de forma explícita, via contextBridge. Isso mantém o renderer seguro.
contextBridge.exposeInMainWorld('devSetup', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // Abre o diálogo nativo para o usuário escolher a pasta do projeto Java.
  // Resolve com { path, name, isMaven } ou null se o usuário cancelar.
  selectProject: () => ipcRenderer.invoke('project:select'),
});

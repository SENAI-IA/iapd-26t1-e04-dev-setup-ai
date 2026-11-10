# Como rodar o DevSetup AI localmente

App desktop em **Electron + React + TypeScript** (bundler: Vite).

## Pré-requisitos

- **Node.js 20+** e **npm 10+**
  ```bash
  node -v   # deve mostrar v20.x ou superior
  npm -v
  ```
  Se não tiver, instale via [nvm](https://github.com/nvm-sh/nvm) ou pelo gerenciador do sistema.
- **Linux com ambiente gráfico** (X11 ou Wayland). O Electron abre uma janela nativa.

## Passo a passo (terminal)

Na raiz do projeto:

```bash
# 1. Instalar dependências (só na primeira vez ou quando o package.json mudar)
npm install

# 2. Rodar em modo desenvolvimento (abre a janela com hot reload)
npm run dev
```

O que acontece ao rodar `npm run dev`:
1. O Vite sobe um servidor em `http://localhost:5173`.
2. O Vite compila o processo principal do Electron (`electron/main.ts`) e o preload.
3. O Electron abre a janela do app carregando do servidor do Vite.
4. Alterações em `src/` recarregam a tela automaticamente (hot reload).

Para fechar: feche a janela do app ou pressione `Ctrl+C` no terminal.

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe o app em modo desenvolvimento (hot reload) |
| `npm run build` | Faz o typecheck (`tsc`) e gera o build de produção em `dist/` e `dist-electron/` |
| `npm run preview` | Pré-visualiza o build de produção pelo Vite (web) |

## Rodando pelo IntelliJ IDEA

> ⚠️ O IntelliJ é voltado para Java. Este projeto é Node/TypeScript, então o fluxo
> mais natural é **VS Code + terminal**. Ainda assim, dá para usar o IntelliJ:

### Opção A — Terminal integrado (mais simples)
1. Abra a pasta do projeto no IntelliJ (`File > Open`).
2. Abra o terminal integrado (`Alt+F12`).
3. Rode `npm install` e depois `npm run dev`.

### Opção B — Run Configuration de npm
1. `Run > Edit Configurations... > + > npm`
   - (requer o plugin **Node.js**, que já vem no IntelliJ Ultimate; no Community
     pode não estar disponível — nesse caso use a Opção A).
2. Em **package.json**, selecione o `package.json` do projeto.
3. Em **Command**, escolha `run`; em **Scripts**, escolha `dev`.
4. Salve e clique em **Run** (▶).

### Observação
O IntelliJ Community Edition tem suporte limitado a JavaScript/Node. Se for a sua
versão, prefira a **Opção A (terminal)** ou use o **VS Code**.

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| Janela não abre, erro de display | Sem ambiente gráfico (ex: SSH puro) | Rodar num ambiente com X11/Wayland |
| `command not found: npm` | Node não instalado | Instalar Node 20+ |
| Erro de versão de pacote | `node_modules` desatualizado | Apagar `node_modules` e rodar `npm install` |
| Porta 5173 ocupada | Outro processo usando a porta | Fechar o outro processo ou o Vite escolhe outra porta automaticamente |

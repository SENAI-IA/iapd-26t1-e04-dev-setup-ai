# DevSetup AI

App desktop com IA que lê um projeto Java e **prepara o ambiente de desenvolvimento
automaticamente**, até a aplicação rodar.

> Projeto do curso **IA para Devs — SENAI** · Turma `26t1-e04`

## O problema

Nos projetos Java do SENAI, cada desenvolvedor repete o mesmo setup manual antes de
escrever a primeira linha de código: ler READMEs desatualizados, descobrir qual JDK /
Maven / WildFly usar, instalar e configurar tudo à mão. É lento, frágil e se repete a
cada novo integrante, troca de projeto, máquina nova ou atualização de versões.

## A solução

Um dev novo abre o DevSetup AI, seleciona o projeto que quer preparar, e o app:

1. Seleciona o projeto
2. Seleciona a IDE (MVP fixo em **IntelliJ IDEA**)
3. Varre a máquina (scripts Python) para ver o que já existe e em quais versões
4. A IA interpreta a varredura + requisitos do projeto e monta um plano
5. Instala/configura o que falta (JDK, Maven, WildFly, PostgreSQL, Docker, ...)
6. Abre a IDE e dá run no projeto para testar se sobe
7. Se não subir, a IA lê o log, corrige e tenta de novo; se faltar credencial, pede ao dev

## Stack

| Item | Tecnologia |
|------|-----------|
| Produto | App desktop |
| Front/runtime | Electron + React + TypeScript (Vite) |
| Automação | Bash + apt + SDKMAN + scripts Python |
| IA | Multi-provedor (Claude / OpenAI) |
| Integração IDE | MCP (abrir IntelliJ e dar run) |

## Escopo do MVP

- Projetos **Java / Maven no Linux** (Jakarta EE, JSF, PrimeFaces, Hibernate, ...)
- Leitura do projeto e requisitos pela IA
- Instalação/configuração de JDK, Maven, WildFly, PostgreSQL e Docker
- Configuração do projeto no **IntelliJ IDEA**
- Build e validação da aplicação, com **1 tentativa de correção automática**

**Fora do MVP:** loop de correção multi-tentativa, outras stacks (Node, Python, Flutter),
outras IDEs (VS Code, Eclipse), Windows/macOS, deploy em produção.

## Como rodar

```bash
npm install   # primeira vez
npm run dev    # abre a janela do app (hot reload)
```

Guia completo (pré-requisitos, IntelliJ, troubleshooting): [`docs/como-rodar.md`](docs/como-rodar.md).

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [`docs/contexto.md`](docs/contexto.md) | Contexto completo do projeto (problema, solução, arquitetura, escopo) |
| [`docs/como-rodar.md`](docs/como-rodar.md) | Guia de execução local |
| [`docs/DevSetup-AI.pdf`](docs/DevSetup-AI.pdf) | Pitch inicial |
| [`fichas/`](fichas/) | Fichas das dinâmicas da aula |

## Estrutura do projeto

```
.
├── electron/          # processo principal do Electron
│   ├── main.ts        # cria a janela e gerencia o ciclo de vida
│   └── preload.ts     # ponte segura entre main e interface (contextBridge)
├── src/               # interface (React + TypeScript)
│   ├── main.tsx
│   ├── App.tsx
│   └── App.css
├── docs/              # documentação
├── fichas/            # fichas das dinâmicas
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

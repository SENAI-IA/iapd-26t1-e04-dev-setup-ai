# Contexto do Projeto — DevSetup AI

> Documento de contexto/norte do projeto. Base: pitch inicial (`docs/DevSetup-AI.pdf`)
> + alinhamentos do grupo. Itens não confirmados estão marcados com `[A VALIDAR]`.

## 1. Curso e turma

- **Curso:** IA para Devs — SENAI
- **Turma:** `26t1-e04`
- **Repositório:** `iapd-26t1-e04-dev-setup-ai`

## 2. O problema

Preparar o ambiente de desenvolvimento ainda é **manual, lento e frágil**.
Nos projetos Java do SENAI, cada desenvolvedor repete o mesmo setup manual antes
de escrever a primeira linha de código:

- Documentação extensa (wikis e READMEs longos, muitas vezes desatualizados)
- Dúvida sobre ferramentas e versões (qual JDK? qual Maven? qual WildFly?)
- Configuração manual de Java, Maven, WildFly, banco e IntelliJ — um a um
- Tempo perdido: erros de configuração travam o início do trabalho

**Impacto:** produtividade perdida no início de cada ciclo, sempre com o mesmo
problema.

### Para quem

- **Mais afetados:** novos desenvolvedores, estagiários e devs recém-chegados ao projeto
- Devs sêniores e tech leads (interrompidos para resolver erros de setup de outros)
- Equipes de projeto (onboarding lento atrasa planejamento e entregas)

### Quando acontece

Toda vez que: novo integrante na equipe, troca de projeto, máquina nova ou
formatada, atualização de versões. A cada ocorrência, o mesmo processo manual se
repete.

## 3. A solução

Um **app desktop com IA** que lê o projeto e prepara o ambiente automaticamente,
até a aplicação rodar.

Cenário-alvo: um dev novo chega na equipe e precisa montar o ambiente local. Em
vez de ler o README de cada projeto e configurar tudo à mão, ele abre o DevSetup
AI, seleciona o projeto, e o software analisa a máquina, instala/configura o que
falta e valida se o projeto sobe.

## 4. Fluxo (como funciona)

| Step | Ação |
|:----:|------|
| 1 | Dev **seleciona o projeto** que quer preparar |
| 2 | Dev **seleciona a IDE** (MVP fixo em IntelliJ IDEA) |
| 3 | **Scripts Python varrem a máquina** (o que já existe e em quais versões) |
| 4 | **IA interpreta** a varredura + lê o README/requisitos do projeto e **delega** o que instalar/configurar |
| 5 | **Instala/configura** o que falta na versão correta (Postgres, Docker, Java, etc.) |
| 6 | **Abre o IntelliJ e dá run** no projeto (via script ou MCP) para testar se sobe |
| 7 | **Se não subir:** a IA lê o log, identifica o erro e corrige; reexecuta. Se faltar credencial, o app pede ao dev |

## 5. Arquitetura (camadas com contrato fixo)

Modelo: **IA = cérebro / scripts = braços**, separados em camadas para que a parte
arriscada (IA) fique isolada e auditável, e os braços sejam testáveis sem IA.

1. **Coletores (Python)** — devolvem fatos estruturados (JSON), ex:
   `{ "java": "17", "maven": null, "docker": "24", "postgres": "14" }`.
   Determinístico, testável, sem IA.
2. **IA (orquestrador)** — recebe fatos + requisitos do projeto e devolve um
   **plano de ações estruturado** (cada step: comando + verificação esperada).
   A IA decide, mas não executa.
3. **Executores (scripts / MCP)** — executam cada ação do plano e reportam o
   resultado. O "run" no IntelliJ é feito via MCP.
4. **Loop de validação** — roda o projeto; se falhar, devolve o log para a IA,
   que ajusta o plano.

### Princípios de confiabilidade

Não se assume acerto de primeira. A varredura é determinística, mas montar o
ambiente correto depende de README desatualizado, versões conflitantes,
dependências de SO, permissões e estado prévio da máquina. Por isso, **falha é
tratada como caminho normal, não exceção**:

- Cada step é **idempotente** e **verificável** (confirma o resultado antes de
  seguir — ex: instalou Java? valida `java -version`).
- Falhou um step → captura erro → IA interpreta → corrige → reexecuta **só aquele
  step**, não o fluxo inteiro.
- **Teto de tentativas** (ex: 3). Estourou → para, mostra ao dev o que tentou, o
  erro e o passo manual sugerido. Degradação graciosa, nunca loop infinito.
- **Transparência:** o dev vê cada ação (antes/depois) em log na tela. Sem
  caixa-preta.

## 6. Credenciais

Quando o setup exigir credenciais (ex: banco), o app **preenche o `.env` / run
config do IntelliJ** (ou o `.env` que for necessário).

**Pontos de atenção de segurança:**
- Credenciais ficam **apenas no arquivo do projeto** (`.env` / run config). O app
  não persiste credenciais fora disso.
- Não commitar `.env` (garantir no `.gitignore`).
- Não logar credenciais na tela de log nem em arquivos de log.

## 7. Escopo

### MVP
- Projetos **Java / Maven no Linux**
- Stack alvo inicial: **Jakarta EE, JSF, PrimeFaces, Hibernate** e similares
- Leitura do projeto e requisitos pela IA
- Varredura da máquina (coletores Python)
- Instalação/configuração de ferramentas necessárias (JDK, Maven, WildFly,
  PostgreSQL, Docker, etc.)
- Configuração do projeto no **IntelliJ IDEA** (IDE fixa no MVP)
- Build e validação da aplicação, com **1 tentativa de correção automática** em
  caso de falha

### Fora do MVP (fase 2 / futuro)
- **Loop de correção multi-tentativa** e correção automática sofisticada
- Outras stacks (Node, Python, Flutter)
- Outras IDEs (VS Code, Eclipse)
- Suporte a Windows e macOS
- Deploy e ambientes de produção

## 8. Stack do produto

| Item | Tecnologia |
|------|-----------|
| Produto | App desktop |
| Front/runtime | **Electron + React + TypeScript** |
| Automação | **Bash + apt + SDKMAN** (+ scripts Python para varredura) |
| IA | Multi-provedor — **Claude** e **OpenAI** |
| Integração IDE | **MCP** (abrir IntelliJ e dar run) |

### Projetos / tecnologias suportados (alvo)
Java, Maven, WildFly, Spring Boot, JSF, PrimeFaces, Hibernate, PostgreSQL,
IntelliJ IDEA.

## 9. Feature-semente (dinâmica da aula)

A feature escolhida para a dinâmica de feature-semente é **a seleção do projeto +
exibição dos steps** do setup. Ficha em `fichas/aula1-feature-semente.md`.

# Feature-Semente — DevSetup AI

**Nome:** Seleção do projeto e exibição dos steps do setup

**Por que é incerta:**
É a porta de entrada do app: o dev escolhe a pasta do projeto e o app mostra a
sequência de steps do setup (selecionar projeto, analisar, verificar máquina,
instalar, configurar, build, pronto). Define o esqueleto do app Electron e a tela
de steps onde todas as features seguintes serão plugadas. Enquanto isso não
existir, nenhuma das próximas etapas tem onde acontecer — por isso destrava as
outras.

**Frase de sucesso:**
O dev abre o app, seleciona a pasta de um projeto e vê na tela o caminho escolhido
e a lista de steps do setup exibida.

**Risco (dinheiro / dados pessoais / auth):** NÃO
Apenas seleciona uma pasta local e exibe steps na tela; sem instalação, pagamento,
dado pessoal ou login.

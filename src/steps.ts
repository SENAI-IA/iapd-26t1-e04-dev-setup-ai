// Fonte única dos passos do fluxo DevSetup AI.
// A ordem aqui define a ordem exibida no wizard da interface.

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const STEPS: Step[] = [
  {
    id: 'projeto',
    title: 'Selecionar projeto',
    description: 'Escolha o projeto Java que deseja preparar.',
    icon: '📁',
  },
  {
    id: 'ide',
    title: 'Selecionar IDE',
    description: 'No MVP, o ambiente é configurado para o IntelliJ IDEA.',
    icon: '🧩',
  },
  {
    id: 'varredura',
    title: 'Varrer máquina',
    description: 'Detecta JDK, Maven, WildFly, PostgreSQL e Docker já instalados.',
    icon: '🔍',
  },
  {
    id: 'plano',
    title: 'Planejar com IA',
    description: 'A IA cruza a varredura com os requisitos do projeto e monta o plano.',
    icon: '🧠',
  },
  {
    id: 'instalacao',
    title: 'Instalar e configurar',
    description: 'Instala e configura o que falta no ambiente de desenvolvimento.',
    icon: '⚙️',
  },
  {
    id: 'execucao',
    title: 'Abrir IDE e rodar',
    description: 'Abre o IntelliJ e tenta subir a aplicação para validar o setup.',
    icon: '🚀',
  },
  {
    id: 'validacao',
    title: 'Validar e corrigir',
    description: 'Se não subir, a IA lê o log, corrige e tenta novamente (1 tentativa no MVP).',
    icon: '✅',
  },
];

import { useState } from 'react';
import { STEPS } from './steps';

// Tipagem do que o preload expõe em window.devSetup.
// Conforme o projeto crescer, esta interface acompanha as pontes adicionadas.
interface SelectedProject {
  path: string;
  name: string;
  isMaven: boolean;
}

declare global {
  interface Window {
    devSetup: {
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
      selectProject: () => Promise<SelectedProject | null>;
    };
  }
}

function App() {
  const versions = window.devSetup?.versions;
  const [current, setCurrent] = useState(0);
  // Índice do passo mais avançado já liberado. Um passo só é acessível se
  // todos os anteriores foram concluídos (via botão "Avançar").
  const [unlocked, setUnlocked] = useState(0);
  // Projeto Java selecionado pelo usuário (via diálogo nativo do Electron).
  const [project, setProject] = useState<SelectedProject | null>(null);
  const [selecting, setSelecting] = useState(false);

  const step = STEPS[current];
  const isFirst = current === 0;
  const isLast = current === STEPS.length - 1;
  const progress = Math.round(((current + 1) / STEPS.length) * 100);

  // Regras para liberar o botão "Avançar" por passo.
  // O passo "projeto" exige um projeto selecionado antes de prosseguir.
  const canAdvance = step.id === 'projeto' ? project !== null : true;

  const selectProject = async () => {
    setSelecting(true);
    try {
      const selected = await window.devSetup?.selectProject();
      if (selected) {
        setProject(selected);
      }
    } finally {
      setSelecting(false);
    }
  };

  const goPrev = () => setCurrent((i) => Math.max(0, i - 1));

  const goNext = () => {
    if (isLast || !canAdvance) {
      return;
    }
    // Conclui o passo atual (libera o próximo) e avança.
    setUnlocked((u) => Math.max(u, current + 1));
    setCurrent((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const goToStep = (index: number) => {
    // Só permite acessar passos já liberados (concluídos ou o atual).
    if (index <= unlocked) {
      setCurrent(index);
    }
  };

  return (
    <div className="app">
      <div className="app__backdrop" aria-hidden="true" />

      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Vapor subindo da xícara (referência ao café do Java) */}
              <path
                d="M20 7c-2 2.2-2 4.3 0 6.5M26 5c-2 2.6-2 5 0 7.6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Corpo da xícara */}
              <path
                d="M11 19h22v9a10 10 0 0 1-10 10h-2a10 10 0 0 1-10-10v-9Z"
                fill="#fff"
              />
              {/* Alça */}
              <path
                d="M33 21h3a5 5 0 0 1 0 10h-3"
                stroke="#fff"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
              {/* Pires */}
              <rect x="9" y="41" width="26" height="2.6" rx="1.3" fill="#fff" />
            </svg>
          </span>
          <div>
            <h1 className="app__title">DevSetup AI</h1>
            <p className="app__subtitle">
              Prepara o ambiente de desenvolvimento de projetos Java automaticamente.
            </p>
          </div>
        </div>
      </header>

      <main className="app__main">
        {/* Stepper */}
        <nav className="stepper" aria-label="Etapas do setup">
          <ol className="stepper__list">
            {STEPS.map((s, index) => {
              const locked = index > unlocked;
              const state =
                index < current ? 'done' : index === current ? 'active' : 'todo';
              return (
                <li
                  key={s.id}
                  className={`stepper__item stepper__item--${state}${
                    locked ? ' stepper__item--locked' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="stepper__dot"
                    onClick={() => goToStep(index)}
                    disabled={locked}
                    aria-current={index === current ? 'step' : undefined}
                    title={locked ? `${s.title} (bloqueado)` : s.title}
                  >
                    {index < current ? '✓' : locked ? '🔒' : index + 1}
                  </button>
                  <span className="stepper__label">{s.title}</span>
                </li>
              );
            })}
          </ol>
          <div className="stepper__progress" role="progressbar" aria-valuenow={progress}>
            <div className="stepper__progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </nav>

        {/* Conteúdo do step atual */}
        <section className="panel" aria-live="polite">
          <div className="panel__icon" aria-hidden="true">
            {step.icon}
          </div>
          <div className="panel__body">
            <span className="panel__eyebrow">
              Etapa {current + 1} de {STEPS.length}
            </span>
            <h2 className="panel__title">{step.title}</h2>
            <p className="panel__description">{step.description}</p>

            {step.id === 'projeto' && (
              <div className="project-picker">
                <button
                  type="button"
                  className="btn btn--ghost project-picker__btn"
                  onClick={selectProject}
                  disabled={selecting}
                >
                  {selecting ? 'Abrindo…' : project ? 'Trocar pasta' : 'Selecionar pasta do projeto'}
                </button>

                {project && (
                  <div className="project-picker__result">
                    <div className="project-picker__name">
                      <span className="project-picker__folder" aria-hidden="true">
                        📁
                      </span>
                      {project.name}
                    </div>
                    <code className="project-picker__path">{project.path}</code>
                    <span
                      className={`project-picker__badge project-picker__badge--${
                        project.isMaven ? 'ok' : 'warn'
                      }`}
                    >
                      {project.isMaven
                        ? '✓ Projeto Maven (pom.xml encontrado)'
                        : '⚠ pom.xml não encontrado nesta pasta'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="panel__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={goPrev}
              disabled={isFirst}
            >
              Voltar
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={goNext}
              disabled={isLast || !canAdvance}
            >
              {isLast ? 'Concluído' : 'Avançar'}
            </button>
          </div>
        </section>
      </main>

      {versions && (
        <footer className="app__footer">
          <ul className="app__versions">
            <li>Electron {versions.electron}</li>
            <li>Chromium {versions.chrome}</li>
            <li>Node {versions.node}</li>
          </ul>
        </footer>
      )}
    </div>
  );
}

export default App;

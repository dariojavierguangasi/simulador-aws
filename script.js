/**
 * Simulador AWS Cloud Practitioner
 * Lógica del quiz interactivo — JavaScript Vanilla
 */

// Mapeo de archivo JSON por categoría
const CATEGORY_FILES = {
  'computo':                'questions/computo.json',
  'almacenamiento':         'questions/almacenamiento.json',
  'base-datos':             'questions/base-datos.json',
  'redes':                  'questions/redes.json',
  'seguridad':              'questions/seguridad.json',
  'administracion':         'questions/administracion.json',
  'financiera':             'questions/financiera.json',
  'integracion':            'questions/integracion.json',
  'conceptos-fundamentales':'questions/conceptos-fundamentales.json',
  'casos-practicos':        'questions/casos-practicos.json'
};

const LETTERS = ['A', 'B', 'C', 'D'];

// Estado global del quiz
let state = {
  questions: [],       // preguntas del turno actual (mezcladas si aplica)
  currentIndex: 0,     // índice de la pregunta en curso
  answered: 0,         // total respondidas
  correct: 0,          // respuestas correctas
  selectedOption: null, // índice de opción seleccionada (-1 = ninguna)
  mode: 'category',    // 'category' | 'practical' | 'exam'
  category: 'computo'  // categoría seleccionada (solo para modo category)
};

// ─── Referencias al DOM ──────────────────────────────────────────────────────

const startScreen     = document.getElementById('start-screen');
const quizScreen      = document.getElementById('quiz-screen');
const resultsScreen   = document.getElementById('results-screen');
const statsPanel      = document.getElementById('stats-panel');

const startBtn        = document.getElementById('start-btn');
const verifyBtn       = document.getElementById('verify-btn');
const nextBtn         = document.getElementById('next-btn');
const restartBtn      = document.getElementById('restart-btn');
const playAgainBtn    = document.getElementById('play-again-btn');

const modeRadios      = document.querySelectorAll('input[name="mode"]');
const categorySelector= document.getElementById('category-selector');
const categorySelect  = document.getElementById('category-select');

const loadingEl       = document.getElementById('loading');
const loadErrorEl     = document.getElementById('load-error');

const questionCounter = document.getElementById('question-counter');
const categoryBadge   = document.getElementById('category-badge');
const progressFill    = document.getElementById('progress-fill');
const questionText    = document.getElementById('question-text');
const optionsContainer= document.getElementById('options-container');
const feedbackEl      = document.getElementById('feedback');
const feedbackIcon    = document.getElementById('feedback-icon');
const feedbackTitle   = document.getElementById('feedback-title');
const feedbackExpl    = document.getElementById('feedback-explanation');

const statTotal       = document.getElementById('stat-total');
const statCorrect     = document.getElementById('stat-correct');
const statPercent     = document.getElementById('stat-percent');

const resultsEmoji    = document.getElementById('results-emoji');
const resultsTitle    = document.getElementById('results-title');
const resultsSubtitle = document.getElementById('results-subtitle');
const finalCorrect    = document.getElementById('final-correct');
const finalIncorrect  = document.getElementById('final-incorrect');
const finalPercent    = document.getElementById('final-percent');

// ─── Utilidades ──────────────────────────────────────────────────────────────

/**
 * Mezcla un array en orden aleatorio (Fisher-Yates).
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Carga un archivo JSON y devuelve las preguntas.
 * @param {string} file - Ruta relativa al archivo JSON
 * @returns {Promise<Array>}
 */
async function fetchQuestions(file) {
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${file} (HTTP ${response.status})`);
  }
  const data = await response.json();
  return data.preguntas || [];
}

// ─── Carga de preguntas según modo ───────────────────────────────────────────

async function loadQuestions() {
  loadingEl.classList.remove('hidden');
  loadErrorEl.classList.add('hidden');
  startBtn.disabled = true;

  try {
    let questions = [];

    if (state.mode === 'category') {
      questions = await fetchQuestions(CATEGORY_FILES[state.category]);
    } else if (state.mode === 'practical') {
      questions = await fetchQuestions(CATEGORY_FILES['casos-practicos']);
    } else if (state.mode === 'exam') {
      // Cargar todas las categorías en paralelo
      const promises = Object.values(CATEGORY_FILES).map(f => fetchQuestions(f));
      const results = await Promise.all(promises);
      questions = results.flat();
      questions = shuffle(questions);
    }

    if (questions.length === 0) {
      throw new Error('No se encontraron preguntas para esta selección.');
    }

    state.questions = questions;
  } catch (err) {
    loadErrorEl.textContent = '⚠️ ' + err.message;
    loadErrorEl.classList.remove('hidden');
    return false;
  } finally {
    loadingEl.classList.add('hidden');
    startBtn.disabled = false;
  }
  return true;
}

// ─── Inicio del quiz ─────────────────────────────────────────────────────────

async function startQuiz() {
  const ok = await loadQuestions();
  if (!ok) return;

  // Reiniciar estado
  state.currentIndex = 0;
  state.answered = 0;
  state.correct = 0;
  state.selectedOption = null;

  // Mostrar estadísticas y pantalla de preguntas
  startScreen.classList.add('hidden');
  statsPanel.classList.remove('hidden');
  quizScreen.classList.remove('hidden');
  resultsScreen.classList.add('hidden');

  updateStats();
  showQuestion();
}

// ─── Renderizado de pregunta ──────────────────────────────────────────────────

function showQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;
  const idx = state.currentIndex;

  // Contador y barra de progreso
  questionCounter.textContent = `Pregunta ${idx + 1} / ${total}`;
  progressFill.style.width = `${((idx) / total) * 100}%`;

  // Badge de categoría (si el objeto tiene propiedad categoria)
  categoryBadge.textContent = getCategoryLabel(state.mode, state.category);

  // Texto de la pregunta
  questionText.textContent = q.pregunta;

  // Limpiar opciones previas
  optionsContainer.innerHTML = '';
  state.selectedOption = null;

  // Renderizar opciones
  q.opciones.forEach((opcion, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.setAttribute('data-index', i);
    btn.innerHTML = `<span class="option-letter">${LETTERS[i]}</span><span>${opcion}</span>`;
    btn.addEventListener('click', () => selectOption(i));
    optionsContainer.appendChild(btn);
  });

  // Ocultar feedback y botón siguiente
  feedbackEl.classList.add('hidden');
  feedbackEl.className = 'feedback hidden';
  nextBtn.classList.add('hidden');
  verifyBtn.classList.remove('hidden');
  verifyBtn.disabled = true;
}

function getCategoryLabel(mode, category) {
  if (mode === 'exam') return '🎯 Examen';
  if (mode === 'practical') return '🛠️ Casos Prácticos';
  const labels = {
    'computo':                '💻 Cómputo',
    'almacenamiento':         '🗄️ Almacenamiento',
    'base-datos':             '🛢️ Base de Datos',
    'redes':                  '🌐 Redes',
    'seguridad':              '🔒 Seguridad',
    'administracion':         '⚙️ Administración',
    'financiera':             '💰 Financiera',
    'integracion':            '🔗 Integración',
    'conceptos-fundamentales':'📖 Conceptos',
    'casos-practicos':        '🛠️ Casos Prácticos'
  };
  return labels[category] || category;
}

// ─── Selección de opción ──────────────────────────────────────────────────────

function selectOption(index) {
  // No permitir cambio si ya se verificó
  if (!verifyBtn.classList.contains('hidden') && !verifyBtn.disabled) {
    // Quitar selección previa
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    state.selectedOption = index;
    document.querySelector(`.option-btn[data-index="${index}"]`).classList.add('selected');
    verifyBtn.disabled = false;
  }
}

// ─── Verificación de respuesta ────────────────────────────────────────────────

function verifyAnswer() {
  const q = state.questions[state.currentIndex];
  const correct = q.respuestaCorrecta;
  const selected = state.selectedOption;

  state.answered++;
  const isCorrect = selected === correct;
  if (isCorrect) state.correct++;

  // Deshabilitar opciones
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) {
      btn.classList.add('correct');
      btn.classList.remove('selected');
    } else if (i === selected && !isCorrect) {
      btn.classList.add('incorrect');
      btn.classList.remove('selected');
    }
  });

  // Mostrar feedback
  feedbackEl.classList.remove('hidden');
  if (isCorrect) {
    feedbackEl.className = 'feedback correct-feedback';
    feedbackIcon.textContent = '✅';
    feedbackTitle.textContent = '¡Correcto!';
  } else {
    feedbackEl.className = 'feedback incorrect-feedback';
    feedbackIcon.textContent = '❌';
    feedbackTitle.textContent = `Incorrecto — La respuesta correcta es: ${LETTERS[correct]}`;
  }
  feedbackExpl.textContent = q.explicacion;

  // Botones
  verifyBtn.classList.add('hidden');

  const isLast = state.currentIndex === state.questions.length - 1;
  if (isLast) {
    nextBtn.textContent = 'Ver Resultados 🏆';
  } else {
    nextBtn.textContent = 'Siguiente Pregunta →';
  }
  nextBtn.classList.remove('hidden');

  updateStats();
  saveProgress();
}

// ─── Estadísticas ─────────────────────────────────────────────────────────────

function updateStats() {
  statTotal.textContent = state.answered;
  statCorrect.textContent = state.correct;
  const pct = state.answered > 0
    ? Math.round((state.correct / state.answered) * 100)
    : 0;
  statPercent.textContent = `${pct}%`;
}

// ─── Siguiente pregunta ───────────────────────────────────────────────────────

function nextQuestion() {
  const isLast = state.currentIndex === state.questions.length - 1;
  if (isLast) {
    showResults();
  } else {
    state.currentIndex++;
    showQuestion();
    // Actualizar barra de progreso
    progressFill.style.width = `${(state.currentIndex / state.questions.length) * 100}%`;
  }
}

// ─── Resultados finales ───────────────────────────────────────────────────────

function showResults() {
  quizScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');

  const total = state.questions.length;
  const pct = Math.round((state.correct / total) * 100);

  finalCorrect.textContent = state.correct;
  finalIncorrect.textContent = total - state.correct;
  finalPercent.textContent = `${pct}%`;

  if (pct >= 80) {
    resultsEmoji.textContent = '🏆';
    resultsTitle.textContent = '¡Excelente resultado!';
    resultsSubtitle.textContent = `Obtuviste ${pct}% — ¡Estás listo para el examen!`;
  } else if (pct >= 60) {
    resultsEmoji.textContent = '📚';
    resultsTitle.textContent = '¡Buen intento!';
    resultsSubtitle.textContent = `Obtuviste ${pct}% — Sigue practicando para mejorar.`;
  } else {
    resultsEmoji.textContent = '💪';
    resultsTitle.textContent = 'Sigue estudiando';
    resultsSubtitle.textContent = `Obtuviste ${pct}% — No te rindas, ¡la práctica hace al maestro!`;
  }

  clearProgress();
}

// ─── Reinicio ─────────────────────────────────────────────────────────────────

function restartQuiz() {
  quizScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');
  statsPanel.classList.add('hidden');
  startScreen.classList.remove('hidden');
  clearProgress();
}

// ─── Persistencia con localStorage ───────────────────────────────────────────

function saveProgress() {
  try {
    const data = {
      mode: state.mode,
      category: state.category,
      currentIndex: state.currentIndex,
      answered: state.answered,
      correct: state.correct,
      questionIds: state.questions.map(q => q.id)
    };
    localStorage.setItem('aws_quiz_progress', JSON.stringify(data));
  } catch (_) { /* localStorage puede estar desactivado */ }
}

function clearProgress() {
  try {
    localStorage.removeItem('aws_quiz_progress');
  } catch (_) {}
}

// ─── Listeners ────────────────────────────────────────────────────────────────

// Cambio de modo: mostrar/ocultar selector de categoría
modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    state.mode = radio.value;
    categorySelector.classList.toggle('hidden', radio.value !== 'category');
  });
});

// Cambio de categoría
categorySelect.addEventListener('change', () => {
  state.category = categorySelect.value;
});

// Botón inicio
startBtn.addEventListener('click', startQuiz);

// Botón verificar
verifyBtn.addEventListener('click', () => {
  if (state.selectedOption !== null) verifyAnswer();
});

// Botón siguiente
nextBtn.addEventListener('click', nextQuestion);

// Botón reiniciar (en panel de stats)
restartBtn.addEventListener('click', restartQuiz);

// Botón jugar de nuevo (en pantalla de resultados)
playAgainBtn.addEventListener('click', restartQuiz);

// Teclas de acceso rápido: 1-4 para seleccionar opción, Enter para verificar/siguiente
document.addEventListener('keydown', e => {
  if (quizScreen.classList.contains('hidden')) return;

  if (['1','2','3','4'].includes(e.key)) {
    const idx = parseInt(e.key, 10) - 1;
    if (!verifyBtn.classList.contains('hidden') && !verifyBtn.disabled) {
      selectOption(idx);
    }
  }

  if (e.key === 'Enter') {
    if (!verifyBtn.classList.contains('hidden') && !verifyBtn.disabled) {
      verifyAnswer();
    } else if (!nextBtn.classList.contains('hidden')) {
      nextQuestion();
    }
  }
});

// ─── Inicialización ───────────────────────────────────────────────────────────

// Establecer valores iniciales desde el estado
state.mode = 'category';
state.category = categorySelect.value;

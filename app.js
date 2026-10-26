const form = document.querySelector('#routine-form');
const generateButton = document.querySelector('#generate-button');
const buttonLabel = generateButton.querySelector('.button-label');
const resultSection = document.querySelector('#result-section');
const statusMessage = document.querySelector('#status-message');
const resultCard = document.querySelector('#result-card');
const routineOutput = document.querySelector('#routine-output');
const printButton = document.querySelector('#print-button');

function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`.trim();
}

function addCell(row, value, tag = 'td') {
  const cell = document.createElement(tag);
  cell.textContent = value == null ? '—' : String(value);
  row.appendChild(cell);
  return cell;
}

function addRoutineSection(container, title, content) {
  if (!content) return;

  const section = document.createElement('section');
  section.className = 'routine-info';

  const heading = document.createElement('h4');
  heading.textContent = title;

  const paragraph = document.createElement('p');
  paragraph.textContent = content;

  section.append(heading, paragraph);
  container.appendChild(section);
}

function renderRoutine(routine) {
  routineOutput.replaceChildren();

  const title = document.createElement('h2');
  title.className = 'routine-title';
  title.textContent = routine.title || 'Tu rutina FitIA';
  routineOutput.appendChild(title);

  const summary = document.createElement('p');
  summary.className = 'routine-summary';
  summary.textContent = routine.summary || '';
  routineOutput.appendChild(summary);

  const duration = document.createElement('p');
  duration.className = 'routine-duration';
  duration.textContent =
    `Duración aproximada: ${routine.durationMinutes || 'No especificada'} minutos`;
  routineOutput.appendChild(duration);

  // Si no es seguro personalizar la rutina, mostrar la explicación.
  if (!routine.days || routine.days.length === 0) {
    addRoutineSection(
      routineOutput,
      'Recomendación importante',
      'No se generaron ejercicios personalizados porque las limitaciones indicadas pueden requerir orientación profesional.'
    );
  }

  (routine.days || []).forEach((day, index) => {
    const daySection = document.createElement('section');
    daySection.className = 'routine-day';

    const dayTitle = document.createElement('h3');
    dayTitle.textContent = day.day || `Sesión ${index + 1}`;
    daySection.appendChild(dayTitle);

    if (day.focus) {
      const focus = document.createElement('p');
      focus.className = 'routine-focus';
      focus.textContent = day.focus;
      daySection.appendChild(focus);
    }

    addRoutineSection(daySection, 'Calentamiento', day.warmup);

    const exercises = Array.isArray(day.exercises) ? day.exercises : [];

    if (exercises.length > 0) {
      const wrapper = document.createElement('div');
      wrapper.className = 'routine-table-wrapper';

      const table = document.createElement('table');
      table.className = 'routine-table';

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      [
        'Ejercicio',
        'Músculos',
        'Series',
        'Repeticiones o duración',
        'Descanso',
        'Técnica y consejo',
        'Imágenes'
      ].forEach((heading) => addCell(headerRow, heading, 'th'));

      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      exercises.forEach((exercise) => {
        const row = document.createElement('tr');

        addCell(row, exercise.name);
        addCell(row, exercise.muscles);
        addCell(row, exercise.sets);
        addCell(row, exercise.reps);

        addCell(
          row,
          exercise.restSeconds == null
            ? '—'
            : `${exercise.restSeconds} segundos`
        );

        const techniqueCell = document.createElement('td');
        const technique = document.createElement('p');
        technique.textContent = exercise.technique || 'Sin explicación disponible.';
        techniqueCell.appendChild(technique);

        if (exercise.tip) {
          const tip = document.createElement('p');
          tip.className = 'exercise-tip';
          tip.textContent = `Consejo: ${exercise.tip}`;
          techniqueCell.appendChild(tip);
        }

        row.appendChild(techniqueCell);

        const imageCell = document.createElement('td');
        const imageLink = document.createElement('a');

        imageLink.textContent = 'Buscar imágenes';
        imageLink.href =
          'https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=' +
          encodeURIComponent(exercise.name || 'ejercicio físico');

        imageLink.target = '_blank';
        imageLink.rel = 'noopener noreferrer';

        imageCell.appendChild(imageLink);
        row.appendChild(imageCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      wrapper.appendChild(table);
      daySection.appendChild(wrapper);
    } else {
      addRoutineSection(
        daySection,
        'Ejercicios',
        'No hay ejercicios personalizados para esta sesión.'
      );
    }

    addRoutineSection(daySection, 'Vuelta a la calma', day.cooldown);
    routineOutput.appendChild(daySection);
  });

  if (Array.isArray(routine.safety) && routine.safety.length > 0) {
    const safetySection = document.createElement('section');
    safetySection.className = 'routine-info';

    const safetyTitle = document.createElement('h3');
    safetyTitle.textContent = 'Recomendaciones de seguridad';
    safetySection.appendChild(safetyTitle);

    const safetyList = document.createElement('ul');

    routine.safety.forEach((recommendation) => {
      const item = document.createElement('li');
      item.textContent = recommendation;
      safetyList.appendChild(item);
    });

    safetySection.appendChild(safetyList);
    routineOutput.appendChild(safetySection);
  }

  addRoutineSection(routineOutput, 'Nota final', routine.finalNote);
}

function readForm() {
  const data = new FormData(form);
  return {
    goal: String(data.get('goal') || ''),
    place: String(data.get('place') || ''),
    level: String(data.get('level') || ''),
    duration: Number(data.get('duration') || 0),
    equipment: String(data.get('equipment') || ''),
    limitations: String(data.get('limitations') || '').trim()
  };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const payload = readForm();
  if (![20, 45, 60].includes(payload.duration)) {
    showStatus('Elegí una duración válida antes de continuar.', 'error');
    return;
  }
  if (payload.limitations.length > 500) {
    showStatus('El campo de limitaciones no puede superar los 500 caracteres.', 'error');
    return;
  }

  resultSection.hidden = false;
  resultCard.hidden = true;
  showStatus('Estamos preparando una propuesta con Gemini. Esto puede tardar unos segundos…', 'loading');
  generateButton.disabled = true;
  buttonLabel.textContent = 'Generando rutina…';
  generateButton.querySelector('[aria-hidden="true"]').textContent = '…';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('El servidor devolvió una respuesta que no se pudo leer. Revisá el despliegue e intentá nuevamente.');
    }

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo generar la rutina. Intentá nuevamente.');
    }


if (
  !data.routine ||
  typeof data.routine !== 'object' ||
  !Array.isArray(data.routine.days) ||
  typeof data.routine.title !== 'string' ||
  typeof data.routine.summary !== 'string'
) {
  throw new Error('La rutina recibida está incompleta. Probá nuevamente.');
}

renderRoutine(data.routine);

resultCard.hidden = false;

showStatus(
  `Rutina generada correctamente con ${data.model || 'Gemini'}. Revisá la propuesta y adaptala a tu condición individual.`,
  'success'
);
  } catch (error) {
    showStatus(error.message || 'No pudimos conectar con la IA. Verificá tu conexión e intentá nuevamente.', 'error');
  } finally {
    generateButton.disabled = false;
    buttonLabel.textContent = 'Generar otra rutina';
    generateButton.querySelector('[aria-hidden="true"]').textContent = '↗';
  }
});

printButton.addEventListener('click', () => window.print());


const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    const savedTheme = localStorage.getItem('fitia-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;

        const isDark = theme === 'dark';

        themeToggle.innerHTML = isDark
            ? '☀️ <span>Modo claro</span>'
            : '🌙 <span>Modo oscuro</span>';

        themeToggle.setAttribute('aria-label',
            isDark ? 'Activar modo claro' : 'Activar modo oscuro');

        themeToggle.setAttribute('aria-pressed', String(isDark));
    }

    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('fitia-theme', newTheme);
        applyTheme(newTheme);
    });
}

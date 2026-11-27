import { store, debounce } from '@utils/store.js';

export function initNotesPanel(root, onChange) {
  const notes = store.getNotes();
  root.innerHTML = `
    <h2 class="card__title">My Notes</h2>
    <div class="field">
      <label for="task-title">Task title <span class="hint">(kept for this browser tab only - sessionStorage)</span></label>
      <input id="task-title" type="text" autocomplete="off" />
    </div>
    <div class="field">
      <label for="notes-text">Study notes <span class="hint">(saved on this device - localStorage)</span></label>
      <textarea id="notes-text" rows="6" aria-describedby="notes-status"></textarea>
    </div>
    <div class="notes__foot">
      <p id="notes-status" class="muted" role="status" aria-live="polite"></p>
      <button type="button" id="notes-clear" class="btn btn--ghost">Clear notes</button>
    </div>`;

  const $title = root.querySelector('#task-title');
  const $text = root.querySelector('#notes-text');
  const $status = root.querySelector('#notes-status');

  const stamp = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const status = (savedAt) => {
    $status.textContent = savedAt ? `Saved at ${stamp(savedAt)} - ${$text.value.length} characters` : 'Nothing saved yet';
  };

  $title.value = store.getTaskTitle();
  $text.value = notes.text;
  status(notes.savedAt);

  $title.addEventListener('input', () => { store.setTaskTitle($title.value); onChange?.(); });
  const save = debounce(() => {                     // autosave 400ms after typing stops
    store.setNotes($text.value);
    status(Date.now());
    onChange?.();
  });
  $text.addEventListener('input', () => { $status.textContent = 'Saving...'; save(); });

  root.querySelector('#notes-clear').addEventListener('click', () => {
    $text.value = ''; store.setNotes(''); $status.textContent = 'Notes cleared'; onChange?.(); $text.focus();
  });

  return { reset() { $text.value = ''; $title.value = ''; status(null); } };
}

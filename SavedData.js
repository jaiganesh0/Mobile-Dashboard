// Overview card that shows what is currently persisted.
export const SavedData = () => `
  <section class="card" aria-labelledby="saved-title">
    <h2 id="saved-title" class="card__title">Saved Data</h2>
    <dl class="info">
      <div><dt>Bookmarks (local)</dt><dd id="sd-bm">0</dd></div>
      <div><dt>Filter (local)</dt><dd id="sd-filter">-</dd></div>
      <div><dt>Notes (local)</dt><dd id="sd-notes">0 chars</dd></div>
      <div><dt>Active tab (session)</dt><dd id="sd-tab">-</dd></div>
    </dl>
    <button type="button" id="reset-all" class="btn btn--ghost reset">Reset saved data</button>
    <p id="reset-status" class="sr-only" role="status" aria-live="polite"></p>
  </section>`;

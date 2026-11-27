import { percent } from '@utils/format.js';
import { store } from '@utils/store.js';

const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');

export function initCoursesPanel(root, courses, onChange) {
  let filters = store.getFilters();
  let bookmarks = new Set(store.getBookmarks());

  root.innerHTML = `
    <h2 class="card__title">Course Progress</h2>
    <form class="filters" role="search" aria-label="Filter courses" onsubmit="return false">
      <div class="field">
        <label for="f-query">Search courses</label>
        <input id="f-query" type="search" autocomplete="off" placeholder="e.g. Java" />
      </div>
      <div class="field">
        <label for="f-status">Status</label>
        <select id="f-status">
          <option value="all">All</option>
          <option value="progress">In progress (below 70%)</option>
          <option value="almost">Almost done (70% and above)</option>
          <option value="bookmarked">Bookmarked only</option>
        </select>
      </div>
      <div class="field">
        <label for="f-sort">Sort by</label>
        <select id="f-sort">
          <option value="name">Name</option>
          <option value="high">Progress: high to low</option>
          <option value="low">Progress: low to high</option>
        </select>
      </div>
    </form>
    <p id="f-count" class="muted" role="status" aria-live="polite"></p>
    <ul id="course-list" class="courses" aria-label="Courses"></ul>`;

  const $q = root.querySelector('#f-query');
  const $status = root.querySelector('#f-status');
  const $sort = root.querySelector('#f-sort');
  const $count = root.querySelector('#f-count');
  const $list = root.querySelector('#course-list');

  // restore saved filters into the controls
  $q.value = filters.query; $status.value = filters.status; $sort.value = filters.sort;

  const visible = () => {
    const q = filters.query.trim().toLowerCase();
    let list = courses.filter((c) => c.name.toLowerCase().includes(q));
    const pct = (c) => percent(c.done, c.total);
    if (filters.status === 'progress') list = list.filter((c) => pct(c) < 70);
    if (filters.status === 'almost') list = list.filter((c) => pct(c) >= 70);
    if (filters.status === 'bookmarked') list = list.filter((c) => bookmarks.has(slug(c.name)));
    const sorters = {
      name: (a, b) => a.name.localeCompare(b.name),
      high: (a, b) => pct(b) - pct(a),
      low: (a, b) => pct(a) - pct(b),
    };
    return list.sort(sorters[filters.sort]);
  };

  const render = () => {
    const list = visible();
    $list.innerHTML = list.length
      ? list.map((c) => {
          const id = slug(c.name);
          const p = percent(c.done, c.total);
          const on = bookmarks.has(id);
          return `<li class="course">
            <div class="course__main">
              <div class="course__row"><span id="n-${id}">${c.name}</span><strong>${p}%</strong></div>
              <div class="bar" role="progressbar" aria-labelledby="n-${id}" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div>
            </div>
            <button type="button" class="bookmark" data-id="${id}" aria-pressed="${on}" aria-label="Bookmark ${c.name}">
              <span aria-hidden="true">${on ? '\u2605' : '\u2606'}</span>
            </button>
          </li>`;
        }).join('')
      : `<li class="empty">No courses match your filters.</li>`;
    $count.textContent = `Showing ${list.length} of ${courses.length} courses, ${bookmarks.size} bookmarked`;
    onChange?.({ filters, bookmarks: [...bookmarks] });
  };

  const saveFilters = () => {
    filters = { query: $q.value, status: $status.value, sort: $sort.value };
    store.setFilters(filters);
    render();
  };
  [$q, $status, $sort].forEach((el) => el.addEventListener('input', saveFilters));

  $list.addEventListener('click', (e) => {
    const btn = e.target.closest('.bookmark');
    if (!btn) return;
    const id = btn.dataset.id;
    bookmarks.has(id) ? bookmarks.delete(id) : bookmarks.add(id);
    store.setBookmarks([...bookmarks]);
    render();
    root.querySelector(`.bookmark[data-id="${id}"]`)?.focus();   // keep keyboard focus
  });

  // keep several open tabs in sync
  window.addEventListener('storage', () => {
    filters = store.getFilters(); bookmarks = new Set(store.getBookmarks());
    $q.value = filters.query; $status.value = filters.status; $sort.value = filters.sort;
    render();
  });

  render();
  return {
    reset() { filters = store.getFilters(); bookmarks = new Set(); $q.value = filters.query; $status.value = filters.status; $sort.value = filters.sort; render(); },
  };
}

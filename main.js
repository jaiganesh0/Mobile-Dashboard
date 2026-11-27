import '@styles/index.css';
import logo from '@assets/logo.svg';
import { env } from '@config/env.js';
import { stats, courses, schedule } from '@data/courses.js';
import { StatCard } from '@components/StatCard.js';
import { Schedule } from '@components/Schedule.js';
import { BuildInfo } from '@components/BuildInfo.js';
import { SavedData } from '@components/SavedData.js';
import { initTabs } from '@components/Tabs.js';
import { initCoursesPanel } from '@components/CoursesPanel.js';
import { initNotesPanel } from '@components/NotesPanel.js';
import { initDrawerGestures } from '@components/gestures.js';
import { getBreakpoint, canHover } from '@utils/device.js';
import { store } from '@utils/store.js';

if (env.debug) console.log(`[${env.mode}] ${env.appName} v${__APP_VERSION__}`);

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses' },
  { id: 'notes', label: 'Notes' },
];

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="shell">
    <header class="topbar">
      <button id="menu-btn" class="icon-btn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="drawer">
        <span aria-hidden="true">&#9776;</span>
      </button>
      <img class="topbar__logo" src="${logo}" alt="" width="32" height="32" />
      <h1 class="topbar__title">${env.appName}</h1>
      <span class="badge" aria-label="Environment: ${env.mode}">${env.mode}</span>
    </header>

    <div id="backdrop" class="backdrop"></div>
    <aside id="drawer" class="drawer">
      <nav aria-label="Main navigation">
        ${tabs.map((t) => `<a href="#${t.id}" class="nav-link" data-tab="${t.id}">${t.label}</a>`).join('')}
      </nav>
    </aside>

    <main id="main" class="content" tabindex="-1">
      <div class="tabs" role="tablist" aria-label="Dashboard sections">
        ${tabs.map((t) => `<button type="button" role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="false" tabindex="-1">${t.label}</button>`).join('')}
      </div>

      <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0" class="panel" hidden>
        <section class="hero" aria-labelledby="hero-title">
          <h2 id="hero-title">Welcome back, Student</h2>
          <p>Here is your progress for this week.</p>
          <button type="button" class="btn" id="hero-btn">View Courses</button>
        </section>
        <div class="stats" role="list" aria-label="Summary statistics">${stats.map((s) => `<div role="listitem">${StatCard(s)}</div>`).join('')}</div>
        <div class="grid">${Schedule(schedule)}${BuildInfo()}${SavedData()}</div>
      </div>

      <div id="panel-courses" role="tabpanel" aria-labelledby="tab-courses" tabindex="0" class="panel" hidden>
        <section class="card" id="courses-root"></section>
      </div>

      <div id="panel-notes" role="tabpanel" aria-labelledby="tab-notes" tabindex="0" class="panel" hidden>
        <section class="card" id="notes-root"></section>
      </div>
    </main>
  </div>`;

/* ---------- Saved-data summary (reads what is persisted) ---------- */
const $ = (id) => document.getElementById(id);
const updateSaved = () => {
  const f = store.getFilters();
  $('sd-bm').textContent = store.getBookmarks().length;
  $('sd-filter').textContent = `${f.status} / ${f.sort}${f.query ? ` / "${f.query}"` : ''}`;
  $('sd-notes').textContent = `${store.getNotes().text.length} chars`;
  $('sd-tab').textContent = store.getActiveTab();
};

/* ---------- Tabs ---------- */
const navLinks = [...document.querySelectorAll('.nav-link')];
const tabsApi = initTabs(document.querySelector('[role="tablist"]'), {
  initial: store.getActiveTab(),
  onChange: (id) => {
    store.setActiveTab(id);
    navLinks.forEach((l) => (l.dataset.tab === id ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current')));
    updateSaved();
  },
});

/* ---------- Panels with persisted state ---------- */
const coursesApi = initCoursesPanel($('courses-root'), courses, updateSaved);
const notesApi = initNotesPanel($('notes-root'), updateSaved);
$('hero-btn').addEventListener('click', () => tabsApi.select('courses', { focus: true }));
$('reset-all').addEventListener('click', () => {
  store.resetAll(); coursesApi.reset(); notesApi.reset(); tabsApi.select('overview');
  updateSaved();
  $('reset-status').textContent = 'All saved data has been reset';
});

/* ---------- Drawer (with focus management) ---------- */
const drawer = $('drawer');
const backdrop = $('backdrop');
const menuBtn = $('menu-btn');
const open = () => {
  drawer.classList.add('is-open'); backdrop.classList.add('is-open');
  menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.setAttribute('aria-label', 'Close navigation menu');
  navLinks[0].focus();
};
const close = ({ restore = true } = {}) => {
  if (!drawer.classList.contains('is-open')) return;
  drawer.classList.remove('is-open'); backdrop.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open navigation menu');
  if (restore) menuBtn.focus();
};
menuBtn.addEventListener('click', () => (drawer.classList.contains('is-open') ? close() : open()));
backdrop.addEventListener('click', () => close());
document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
drawer.addEventListener('click', (e) => {
  const link = e.target.closest('.nav-link');
  if (!link) return;
  e.preventDefault();
  close({ restore: false });
  tabsApi.select(link.dataset.tab);
  $('main').focus();
});
initDrawerGestures(drawer, open, () => close());

/* ---------- Device info ---------- */
const refreshInfo = () => {
  $('info-bp').textContent = getBreakpoint();
  $('info-vw').textContent = `${window.innerWidth}px`;
  $('info-input').textContent = canHover() ? 'mouse (hover)' : 'touch';
};
refreshInfo();
window.addEventListener('resize', refreshInfo);
updateSaved();

import '@styles/index.css';
import logo from '@assets/logo.svg';            // processed by Vite (hashed / inlined)
import { env } from '@config/env.js';           // absolute import via alias
import { stats, courses, schedule } from '@data/courses.js';
import { StatCard } from '@components/StatCard.js';
import { CourseList } from '@components/CourseList.js';
import { Schedule } from '@components/Schedule.js';
import { BuildInfo } from '@components/BuildInfo.js';
import { initDrawerGestures } from '@components/gestures.js';
import { getBreakpoint, canHover } from '@utils/device.js';

if (env.debug) console.log(`[${env.mode}] ${env.appName} v${__APP_VERSION__}`);

const nav = ['Dashboard', 'Courses', 'Tasks', 'Schedule', 'Profile'];

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <header class="topbar">
      <button id="menu-btn" class="icon-btn" aria-label="Open menu" aria-expanded="false">&#9776;</button>
      <img class="topbar__logo" src="${logo}" alt="" width="32" height="32" />
      <h1 class="topbar__title">${env.appName}</h1>
      <span class="badge">${env.mode}</span>
    </header>

    <div id="backdrop" class="backdrop"></div>
    <aside id="drawer" class="drawer" aria-label="Main navigation">
      <nav>
        ${nav.map((n, i) => `<a href="#${n.toLowerCase()}" class="nav-link${i === 0 ? ' is-active' : ''}">${n}</a>`).join('')}
      </nav>
    </aside>

    <main class="content">
      <section class="hero">
        <h2>Welcome back, Student</h2>
        <p>Here is your progress for this week.</p>
        <button class="btn">View Tasks</button>
      </section>
      <div class="stats">${stats.map(StatCard).join('')}</div>
      <div class="grid">
        ${CourseList(courses)}
        ${Schedule(schedule)}
        ${BuildInfo()}
      </div>
    </main>
  </div>`;

const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
const menuBtn = document.getElementById('menu-btn');

const open = () => { drawer.classList.add('is-open'); backdrop.classList.add('is-open'); menuBtn.setAttribute('aria-expanded', 'true'); };
const close = () => { drawer.classList.remove('is-open'); backdrop.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); };

menuBtn.addEventListener('click', () => (drawer.classList.contains('is-open') ? close() : open()));
backdrop.addEventListener('click', close);
document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
drawer.addEventListener('click', (e) => {
  const link = e.target.closest('.nav-link');
  if (!link) return;
  drawer.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('is-active'));
  link.classList.add('is-active');
  close();
});
initDrawerGestures(drawer, open, close);

const refreshInfo = () => {
  document.getElementById('info-bp').textContent = getBreakpoint();
  document.getElementById('info-vw').textContent = `${window.innerWidth}px`;
  document.getElementById('info-input').textContent = canHover() ? 'mouse (hover)' : 'touch';
};
refreshInfo();
window.addEventListener('resize', refreshInfo);

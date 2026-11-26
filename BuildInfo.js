import { env } from '@config/env.js';

// Shows live values produced by vite.config.js (define + .env files)
export const BuildInfo = () => `
  <section class="card" aria-labelledby="build-title">
    <h2 id="build-title" class="card__title">Build &amp; Device Info</h2>
    <dl class="info">
      <div><dt>Mode</dt><dd>${env.mode}</dd></div>
      <div><dt>API URL</dt><dd>${env.apiUrl}</dd></div>
      <div><dt>Debug</dt><dd>${env.debug ? 'on' : 'off'}</dd></div>
      <div><dt>Version</dt><dd>v${__APP_VERSION__}</dd></div>
      <div><dt>Breakpoint</dt><dd id="info-bp">-</dd></div>
      <div><dt>Viewport</dt><dd id="info-vw">-</dd></div>
      <div><dt>Input</dt><dd id="info-input">-</dd></div>
    </dl>
  </section>`;

export const StatCard = ({ label, value, icon }) => `
  <article class="card stat" tabindex="0">
    <span class="stat__icon" aria-hidden="true">${icon}</span>
    <div>
      <p class="stat__value">${value}</p>
      <p class="stat__label">${label}</p>
    </div>
  </article>`;

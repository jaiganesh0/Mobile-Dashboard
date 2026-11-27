export const Schedule = (items) => `
  <section class="card" aria-labelledby="schedule-title">
    <h2 id="schedule-title" class="card__title">Today's Schedule</h2>
    <ul class="schedule">
      ${items
        .map((i) => `<li class="schedule__item"><time>${i.time}</time><span>${i.title}</span></li>`)
        .join('')}
    </ul>
  </section>`;

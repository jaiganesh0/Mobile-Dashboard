import { percent } from '@utils/format.js';

export const CourseList = (courses) => `
  <section class="card" aria-labelledby="courses-title">
    <h2 id="courses-title" class="card__title">Course Progress</h2>
    <ul class="courses">
      ${courses
        .map((c) => {
          const p = percent(c.done, c.total);
          return `<li class="course" tabindex="0">
            <div class="course__row"><span>${c.name}</span><strong>${p}%</strong></div>
            <div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100">
              <span style="width:${p}%"></span>
            </div>
          </li>`;
        })
        .join('')}
    </ul>
  </section>`;

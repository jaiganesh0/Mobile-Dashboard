// Accessible tabs (WAI-ARIA Authoring Practices "Tabs" pattern, manual activation off)
// Keyboard: Left/Right arrows move + activate, Home/End jump, Tab moves into the panel.
export function initTabs(tablist, { initial, onChange }) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const ids = tabs.map((t) => t.id.replace('tab-', ''));

  const select = (id, { focus = false } = {}) => {
    tabs.forEach((tab) => {
      const on = tab.id === `tab-${id}`;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;                 // roving tabindex
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) tab.focus();
    });
    onChange?.(id);
  };

  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab.id.replace('tab-', ''));
  });

  tablist.addEventListener('keydown', (e) => {
    const current = ids.indexOf(document.activeElement.id.replace('tab-', ''));
    if (current < 0) return;
    const move = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: ids.length - 1 }[e.key];
    if (move === undefined) return;
    e.preventDefault();
    select(ids[(move + ids.length) % ids.length], { focus: true });
  });

  select(ids.includes(initial) ? initial : ids[0]);
  return { select };
}

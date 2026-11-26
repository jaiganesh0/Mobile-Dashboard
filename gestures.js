// Touch gesture adaptation: swipe right from the left edge opens the drawer,
// swipe left closes it. Works with touch; mouse users use the button.
export function initDrawerGestures(drawer, open, close) {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return; // not a horizontal swipe
    const isOpen = drawer.classList.contains('is-open');
    if (dx > 0 && startX < 30 && !isOpen) open();
    if (dx < 0 && isOpen) close();
  }, { passive: true });
}

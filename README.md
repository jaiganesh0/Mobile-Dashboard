# Day 4 - State Persistence (Local Storage) & Web Accessibility Audit

Student Dashboard (Vite + vanilla JS), extending the Day 3 project.

## Task 1 - State Persistence with localStorage / sessionStorage
| What is saved | Where | Why |
|---|---|---|
| Course filters (search, status, sort) | `localStorage` | user preference, should survive restart |
| Bookmarked courses | `localStorage` | long-lived user data |
| Study notes (autosave, 400ms debounce) | `localStorage` | input should not be lost on refresh |
| Active tab, task title draft | `sessionStorage` | only relevant to the current browser tab |

- `src/utils/storage.js` - safe wrapper: namespaced + versioned keys (`sd:v1:`), JSON parse/stringify, try/catch for private mode / quota errors, in-memory fallback so the app never crashes.
- `src/utils/store.js` - one place that defines every persisted value (getters/setters) + `debounce`.
- Multi-tab sync using the `storage` event, and a "Reset saved data" button.

## Task 2 - Web Accessibility (a11y) Audit
- **aria-labels**: icon-only buttons (menu, bookmark stars) have labels, `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-current`, live regions (`role="status"`) for filter count / autosave / reset.
- **Keyboard-navigable tabs**: WAI-ARIA tabs pattern - roving tabindex, Left/Right arrows (wrap), Home/End, panels focusable (`src/components/Tabs.js`).
- **Contrast guidelines**: every text colour is at least 4.5:1 and UI colours at least 3:1 (measured values in `docs/A11Y_AUDIT.md`).
- **Other fixes**: skip link, visible 3px focus ring, closed drawer is removed from tab order (`visibility:hidden`), Esc closes drawer and returns focus, labelled form fields, 44px targets, reduced-motion, forced-colors support, no focusable non-interactive elements.
- **Lighthouse**: see "Run Lighthouse" below.

## Run
```bash
npm install
npm run dev
```

### Run Lighthouse (Chrome)
1. `npm run build && npm run preview`, open `http://localhost:4173`
2. DevTools -> Lighthouse -> Accessibility (Mobile) -> Analyze page load
3. Save the report screenshot as `screenshots/lighthouse.png`

## Structure
```
src/utils/storage.js  store.js   src/components/Tabs.js CoursesPanel.js NotesPanel.js SavedData.js
src/styles/a11y.css   docs/A11Y_AUDIT.md   docs/Day4_Report.pdf   screenshots/
```

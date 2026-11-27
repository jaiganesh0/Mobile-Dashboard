import { local, session } from '@utils/storage.js';

// Central persisted state. Each key says WHERE it lives and WHY.
const DEFAULT_FILTERS = { query: '', status: 'all', sort: 'name' };

export const store = {
  // localStorage - long-lived user preferences
  getFilters: () => ({ ...DEFAULT_FILTERS, ...local.get('filters', {}) }),
  setFilters: (f) => local.set('filters', f),

  getBookmarks: () => local.get('bookmarks', []),
  setBookmarks: (list) => local.set('bookmarks', list),

  getNotes: () => local.get('notes', { text: '', savedAt: null }),
  setNotes: (text) => local.set('notes', { text, savedAt: Date.now() }),

  // sessionStorage - only for the current tab / session
  getActiveTab: () => session.get('activeTab', 'overview'),
  setActiveTab: (id) => session.set('activeTab', id),

  getTaskTitle: () => session.get('taskTitle', ''),
  setTaskTitle: (v) => session.set('taskTitle', v),

  resetAll() { local.clear(); session.clear(); },
};

export const debounce = (fn, ms = 400) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

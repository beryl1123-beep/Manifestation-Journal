/* Theme preferences are separate from journal records and backups. */
(() => {
  'use strict';
  const key = 'wish-journal-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let choice = null;
  try { choice = localStorage.getItem(key); } catch (_) {}
  const valid = value => value === 'light' || value === 'dark';
  if (!valid(choice)) choice = null;
  function mount() {
    const toolbar = document.querySelector('.header-tools');
    if (!toolbar) return;
    let button = toolbar.querySelector('.theme-toggle');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-toggle';
      button.addEventListener('click', () => {
        choice = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(key, choice); } catch (_) {}
        apply();
      });
      toolbar.appendChild(button);
    }
    const dark = root.dataset.theme === 'dark';
    const label = dark ? '切换到日间模式' : '切换到夜间模式';
    if (button.textContent !== (dark ? '☀️' : '🌙')) button.textContent = dark ? '☀️' : '🌙';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(dark));
  }
  function apply() {
    const theme = choice || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#201e23' : '#dfb8c5';
    mount();
  }
  apply();
  const observer = new MutationObserver(mount);
  observer.observe(root, {childList: true, subtree: true});
  system.addEventListener('change', () => { if (!choice) apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    choice = valid(event.newValue) ? event.newValue : null;
    apply();
  });
})();

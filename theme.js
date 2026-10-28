// Dark mode toggle. With no saved choice the site follows the device setting.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function effective() {
    var t = root.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : (media.matches ? 'dark' : 'light');
  }

  function sync() {
    var e = effective();
    root.setAttribute('data-theme-effective', e);
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-label', e === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  var btn = document.querySelector('.theme-toggle');
  if (btn) btn.addEventListener('click', function () {
    var next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });

  if (media.addEventListener) media.addEventListener('change', sync);
  sync();
})();

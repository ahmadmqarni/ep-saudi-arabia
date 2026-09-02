(function(){
  const STORAGE_KEY = 'ep-sa-theme';
  const root = document.documentElement;

  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved === 'light' || saved === 'dark'){
    root.setAttribute('data-theme', saved);
  }

  function currentTheme(){
    const explicit = root.getAttribute('data-theme');
    if(explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.getElementById('themeToggle').addEventListener('click', ()=>{
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });
})();

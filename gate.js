/* Casual front-door gate — not real security (the password is readable in
   this file's source). Just keeps the link from being obviously open.
   Asks on every page load; nothing is remembered between visits. */
(function(){
  const PASSWORD = 'SaudiEP2026';

  const gate = document.getElementById('gate');
  const app = document.getElementById('app');
  const form = document.getElementById('gateForm');
  const input = document.getElementById('gatePassword');
  const error = document.getElementById('gateError');

  /* earlier versions remembered the unlock in the browser — clear that out */
  try { localStorage.removeItem('ep-sa-unlocked'); } catch(e){}

  input.focus();

  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(input.value === PASSWORD){
      gate.hidden = true;
      app.hidden = false;
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });

  /* Back/forward can restore a page from the browser's cache already unlocked;
     reload so the gate asks again. */
  window.addEventListener('pageshow', e=>{
    if(e.persisted) location.reload();
  });
})();

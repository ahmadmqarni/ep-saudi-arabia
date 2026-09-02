/* Casual front-door gate — not real security (the password is readable in
   this file's source). Just keeps the link from being obviously open. */
(function(){
  const PASSWORD = 'SaudiEP2026';
  const STORAGE_KEY = 'ep-sa-unlocked';

  const gate = document.getElementById('gate');
  const app = document.getElementById('app');
  const form = document.getElementById('gateForm');
  const input = document.getElementById('gatePassword');
  const error = document.getElementById('gateError');

  function unlock(){
    gate.hidden = true;
    app.hidden = false;
  }

  if(localStorage.getItem(STORAGE_KEY) === 'true'){
    unlock();
  } else {
    input.focus();
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(input.value === PASSWORD){
      localStorage.setItem(STORAGE_KEY, 'true');
      unlock();
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
})();

/* ======================= POPOVER ======================= */
let popoverEl = null;

function scheduleClose(){
  closeTimer = setTimeout(()=>{ closePopover(); }, 180);
}
function closePopover(){
  if(popoverEl){ popoverEl.remove(); popoverEl=null; }
  if(activeCityId){
    const prev = svg.querySelector(`.city[data-city="${activeCityId}"]`);
    if(prev) prev.classList.remove('active');
  }
  activeCityId = null;
}

function openPopover(cityId, targetGroup){
  if(activeCityId===cityId && popoverEl) return;
  closePopover();
  activeCityId = cityId;
  targetGroup.classList.add('active');
  const city = CITIES[cityId];

  const pop = document.createElement('div');
  pop.className='popover';
  const stageRect = stage.getBoundingClientRect();
  const dotRect = targetGroup.querySelector('.city-dot').getBoundingClientRect();
  const relX = dotRect.left + dotRect.width/2 - stageRect.left;
  const aboveTop = dotRect.top - stageRect.top;
  const belowTop = dotRect.bottom - stageRect.top;
  pop.style.left = relX+'px';
  pop.style.top = aboveTop+'px';

  let html = `<p class="popover-city">${city.name}</p><p class="popover-region">${REGIONS[city.region].name}</p>`;
  if(city.centers.length===0){
    html += `<p class="popover-empty">No electrophysiologists listed here yet.</p>`;
  } else {
    html += `<div class="popover-centers">`;
    city.centers.forEach(cid=>{
      const cnt = CENTERS[cid];
      html += `<button class="center-chip" data-center="${cid}">${cnt.name}<span class="center-chip-count">${cnt.people.length}</span></button>`;
    });
    html += `</div>`;
  }
  pop.innerHTML = html;
  pop.addEventListener('mouseenter',()=>clearTimeout(closeTimer));
  pop.addEventListener('mouseleave',()=>scheduleClose());
  pop.querySelectorAll('.center-chip').forEach(btn=>{
    btn.addEventListener('click',(e)=>{ e.stopPropagation(); openPanel(btn.getAttribute('data-center')); });
  });
  const pad = 8;
  /* never let a long list (a city with many centers) outgrow the stage
     itself — cap it to the actual space available and let it scroll */
  pop.style.maxHeight = Math.max(120, stageRect.height - pad*2) + 'px';

  stage.appendChild(pop);
  popoverEl = pop;

  /* flip below the dot if positioning above would run the popover past the
     top of the stage — a fixed threshold can't work here since taller lists
     need more headroom than short ones */
  let popRect = pop.getBoundingClientRect();
  if(popRect.top < stageRect.top + pad){
    pop.classList.add('below');
    pop.style.top = belowTop+'px';
    popRect = pop.getBoundingClientRect();
  }

  /* then, regardless of which way it's pointing, slide it up if it still
     runs past the bottom of the stage (a dot sitting low on a short screen,
     paired with a long list) — clamped so it never gets pushed back off
     the top either */
  if(popRect.bottom > stageRect.bottom - pad){
    const overflow = popRect.bottom - (stageRect.bottom - pad);
    pop.style.top = (parseFloat(pop.style.top) - overflow) + 'px';
    popRect = pop.getBoundingClientRect();
  }

  /* clamp horizontally so the popover never runs off the edge of the stage
     (matters most on narrow/mobile viewports where cities sit near the edge) */
  let shift = 0;
  if(popRect.left < stageRect.left + pad) shift = (stageRect.left + pad) - popRect.left;
  else if(popRect.right > stageRect.right - pad) shift = (stageRect.right - pad) - popRect.right;
  if(shift !== 0) pop.style.left = (relX + shift) + 'px';
}

document.addEventListener('click',(e)=>{
  if(popoverEl && !popoverEl.contains(e.target)) closePopover();
});

/* ======================= PANEL ======================= */
const panel = document.getElementById('panel');
const scrim = document.getElementById('scrim');
const panelEyebrow = document.getElementById('panelEyebrow');
const panelTitle = document.getElementById('panelTitle');
const panelSub = document.getElementById('panelSub');
const panelBody = document.getElementById('panelBody');

const LINKEDIN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const PHONE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

function telHref(phone){
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('0') ? digits.slice(1) : digits;
  return `tel:+966${local}`;
}

function personCardHTML(p, highlight){
  const src = p.photo && PHOTOS[p.photo];
  const photoInner = src
    ? `<img class="person-photo" src="${src}" alt="${escapeHtml(p.name)}">`
    : `<span class="person-photo fallback">${SILHOUETTE}</span>`;
  const trainingCountry = countryForUniversity(p.university);
  const uniHtml = p.university
    ? `<span class="person-university">${trainingCountry ? trainingCountry.flag+' ' : ''}${escapeHtml(p.university)}</span>`
    : '';
  const links = [];
  if(p.linkedin) links.push(`<a class="person-link" href="${escapeHtml(p.linkedin)}" target="_blank" rel="noopener noreferrer">${LINKEDIN_ICON}LinkedIn</a>`);
  if(p.profile) links.push(`<a class="person-link" href="${escapeHtml(p.profile)}" target="_blank" rel="noopener noreferrer">${LINKEDIN_ICON}Profile</a>`);
  if(p.phone) links.push(`<a class="person-link" href="${telHref(p.phone)}">${PHONE_ICON}${escapeHtml(p.phone)}</a>`);
  const linksHtml = links.length ? `<div class="person-links">${links.join('')}</div>` : '';
  return `<div class="person-card${highlight?' flash':''}" data-person="${escapeHtml(p.name)}">${photoInner}<div class="person-info"><span class="person-name">${escapeHtml(p.name)}</span>${uniHtml}${linksHtml}</div></div>`;
}

function openPanel(centerId, highlightName){
  const c = CENTERS[centerId];
  const city = CITIES[c.city];
  panelEyebrow.textContent = REGIONS[city.region].name;
  panelTitle.textContent = c.name;
  panelSub.textContent = city.name + ' · ' + c.people.length + (c.people.length===1?' physician':' physicians');
  panelBody.innerHTML = c.people.map(p=>personCardHTML(p, p.name===highlightName)).join('');
  panel.classList.add('open');
  scrim.classList.add('open');
  if(highlightName){
    requestAnimationFrame(()=>{
      const card = panelBody.querySelector(`[data-person="${CSS.escape(highlightName)}"]`);
      if(card) card.scrollIntoView({block:'center'});
    });
  }
}
function closePanel(){
  panel.classList.remove('open');
  scrim.classList.remove('open');
}
document.getElementById('panelClose').addEventListener('click', closePanel);
scrim.addEventListener('click', closePanel);
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closePanel(); closePopover(); } });

/* ======================= SEARCH ======================= */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ searchResults.classList.remove('open'); searchResults.innerHTML=''; return; }
  const all = PEOPLE.filter(p=>{
    const c = CENTERS[p.center];
    const city = CITIES[c.city];
    const region = REGIONS[city.region];
    return p.name.toLowerCase().includes(q)
      || city.name.toLowerCase().includes(q)
      || c.name.toLowerCase().includes(q)
      || region.name.toLowerCase().includes(q);
  });
  const matches = all.slice(0,10);
  if(matches.length===0){
    searchResults.innerHTML = `<div class="search-empty">No one matches &ldquo;${escapeHtml(searchInput.value)}&rdquo;.</div>`;
  } else {
    searchResults.innerHTML = matches.map(p=>{
      const c = CENTERS[p.center];
      const city = CITIES[c.city];
      const src = p.photo && PHOTOS[p.photo];
      const avatar = src
        ? `<img class="search-result-avatar" src="${src}" alt="">`
        : `<span class="search-result-avatar" style="display:flex;align-items:center;justify-content:center;color:var(--ink-soft);padding:8px;">${SILHOUETTE}</span>`;
      return `<button class="search-result" data-name="${escapeHtml(p.name)}">${avatar}<span class="search-result-text"><span class="search-result-name">${escapeHtml(p.name)}</span><span class="search-result-meta">${escapeHtml(c.name)} &middot; ${escapeHtml(city.name)}</span></span></button>`;
    }).join('');
    if(all.length>matches.length){
      searchResults.innerHTML += `<div class="search-empty">+${all.length-matches.length} more &mdash; keep typing to narrow it down.</div>`;
    }
  }
  searchResults.classList.add('open');
});
searchResults.addEventListener('click', e=>{
  const btn = e.target.closest('.search-result');
  if(!btn) return;
  const name = btn.getAttribute('data-name');
  const person = PEOPLE.find(p=>p.name===name);
  if(person){
    openPanel(person.center, person.name);
    searchResults.classList.remove('open');
    searchInput.blur();
  }
});
document.addEventListener('click', e=>{
  if(!e.target.closest('.search-wrap')) searchResults.classList.remove('open');
});

/* ======================= TALLY ======================= */
document.getElementById('stageTally').innerHTML =
  `<b>${PEOPLE.length}</b> electrophysiologists &middot; <b>${Object.keys(CENTERS).length}</b> centers<br>`+
  `<b>${Object.values(CITIES).filter(c=>c.centers.length>0).length}</b> of ${Object.keys(CITIES).length} cities mapped`;

/* ======================= VIEW TABS ======================= */
const views = {
  overview: document.getElementById('overviewView'),
  map: document.getElementById('mapView'),
};
const tabs = {
  overview: document.getElementById('tabOverview'),
  map: document.getElementById('tabMap'),
};
const searchWrap = document.getElementById('searchWrap');

function showView(name){
  Object.keys(views).forEach(k=>{
    views[k].hidden = k !== name;
    tabs[k].classList.toggle('active', k === name);
  });
  searchWrap.hidden = name !== 'map';
  if(name === 'map') layout();
  if(name !== 'map'){ closePopover(); closePanel(); searchResults.classList.remove('open'); }
}
document.getElementById('viewTabs').addEventListener('click', e=>{
  const btn = e.target.closest('.view-tab');
  if(btn) showView(btn.getAttribute('data-view'));
});

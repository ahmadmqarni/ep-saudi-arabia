/* ======================= STATS ======================= */
function computeRegionCounts(){
  const counts = {};
  Object.keys(REGIONS).forEach(r=>counts[r]=0);
  PEOPLE.forEach(p=>{
    const city = CITIES[CENTERS[p.center].city];
    counts[city.region]++;
  });
  return Object.keys(counts)
    .map(r=>({id:r, name:REGIONS[r].name.replace(' Region',''), count:counts[r]}))
    .sort((a,b)=>b.count-a.count);
}

function computeTrainingCounts(){
  const counts = {};
  let known = 0;
  PEOPLE.forEach(p=>{
    const entry = countryForUniversity(p.university);
    if(!entry) return;
    counts[entry.country] = (counts[entry.country]||0) + 1;
    known++;
  });
  const rows = Object.keys(counts)
    .map(country=>({
      name:country,
      flag:TRAINING_COUNTRIES.find(t=>t.country===country).flag,
      count:counts[country],
    }))
    .sort((a,b)=>b.count-a.count);
  return {rows, known};
}

function peopleByRegion(){
  const groups = {};
  Object.keys(REGIONS).forEach(r=>groups[r]=[]);
  PEOPLE.forEach(p=>{
    const city = CITIES[CENTERS[p.center].city];
    groups[city.region].push(p);
  });
  Object.keys(groups).forEach(r=>groups[r].sort((a,b)=>a.name.localeCompare(b.name)));
  return groups;
}

/* ======================= CHART (thin horizontal bars) ======================= */
function barChartHTML(rows, totalForScale){
  const max = Math.max(...rows.map(r=>r.count), 1);
  return rows.map(r=>{
    const pct = Math.round((r.count / max) * 100);
    const label = r.flag ? `${r.flag} ${r.name}` : r.name;
    return `
      <div class="chart-row" data-count="${r.count}">
        <span class="chart-label">${escapeHtml(label)}</span>
        <span class="chart-track"><span class="chart-fill" style="width:${pct}%"></span></span>
        <span class="chart-value">${r.count}</span>
      </div>`;
  }).join('');
}

/* ======================= REGION ACCORDION (photo + name grid) ======================= */
function physicianTileHTML(p){
  const src = p.photo && PHOTOS[p.photo];
  const photoInner = src
    ? `<img class="physician-tile-photo" src="${src}" alt="${escapeHtml(p.name)}">`
    : `<span class="physician-tile-photo fallback">${SILHOUETTE}</span>`;
  return `<button class="physician-tile" data-name="${escapeHtml(p.name)}" data-center="${p.center}">${photoInner}<span class="physician-tile-name">${escapeHtml(p.name)}</span></button>`;
}

function regionAccordionHTML(regionRows, groups){
  return regionRows.map(r=>{
    const people = groups[r.id];
    const body = people.length
      ? `<div class="physician-grid">${people.map(physicianTileHTML).join('')}</div>`
      : `<p class="region-body-empty">No physicians listed here yet.</p>`;
    return `
      <div class="region-accordion">
        <button class="region-header" data-region="${r.id}" aria-expanded="false">
          <span class="region-header-name">${escapeHtml(REGIONS[r.id].name)}</span>
          <span class="region-header-count">${r.count}</span>
          <svg class="region-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="region-body" hidden>${body}</div>
      </div>`;
  }).join('');
}

function wireRegionAccordion(){
  document.querySelectorAll('.region-header').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const body = btn.nextElementSibling;
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
    });
  });
  document.querySelectorAll('.physician-tile').forEach(tile=>{
    tile.addEventListener('click', ()=>{
      openPanel(tile.getAttribute('data-center'), tile.getAttribute('data-name'));
    });
  });
}

/* ======================= BUILD PAGE ======================= */
function buildOverview(){
  const totalPeople = PEOPLE.length;
  const totalCenters = Object.keys(CENTERS).length;
  const citiesWithData = Object.values(CITIES).filter(c=>c.centers.length>0).length;
  const totalCities = Object.keys(CITIES).length;

  const regionRows = computeRegionCounts();
  const top = regionRows[0];
  const second = regionRows[1];
  const topPct = Math.round((top.count / totalPeople) * 100);

  const {rows: trainingRows, known} = computeTrainingCounts();
  const topTraining = trainingRows[0];
  const topTrainingPct = known ? Math.round((topTraining.count / known) * 100) : 0;

  document.getElementById('overviewView').innerHTML = `
    <div class="overview-inner">
      <section class="overview-intro">
        <p class="overview-lede">A working map of cardiac electrophysiology in Saudi Arabia — every
        physician, center, and city gathered so far, kept up to date as more comes in.
        Switch to the <strong>Map</strong> tab above to browse it region by region and center by center,
        or read on for how the group breaks down today.</p>
      </section>

      <section class="stat-row">
        <div class="stat-tile">
          <span class="stat-value">${totalPeople}</span>
          <span class="stat-label">Electrophysiologists</span>
        </div>
        <div class="stat-tile">
          <span class="stat-value">${totalCenters}</span>
          <span class="stat-label">Centers</span>
        </div>
        <div class="stat-tile">
          <span class="stat-value">${citiesWithData}<span class="stat-value-of"> / ${totalCities}</span></span>
          <span class="stat-label">Cities with a physician</span>
        </div>
      </section>

      <section class="overview-section">
        <h2 class="overview-heading">By region</h2>
        <p class="overview-text">${escapeHtml(top.name)} accounts for ${top.count} of the ${totalPeople}
        physicians on record — ${topPct}% of everyone tracked. ${escapeHtml(second.name)} is a distant
        second with ${second.count}.</p>
        <div class="chart">${barChartHTML(regionRows)}</div>
      </section>

      <section class="overview-section">
        <h2 class="overview-heading">Where they trained</h2>
        <p class="overview-text">Training location is on file for ${known} of ${totalPeople} physicians.
        Among those, ${topTraining.count} trained in ${topTraining.flag} ${escapeHtml(topTraining.name)} —
        ${topTrainingPct}% of everyone with a known training location.</p>
        <div class="chart">${barChartHTML(trainingRows)}</div>
      </section>

      <section class="overview-section">
        <h2 class="overview-heading">All physicians</h2>
        <p class="overview-text">Every physician on record, grouped by region. Click a region to see everyone
        in it, and click a name for their center, training, and contact details.</p>
        <div class="region-accordion-list">${regionAccordionHTML(regionRows, peopleByRegion())}</div>
      </section>
    </div>
  `;

  wireRegionAccordion();
}

buildOverview();

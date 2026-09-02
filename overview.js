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
    </div>
  `;
}

buildOverview();

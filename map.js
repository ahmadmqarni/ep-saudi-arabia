/* ======================= MAP ======================= */
/* Province shapes come from OpenStreetMap data (see geo.js). The map pans and
   zooms. Markers and labels are counter-scaled so they stay the same size on
   screen — zooming in pulls crowded cities apart instead of enlarging them. */
const svg = document.getElementById('mapSvg');
const stage = document.getElementById('stage');
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent){
  const e = document.createElementNS(NS, tag);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  if(parent) parent.appendChild(e);
  return e;
}

svg.setAttribute('viewBox', `0 0 ${GEO.width} ${GEO.height}`);
const viewport = el('g', {class:'map-viewport'}, svg);

/* provinces: a wide "halo" pass first, so only the country's outer edge shows
   it, then the filled provinces on top with thin borders between them */
const haloLayer = el('g', {}, viewport);
GEO.provinces.forEach(p=>el('path', {d:p.d, class:'province-halo'}, haloLayer));
const provinceLayer = el('g', {}, viewport);
GEO.provinces.forEach(p=>el('path', {d:p.d, class:'province', 'data-province':p.id}, provinceLayer));

const provinceLabels = GEO.provinces.map(p=>{
  const g = el('g', {class:'province-label-g'}, viewport);
  const t = el('text', {class:'province-label', 'text-anchor':'middle'}, g);
  t.textContent = p.name.toUpperCase();
  return {p, g, t};
});

/* ---------- cities ---------- */
const cityIds = Object.keys(CITIES);
const cityEls = {};
let activeCityId = null;
let closeTimer = null;

cityIds.forEach(id=>{
  const c = CITIES[id];
  const pt = projectLonLat(c.lon, c.lat);
  c.x = pt.x; c.y = pt.y;
  c.count = c.centers.reduce((s,cid)=>s+CENTERS[cid].people.length, 0);
});
cityIds.forEach(id=>{
  const c = CITIES[id];
  c.nn = Math.min(...cityIds.filter(o=>o!==id).map(o=>Math.hypot(c.x-CITIES[o].x, c.y-CITIES[o].y)));
});

function cityRank(c){ return c.count>0 ? 0 : (c.capital ? 2 : 4); }

/* where a city's name can sit relative to its dot (offsets in screen px) */
const LABEL_SIDES = {
  right:     {x:9,  y:4,   a:'start'},
  left:      {x:-9, y:4,   a:'end'},
  below:     {x:0,  y:19,  a:'middle'},
  above:     {x:0,  y:-21, a:'middle', yNoCount:-9},
  rightUp:   {x:8,  y:-6,  a:'start'},
  rightDown: {x:8,  y:15,  a:'start'},
  leftUp:    {x:-8, y:-6,  a:'end'},
  leftDown:  {x:-8, y:15,  a:'end'},
};
const LABEL_SIDE_ORDER = ['right','left','below','above','rightUp','rightDown','leftUp','leftDown'];

function setCitySide(id, side){
  const e = cityEls[id], s = LABEL_SIDES[side];
  e.label.setAttribute('x', s.x);
  e.label.setAttribute('y', (side==='above' && !e.hasData) ? s.yNoCount : s.y);
  e.label.setAttribute('text-anchor', s.a);
  if(e.countSpan) e.countSpan.setAttribute('x', s.x);
}

/* draw cities without physicians first, so where tap targets overlap the city
   with physicians is on top and wins */
cityIds.slice().sort((a,b)=>cityRank(CITIES[b])-cityRank(CITIES[a])).forEach(id=>{
  const c = CITIES[id];
  const hasData = c.count > 0;
  const g = el('g', {class:'city'+(hasData?'':' empty'), 'data-city':id}, viewport);
  el('circle', {r:14, class:'city-pulse'}, g);
  const dot = el('circle', {r:hasData?5:3.6, class:'city-dot'}, g);
  const hit = el('circle', {r:12, class:'city-hit'}, g);

  const label = el('text', {class:'city-label'}, g);
  el('tspan', {}, label).textContent = c.mapLabel || c.name;
  let countSpan = null;
  if(hasData){
    countSpan = el('tspan', {class:'city-label-count', dy:12}, label);
    countSpan.textContent = `(${c.count})`;
  }
  cityEls[id] = {g, dot, hit, label, countSpan, hasData};
  setCitySide(id, c.labelSide || 'right');

  g.addEventListener('mouseenter', ()=>{ clearTimeout(closeTimer); openPopover(id, g); });
  g.addEventListener('mouseleave', ()=>{ scheduleClose(); });
  g.addEventListener('click', (e)=>{ e.stopPropagation(); clearTimeout(closeTimer); openPopover(id, g); });
});

/* ---------- view (zoom + pan) ---------- */
const view = {z:1, tx:0, ty:0};
const MIN_Z = 1, MAX_Z = 12;
const MIN_HIT = window.matchMedia('(pointer: coarse)').matches ? 10 : 7;   /* smallest tap target radius, px */
let unitPx = 1;   /* screen px per viewBox unit at zoom 1 */

const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');

function clampView(){
  view.tx = Math.min(0, Math.max(GEO.width*(1-view.z), view.tx));
  view.ty = Math.min(0, Math.max(GEO.height*(1-view.z), view.ty));
}

function layout(){
  const r = svg.getBoundingClientRect();
  if(!r.width || !r.height) return;
  unitPx = Math.min(r.width/GEO.width, r.height/GEO.height);
  clampView();
  viewport.setAttribute('transform', `translate(${view.tx.toFixed(2)} ${view.ty.toFixed(2)}) scale(${view.z.toFixed(4)})`);
  const k = 1/(view.z*unitPx);   /* one local unit == one screen px */
  cityIds.forEach(id=>{
    const c = CITIES[id], e = cityEls[id];
    e.g.setAttribute('transform', `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${k})`);
    const nnPx = c.nn * view.z * unitPx;
    e.hit.setAttribute('r', Math.min(22, Math.max(MIN_HIT, nnPx/2 - 1.5)).toFixed(1));
  });
  provinceLabels.forEach(pl=>{
    pl.g.setAttribute('transform', `translate(${pl.p.lx} ${pl.p.ly}) scale(${k})`);
  });
  zoomInBtn.disabled = view.z >= MAX_Z - 1e-6;
  zoomOutBtn.disabled = view.z <= MIN_Z + 1e-6;
  scheduleLabels();
}

/* viewBox point under a screen position */
function clientToUser(cx, cy){
  const m = svg.getScreenCTM();
  if(!m) return {x:0, y:0};
  const pt = svg.createSVGPoint();
  pt.x = cx; pt.y = cy;
  return pt.matrixTransform(m.inverse());
}

/* zoom by `factor`, keeping the point under (cx, cy) fixed — no layout, callers do that */
function zoomAt(factor, cx, cy){
  const p = clientToUser(cx, cy);
  const nz = Math.min(MAX_Z, Math.max(MIN_Z, view.z*factor));
  const ratio = nz/view.z;
  view.tx = p.x - ratio*(p.x - view.tx);
  view.ty = p.y - ratio*(p.y - view.ty);
  view.z = nz;
}
function zoomBy(factor){
  const r = svg.getBoundingClientRect();
  closePopover();
  zoomAt(factor, r.left + r.width/2, r.top + r.height/2);
  layout();
}
zoomInBtn.addEventListener('click', ()=>zoomBy(1.6));
zoomOutBtn.addEventListener('click', ()=>zoomBy(1/1.6));
zoomResetBtn.addEventListener('click', ()=>{ closePopover(); view.z = 1; view.tx = 0; view.ty = 0; layout(); });

svg.addEventListener('wheel', e=>{
  e.preventDefault();
  closePopover();
  zoomAt(Math.exp(-e.deltaY*(e.deltaMode===1 ? 0.05 : 0.0016)), e.clientX, e.clientY);
  layout();
}, {passive:false});

svg.addEventListener('dblclick', e=>{
  if(e.target.closest('.city')) return;
  closePopover();
  zoomAt(2, e.clientX, e.clientY);
  layout();
});

/* drag to pan, two fingers to pinch-zoom */
const pointers = new Map();
let drag = null, pinch = null, suppressClick = false;

function pointerPair(){ return [...pointers.values()]; }
function pairDist(){ const [a,b] = pointerPair(); return Math.hypot(a.x-b.x, a.y-b.y); }
function pairMid(){ const [a,b] = pointerPair(); return {x:(a.x+b.x)/2, y:(a.y+b.y)/2}; }

svg.addEventListener('pointerdown', e=>{
  if(e.pointerType==='mouse' && e.button!==0) return;
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
  if(pointers.size===1){
    drag = {x:e.clientX, y:e.clientY, moved:false};
  } else if(pointers.size===2){
    if(drag) drag.moved = true;
    pinch = {dist:pairDist(), mid:pairMid()};
    closePopover();
  }
});

svg.addEventListener('pointermove', e=>{
  const prev = pointers.get(e.pointerId);
  if(!prev) return;
  const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});

  if(pointers.size===2 && pinch){
    const nd = pairDist(), nm = pairMid();
    if(pinch.dist > 0) zoomAt(nd/pinch.dist, nm.x, nm.y);
    view.tx += (nm.x - pinch.mid.x)/unitPx;
    view.ty += (nm.y - pinch.mid.y)/unitPx;
    pinch = {dist:nd, mid:nm};
    layout();
    return;
  }
  if(pointers.size===1 && drag){
    if(!drag.moved){
      if(Math.hypot(e.clientX-drag.x, e.clientY-drag.y) < 5) return;
      drag.moved = true;
      closePopover();
      svg.classList.add('is-dragging');
      try{ svg.setPointerCapture(e.pointerId); }catch(err){}
    }
    view.tx += dx/unitPx;
    view.ty += dy/unitPx;
    layout();
  }
});

function endPointer(e){
  if(!pointers.has(e.pointerId)) return;
  pointers.delete(e.pointerId);
  if(pointers.size < 2) pinch = null;
  if(pointers.size === 0){
    if(drag && drag.moved){
      suppressClick = true;
      setTimeout(()=>{ suppressClick = false; }, 60);
    }
    drag = null;
    svg.classList.remove('is-dragging');
  }
}
svg.addEventListener('pointerup', endPointer);
svg.addEventListener('pointercancel', endPointer);
svg.addEventListener('click', e=>{
  if(suppressClick){ e.stopPropagation(); e.preventDefault(); }
}, true);

/* ---------- labels: keep what fits, hide what would collide ---------- */
let labelFrame = 0;
function scheduleLabels(){
  if(labelFrame) return;
  labelFrame = requestAnimationFrame(()=>{ labelFrame = 0; placeLabels(); });
}

function placeLabels(){
  cityIds.forEach(id=>cityEls[id].label.classList.remove('is-hidden'));
  provinceLabels.forEach(pl=>{ pl.t.classList.remove('is-hidden'); pl.t.setAttribute('y', 0); });

  const pad = 2;
  const box = n=>{
    const r = n.getBoundingClientRect();
    return {l:r.left-pad, r:r.right+pad, t:r.top-pad, b:r.bottom+pad, w:r.width, h:r.height};
  };
  const overlap = (a,b)=>!(a.r<=b.l || a.l>=b.r || a.b<=b.t || a.t>=b.b);
  const dots = cityIds.map(id=>{
    const r = cityEls[id].dot.getBoundingClientRect();
    return {id, l:r.left-1, r:r.right+1, t:r.top-1, b:r.bottom+1};
  });
  const accepted = [];
  const blocked = (b, ownId)=>accepted.some(a=>overlap(a,b)) || dots.some(d=>d.id!==ownId && overlap(d,b));

  /* cities with physicians win, then province capitals, then province names, then other cities */
  const queue = [];
  cityIds.forEach(id=>queue.push({kind:'city', id, rank:cityRank(CITIES[id]), tie:-CITIES[id].count}));
  provinceLabels.forEach(pl=>queue.push({kind:'prov', pl, rank:3, tie:-(pl.p.bw*pl.p.bh)}));
  queue.sort((a,b)=>a.rank-b.rank || a.tie-b.tie);

  queue.forEach(item=>{
    if(item.kind==='city'){
      const c = CITIES[item.id], e = cityEls[item.id];
      const preferred = c.labelSide || 'right';
      const sides = [preferred, ...LABEL_SIDE_ORDER.filter(s=>s!==preferred)];
      for(const side of sides){
        setCitySide(item.id, side);
        const b = box(e.label);
        if(!blocked(b, item.id)){ accepted.push(b); return; }
      }
      if(item.rank === 0){
        /* a city with physicians never loses its name — nothing is clear, so
           take the position that covers the least */
        const obstacles = [...accepted, ...dots.filter(d=>d.id!==item.id)];
        const inter = (a,b)=>{
          const w = Math.min(a.r,b.r) - Math.max(a.l,b.l), h = Math.min(a.b,b.b) - Math.max(a.t,b.t);
          return w>0 && h>0 ? w*h : 0;
        };
        let best = null;
        for(const side of sides){
          setCitySide(item.id, side);
          const b = box(e.label);
          const area = obstacles.reduce((s,o)=>s+inter(o,b), 0);
          if(!best || area < best.area) best = {side, area};
        }
        setCitySide(item.id, best.side);
        accepted.push(box(e.label));
      } else {
        e.label.classList.add('is-hidden');
      }
      return;
    }
    const pl = item.pl;
    const b0 = box(pl.t);
    if(b0.w > pl.p.bw*view.z*unitPx*0.9 || b0.h > pl.p.bh*view.z*unitPx*0.9){
      pl.t.classList.add('is-hidden');
      return;
    }
    for(const dy of [0, 15, -15, 30, -30]){
      pl.t.setAttribute('y', dy);
      const b = box(pl.t);
      if(!blocked(b, null)){ accepted.push(b); return; }
    }
    pl.t.classList.add('is-hidden');
  });
}

new ResizeObserver(()=>layout()).observe(stage);
layout();

"""Turn geoBoundaries SAU ADM1 GeoJSON (OpenStreetMap-derived, ODbL) into geo.js:
Web-Mercator projected, simplified province paths + label points.
usage: python -I build_geo.py <input.geojson> <output geo.js>"""
import json, math, sys

SRC, OUT = sys.argv[1], sys.argv[2]
W, PAD = 1000.0, 24.0      # map width in viewBox units, and padding
TOL = 0.22                 # simplification tolerance, viewBox units (~0.5 km)
MIN_AREA = 2.0             # drop islets smaller than this (sq units)

DISPLAY = {
    "SA-01": "Riyadh", "SA-02": "Makkah", "SA-03": "Al Madinah", "SA-04": "Eastern",
    "SA-05": "Qassim", "SA-06": "Ha'il", "SA-07": "Tabuk", "SA-08": "Northern Borders",
    "SA-09": "Jazan", "SA-10": "Najran", "SA-11": "Al Bahah", "SA-12": "Al Jawf",
    "SA-14": "'Asir",
}

# real-world coordinates (lat, lon) -> province expected, used only as a sanity check
CITY_CHECK = {
    "Riyadh": (24.7136, 46.6753, "SA-01"), "Al-Kharj": (24.1556, 47.3120, "SA-01"),
    "Buraidah": (26.3260, 43.9750, "SA-05"), "Hail": (27.5114, 41.7208, "SA-06"),
    "Sakaka": (29.9697, 40.2064, "SA-12"), "Arar": (30.9753, 41.0381, "SA-08"),
    "Tabuk": (28.3838, 36.5662, "SA-07"), "Madinah": (24.4709, 39.6122, "SA-03"),
    "Jeddah": (21.5433, 39.1728, "SA-02"), "Makkah": (21.3891, 39.8579, "SA-02"),
    "Taif": (21.2703, 40.4158, "SA-02"), "Abha": (18.2164, 42.5053, "SA-14"),
    "Khamis Mushait": (18.3000, 42.7333, "SA-14"), "Al Bahah": (20.0129, 41.4677, "SA-11"),
    "Jazan": (16.8892, 42.5511, "SA-09"), "Najran": (17.4933, 44.1277, "SA-10"),
    "Dammam": (26.4207, 50.0888, "SA-04"), "Al-Khobar": (26.2794, 50.2083, "SA-04"),
    "Hofuf": (25.3648, 49.5873, "SA-04"), "Hafr Al-Batin": (28.4328, 45.9708, "SA-04"),
}

with open(SRC, encoding="utf-8") as f:
    gj = json.load(f)

def polys_of(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]

def merc(lon, lat):
    return math.radians(lon), math.asinh(math.tan(math.radians(lat)))

# ---- bounding box of everything, in mercator space
mx, my = [], []
for ft in gj["features"]:
    for poly in polys_of(ft["geometry"]):
        for ring in poly:
            for lon, lat in ring:
                x, y = merc(lon, lat)
                mx.append(x); my.append(y)
xmin, xmax, ymin, ymax = min(mx), max(mx), min(my), max(my)
K = (W - 2 * PAD) / (xmax - xmin)
H = round((ymax - ymin) * K + 2 * PAD, 1)

def proj(lon, lat):
    x, y = merc(lon, lat)
    return PAD + (x - xmin) * K, PAD + (ymax - y) * K

# ---- Douglas-Peucker (iterative)
def dp(pts, tol):
    n = len(pts)
    if n < 3:
        return pts[:]
    keep = [False] * n
    keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        L2 = dx * dx + dy * dy
        dmax, idx = 0.0, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            if L2 == 0:
                d = math.hypot(px - ax, py - ay)
            else:
                t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2))
                d = math.hypot(px - (ax + t * dx), py - (ay + t * dy))
            if d > dmax:
                dmax, idx = d, i
        if dmax > tol and idx > 0:
            keep[idx] = True
            stack.append((a, idx)); stack.append((idx, b))
    return [p for p, k in zip(pts, keep) if k]

def simplify_ring(ring):
    pts = [proj(lon, lat) for lon, lat in ring]
    if pts[0] == pts[-1]:
        pts = pts[:-1]
    if len(pts) < 4:
        return pts
    # split at the vertex farthest from the start so DP has a real baseline
    m = max(range(len(pts)), key=lambda i: math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]))
    a = dp(pts[:m + 1], TOL)
    b = dp(pts[m:] + [pts[0]], TOL)
    out = a[:-1] + b[:-1]
    # round + dedupe
    res = []
    for x, y in out:
        q = (round(x, 1), round(y, 1))
        if not res or res[-1] != q:
            res.append(q)
    if len(res) > 1 and res[0] == res[-1]:
        res.pop()
    return res

def area(pts):
    s = 0.0
    for i in range(len(pts)):
        x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % len(pts)]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2

def fmt(v):
    s = f"{v:.1f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s

def ring_path(pts):
    d = "M" + fmt(pts[0][0]) + " " + fmt(pts[0][1])
    px, py = pts[0]
    parts = []
    for x, y in pts[1:]:
        parts.append(fmt(round(x - px, 1)) + " " + fmt(round(y - py, 1)))
        px, py = x, y
    return d + "l" + " ".join(parts) + "z"

# ---- point in polygon (even-odd over every ring), used on raw lon/lat
def in_rings(x, y, rings):
    inside = False
    for ring in rings:
        n = len(ring)
        j = n - 1
        for i in range(n):
            xi, yi = ring[i]; xj, yj = ring[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
                inside = not inside
            j = i
    return inside

def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    L2 = dx * dx + dy * dy
    t = 0.0 if L2 == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / L2))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))

def label_point(rings):
    """pole of inaccessibility by iterative grid search over the largest polygon"""
    xs = [p[0] for r in rings for p in r]; ys = [p[1] for r in rings for p in r]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    def score(x, y):
        if not in_rings(x, y, rings):
            return -1
        best = 1e9
        for r in rings:
            for i in range(len(r)):
                a = r[i]; b = r[(i + 1) % len(r)]
                best = min(best, seg_dist(x, y, a[0], a[1], b[0], b[1]))
        return best
    best = (-1, (x0 + x1) / 2, (y0 + y1) / 2)
    n = 48
    for i in range(n + 1):
        for j in range(n + 1):
            x = x0 + (x1 - x0) * i / n; y = y0 + (y1 - y0) * j / n
            s = score(x, y)
            if s > best[0]:
                best = (s, x, y)
    stepx, stepy = (x1 - x0) / n, (y1 - y0) / n
    for _ in range(4):
        s0, cx, cy = best
        for i in range(-10, 11):
            for j in range(-10, 11):
                x = cx + stepx * i / 10; y = cy + stepy * j / 10
                s = score(x, y)
                if s > best[0]:
                    best = (s, x, y)
        stepx /= 3; stepy /= 3
    return best

provinces = []
total_in = total_out = 0
raw_by_id = {}
for ft in gj["features"]:
    pid = ft["properties"]["shapeISO"]
    raw_by_id[pid] = [r for poly in polys_of(ft["geometry"]) for r in poly]
    polys = []
    for poly in polys_of(ft["geometry"]):
        total_in += sum(len(r) for r in poly)
        outer = simplify_ring(poly[0])
        if len(outer) < 3 or area(outer) < MIN_AREA:
            continue
        holes = []
        for h in poly[1:]:
            hs = simplify_ring(h)
            if len(hs) >= 3 and area(hs) >= MIN_AREA:
                holes.append(hs)
        polys.append((outer, holes))
        total_out += len(outer) + sum(len(h) for h in holes)
    polys.sort(key=lambda p: -area(p[0]))
    d = "".join(ring_path(o) + "".join(ring_path(h) for h in hs) for o, hs in polys)
    main_outer, main_holes = polys[0]
    s, lx, ly = label_point([main_outer] + main_holes)
    bx = [p[0] for p in main_outer]; by = [p[1] for p in main_outer]
    provinces.append({
        "id": pid, "name": DISPLAY[pid], "d": d,
        "lx": round(lx, 1), "ly": round(ly, 1), "r": round(s, 1),
        "bw": round(max(bx) - min(bx), 1), "bh": round(max(by) - min(by), 1),
        "area": round(area(main_outer)),
    })

provinces.sort(key=lambda p: -p["area"])
for p in provinces:
    del p["area"]

# ---- sanity: every named city falls in the province we expect
bad = 0
for name, (lat, lon, want) in CITY_CHECK.items():
    got = [pid for pid, rings in raw_by_id.items() if in_rings(lon, lat, rings)]
    ok = got == [want]
    bad += 0 if ok else 1
    x, y = proj(lon, lat)
    print(f"{'OK ' if ok else 'BAD'} {name:15} expect {want} got {got}  -> ({x:.1f}, {y:.1f})")

geo = {
    "width": int(W), "height": H, "pad": int(PAD),
    "proj": {"xmin": round(xmin, 9), "ymax": round(ymax, 9), "k": round(K, 6)},
    "provinces": provinces,
}
js = (
    "/* Saudi Arabia province boundaries — generated by build_geo.py, do not hand-edit.\n"
    "   Source: OpenStreetMap contributors, via geoBoundaries (gbOpen SAU ADM1), ODbL 1.0.\n"
    "   Web-Mercator projected into a 1000-wide viewBox and simplified. */\n"
    "const GEO = " + json.dumps(geo, ensure_ascii=False, separators=(",", ":")) + ";\n\n"
    "/* real lon/lat -> map viewBox units (same projection the province paths use) */\n"
    "function projectLonLat(lon, lat){\n"
    "  const x = lon * Math.PI / 180;\n"
    "  const y = Math.asinh(Math.tan(lat * Math.PI / 180));\n"
    "  return {x: GEO.pad + (x - GEO.proj.xmin) * GEO.proj.k, y: GEO.pad + (GEO.proj.ymax - y) * GEO.proj.k};\n"
    "}\n"
)
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write(js)

print(f"\nvertices in {total_in} -> out {total_out}; geo.js {len(js)/1024:.0f} KB; viewBox 0 0 {int(W)} {H}")
print("mismatched cities:", bad)
for p in provinces:
    print(f'{p["id"]} {p["name"]:17} label=({p["lx"]},{p["ly"]}) inscribed r={p["r"]} bbox={p["bw"]}x{p["bh"]}')

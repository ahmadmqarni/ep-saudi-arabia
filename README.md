# EP Saudi Arabia

A personal directory of cardiac electrophysiologists in Saudi Arabia — an
overview page with charts (physicians per region, where they trained) and an
interactive map to browse by region, city, and center.

## Structure

```
index.html    page structure
style.css     all styling (light/dark theme tokens)
data.js       REGIONS / CITIES (real lat/lon) / CENTERS / PEOPLE, plus the photo filename map
geo.js        province boundaries for the map — generated, don't hand-edit
theme.js      dark mode toggle
gate.js       password gate
overview.js   overview page (stats + charts)
map.js        the map: provinces, city markers, zoom/pan, label placement
app.js        popover / detail panel / search / tabs
images/       physician photos
tools/        build_geo.py — regenerates geo.js from open boundary data
```

## The map

Province shapes are real boundaries from OpenStreetMap, via
[geoBoundaries](https://www.geoboundaries.org/) (`gbOpen`, Saudi Arabia ADM1,
ODbL 1.0), projected with Web Mercator and simplified for the web.
Cities are placed from their real latitude/longitude in `CITIES`, so adding a
city is just adding an entry with `lat` and `lon`. The map zooms and pans
(scroll, pinch, drag, or the +/− buttons); markers and labels stay the same
size on screen, and lower-priority labels hide when they would collide.

To rebuild `geo.js` (for example from a newer boundary release):

```bash
curl -L -o sau_adm1.geojson "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/SAU/ADM1/geoBoundaries-SAU-ADM1.geojson"
python tools/build_geo.py sau_adm1.geojson geo.js
```

Boundaries © OpenStreetMap contributors, used under the
[ODbL](https://opendatacommons.org/licenses/odbl/1-0/).

## Running locally

Photos and scripts load by relative path, so opening `index.html` directly
(double-click) won't work — browsers block that for local files. Serve the
folder instead:

```bash
python -m http.server 8000
```

then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → set the source to the `main` branch, `/` (root).
3. The site publishes at `https://<username>.github.io/<repo-name>/`.

No build step — it's plain HTML/CSS/JS.

## Updating the data

Edit `data.js`: `PEOPLE` for physicians, `CENTERS` for centers, `CITIES` for
the map's city list and coordinates. Add new photos to `images/` and
reference the exact filename in a person's `photo` field.

## A note on the password gate

The gate is a soft front-door deterrent, not real access control — the
password lives in plain JavaScript (`gate.js`), so anyone who opens
dev tools or views source can read it. It keeps the page from being an
obviously open link, nothing more. `robots.txt` and a `noindex` meta tag
keep it out of search engines, but on a public repo the URL itself is not
secret. Don't rely on this for data you actually need to keep private.

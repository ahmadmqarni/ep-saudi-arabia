# EP Saudi Arabia

A personal directory of cardiac electrophysiologists in Saudi Arabia — an
overview page with charts (physicians per region, where they trained) and an
interactive map to browse by region, city, and center.

## Structure

```
index.html    page structure
style.css     all styling (light/dark theme tokens)
data.js       REGIONS / CITIES / CENTERS / PEOPLE, plus the photo filename map
theme.js      dark mode toggle
gate.js       password gate
overview.js   overview page (stats + charts)
app.js        map rendering, popover/panel/search
images/       physician photos
```

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

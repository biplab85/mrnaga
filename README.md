# Mr Naga — Australia & New Zealand

Static marketing site for **Mr Naga**, the ghost pepper (naga / bhut jolokia) chilli
pickle, built for the official and exclusive distributors for Australia and New Zealand.

Two hand-written HTML pages, one shared stylesheet, and vanilla JavaScript. No build
step, no framework, no package manager — open the files and they run.

---

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Landing page: hero, marquee, trust strip, product range with filters, Original vs Gold comparison, brand story, ways-to-use grid, stockists CTA, FAQ accordion, newsletter signup |
| `stockists.html` | Store finder: dark page hero with stats, search + city tabs, 17 stockists grouped by city, empty state, "become a stockist" CTA |

Both pages share the same announcement bar, sticky header (centred badge logo,
currency switcher, mobile drawer) and footer.

## Layout

```
index.html                  landing page
stockists.html              store finder
reference.txt               design reference link
assets/
  css/
    style.css               design system + all landing-page components
    stockists.css           stockists-only patterns; extends style.css
  js/
    main.js                 header, menu, currency, filters, accordion, reveals,
                            marquee cloning, newsletter validation
    stockists.js            search + city filtering for the finder
  images/                   product shots, hero art, logo, icons (jpg/webp/png/svg)
mrnaga-hero.png             full-page screenshots kept for reference
mrnaga-full.png
```

`main.js` loads on both pages; `stockists.js` loads on the stockists page only.

---

## Running it

Any static server works. The project lives under a WAMP document root, so:

```
http://localhost/sklentr/mrnaga/index.html
```

Or serve the folder directly:

```bash
python -m http.server 8000
```

Opening `index.html` from the filesystem also works — all paths are relative — though
Google Fonts and the sticky-header behaviour are best checked over `http://`.

---

## Design system

Defined once as custom properties at the top of `assets/css/style.css`.

**Colour** — anchored on the brand red sampled from the logo badge.

| Token | Value | Use |
| --- | --- | --- |
| `--naga` | `#ED070A` | primary brand red |
| `--naga-deep` / `--naga-dark` | `#B00206` / `#7A0104` | hovers, gradients |
| `--brass` | `#E3A72C` | accents on dark grounds only |
| `--brass-text` | `#7A560C` | brass that stays legible on light grounds (4.5:1+) |
| `--ink` … `--cream` | warm neutrals | text, dark bands, page grounds |
| `--focus` | `#0A66FF` | focus ring, deliberately outside the brand palette |

**Type** — Fraunces (variable, `SOFT`/`WONK` axes) for the hero and section titles
only; Inter for everything else. Both from Google Fonts.

**Other tokens** — an 8pt spacing scale (`--s1`…`--s8`), `--wrap` (1440px), radii,
three shadow levels, and a shared `--ease` / `--dur` pair so every transition matches.

---

## Behaviour

All JavaScript is progressive enhancement — with JS disabled every section still
renders and reads correctly; only filtering and search go away.

`assets/js/main.js`

- **Sticky header** — `is-stuck` class past 8px of scroll, rAF-throttled, shrinks the logo
- **Mobile drawer** — `aria-expanded` toggle, closes on link click, Escape, or crossing into the ≥1024px layout
- **Currency menu** — AUD/NZD listbox, closes on outside click and Escape
- **Product filters** — tablist over `data-cat`, with roving arrow-key navigation and a live-region count
- **Accordions** — height-animated panels, instant when reduced motion is requested
- **Scroll reveals** — `IntersectionObserver`, staggered with a per-element `--d` delay; everything shows immediately if the observer is unavailable
- **Marquee** — clones its own children at runtime, because the CSS translates the track by exactly −50%
- **Newsletter** — validates on blur (not per keystroke), inline error, simulated submit. Front-end only; wire the `setTimeout` in the submit handler to a real Shopify/Klaviyo endpoint.

`assets/js/stockists.js`

- Debounced (140ms) search against each card's `data-search` string, which carries suburb, address, postcode and common misspellings
- City tabs (All / Sydney / Melbourne) with roving arrow keys
- City headings hide themselves once every card beneath them is filtered out
- Empty state with a "clear filters" reset; result count announced via `aria-live`

---

## Accessibility

Built in rather than bolted on:

- Skip link, landmark regions, and a single `h1` per page
- Visible 3px focus ring on every interactive element (`:focus-visible`)
- 44px minimum touch targets throughout
- Correct ARIA for the tablists, listbox, accordions and drawer; decorative SVGs are `aria-hidden` and `focusable="false"`
- Live regions for the product and stockist result counts
- Heat levels exposed as text (`role="img"` + label), not colour alone
- Full `prefers-reduced-motion` block in both stylesheets — animations, floats, glare sweeps and hover transforms all stand down
- Print styles that drop the chrome and keep stockist cards from breaking across pages

---

## Content notes

- **Products** — 8 items: Original, Gold, Original 2-pack, Gold 2-pack (on sale), Mixed 2-pack, Junior 70g, 4-jar mixed pack, and a tee. Prices are hard-coded in the markup.
- **Stockists** — 17 stores: 10 in Sydney (NSW), 7 in Melbourne (VIC). Bella Vista is flagged **New** and has no address yet. The three counts in the hero stats, the finder tabs and `stockistCount` are hard-coded — update them together when the list changes.
- **Directions links** — Google Maps search URLs opening in a new tab with `rel="noopener noreferrer"`.
- **Contact** — `sales@mrnaga.com.au` throughout.

## Adding a stockist

1. Copy an existing `<li class="stockist">` into the right `.stockists__group`.
2. Set `data-city` to `sydney` or `melbourne`.
3. Fill `data-search` with lowercase name, suburb, address, postcode and any likely misspellings — this string is the entire search index.
4. Point the Maps link at the URL-encoded address.
5. Bump the hard-coded counts: hero `.stat`, the `All` / city `.st-filter` badges, and the initial `#stockistCount` text.

---

## Browser support

Modern evergreen browsers. Uses CSS custom properties, `clamp()`, grid, `aspect-ratio`,
`clip-path`, `svh` units and `IntersectionObserver`. The JavaScript is ES5-style with
feature checks (including the `addEventListener`/`addListener` fallback for
`matchMedia`), so it degrades quietly rather than throwing.

## Author

**Biplab Paul**

- Mobile: 01735927356
- Email: <biplab.cse.85@gmail.com>

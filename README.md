# Cranfield Ultimate website

The Cranfield University Ultimate club site: playbook, throwing guides, defence, training, the drill library and fitness plans.

It's a plain static site (HTML, CSS and JavaScript, no build step), so it runs on GitHub Pages as-is.

## Publish on GitHub Pages

1. Create a new repository on GitHub, e.g. `cranfield-ultimate` (public, unless you have GitHub Pro).
2. Upload everything in this folder to the repository root, including the `img/` folder and the hidden `.nojekyll` file.
   - On the website: **Add file → Upload files**, drag the contents in, **Commit changes**.
   - Or with git: `git init`, `git add .`, `git commit -m "Cranfield Ultimate site"`, then push to the new repo.
3. In the repo go to **Settings → Pages**, set **Source** to *Deploy from a branch*, branch `main`, folder `/ (root)`, and **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/cranfield-ultimate/`.

## What's where

| File | Contents |
|---|---|
| `index.html` | Page shell, styles and menu |
| `app.js` | Navigation, search, video embeds, lightbox |
| `content.js` | All club pages (generated from the old Google Site) |
| `fitness.js` | Fitness section: Daily Bassline, Tiger/Grizzly/Raptor, Road to Lecco, shuttles, gym |
| `drills.js` | Drill library: filters, cards, drill pages and the diagram renderer |
| `drills_club.js` | The club's own drills |
| `drills_flik.js` | Free Flik drills, reworded and redrawn, with credits |
| `drills_ultiplays.js`, `drills_ultiplays2.js` | Free Ultiplays playbook drills, reworded and redrawn, with links |
| `drills_social.js` | Drills written up from Disc In videos, with links |
| `drills_extra.js` | Extra club drills and American football footwork drills adapted for ultimate |
| `img/` | Diagrams and photos |
| `kit/` | Kit design files (.ai) and their previews |

## Editing

- To change text, edit the relevant `.js` file; the content is HTML inside the strings.
- To add a drill, copy an entry in `drills_flik.js` (diagram format is documented at the top of that file) or `drills_club.js`.
- Pages are addressed by `#slug`, e.g. `…/#vert-stack`, `…/#drill-mini`.

YouTube videos play inside the page here (they show as links on the Claude-hosted preview).

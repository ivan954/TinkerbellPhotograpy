# Tinkerbell Studio

Website for Tinkerbell Studio, a children's and family photography studio in Modiin, Israel. The site is in Hebrew (right-to-left) and shows the studio's galleries, price lists and contact details. Texts, prices and photos can be edited from a password-protected admin screen.

**Live site:** https://tinkerbell-studio.com
**Admin screen:** https://tinkerbell-studio.com/admin

## Pages

| Page | Path |
|---|---|
| Home: hero, highlights, photography types, about, how it works, testimonials | `/` |
| Gallery: all categories | `/gallery` |
| Category gallery with a full-screen lightbox | `/imagescreen/<Category>` (e.g. `/imagescreen/NewBorn`) |
| Price list per category, plus extras (canvases, prints) | `/NewBornPrices`, `/PregnancyPrices`, ... |
| Contact form (EmailJS), phone, WhatsApp, Waze, opening hours and map | `/contact` |
| Admin screen | `/admin` |

## Tech stack

- **React 18** with Create React App, React Router and React Bootstrap (RTL build)
- **Supabase** (free plan): content database, admin login and photo storage
- **GitHub Pages** for hosting
- **EmailJS** for the contact form

## How content works

All texts, prices and photo lists live in JSON documents:

| Document | File | Contents |
|---|---|---|
| `home` | `src/data/components/screens/home.json` | Home page sections and their show/hide switches |
| `categories` | `src/data/components/categories.json` | Gallery categories: title, cover, photo list, visibility, order |
| `prices/<name>` | `src/data/components/prices/<name>.json` | Package names, prices, what each package includes, photos |
| `common` | `src/data/components/screens/common.json` | Logo, extras price tables, shared price-page texts |
| `contact` | `src/data/components/screens/contact.json` | Contact page texts, form labels, studio details |
| `header` | `src/data/components/screens/header.json` | Menu labels |
| `footer` | `src/data/components/screens/footer.json` | Social links, phone, email, floating WhatsApp button |

The JSON files are the defaults built into the site. When the admin saves a document, it is stored in the Supabase `site_content` table and overrides the built-in version. The site loads all saved documents in one request on startup. If Supabase doesn't answer within 3 seconds, it shows the last cached content or the built-in defaults, so the site keeps working.

Saved values are merged on top of the defaults, so a field added to a JSON file later still appears even if that document was saved before.

### Admin screen

The admin screen (`src/admin/`) is generated from the JSON documents, so a new field in a JSON file shows up there automatically. Hebrew field names and fields that are hidden or locked are set in `src/admin/fields.js`.

The admin can:

- edit any text or price
- show or hide home page sections and gallery categories
- replace photos or add several photos at once
- reorder, add and delete list items
- discard unsaved changes or restore a page to its built-in content
- change their password

Uploaded photos are resized in the browser to at most 1920px (JPEG, quality 82%) plus an 800px thumbnail, and their EXIF data (including GPS) is removed. Only the resized version is stored, so keep the originals elsewhere.

Adding a new gallery category is not possible from the admin screen yet, because it also needs a price list. It needs a new entry in `categories.json` and a new file in `src/data/components/prices/`.

### Photos

All photos live in the Supabase `site-images` bucket; none are stored in this repository. Add or replace them from the admin screen: each upload is resized in the browser to at most 1920px (EXIF data such as GPS is dropped) and gets an 800px-wide thumbnail at the same path under `thumbs/`.

The content stores a photo either as a full URL (uploads) or as a path inside the bucket (the built-in content, e.g. `bundled/Gallery/NewBorn/1.jpg`, the photos that used to ship with the site); `src/content/images.js` turns both into addresses.

## Local development

```bash
npm install
npm start
```

The site opens at http://localhost:3000.

Without a `.env` file the site runs on the built-in JSON content and the admin screen is disabled. To connect it to Supabase, copy `.env.example` to `.env` and fill in:

```
REACT_APP_SUPABASE_URL=https://<project>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<publishable or anon key>
```

Both values are public by design: they end up in the site's JavaScript, and what they allow is limited by the database policies. **Never put the secret / `service_role` key in `.env`.**

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the site locally |
| `npm run build` | Builds the production site into `build/` |
| `npm run deploy` | Builds and publishes to GitHub Pages (the `gh-pages` branch) |

## Deployment

```bash
npm run deploy
```

This builds the site, runs `scripts/prerender-routes.js` and pushes `build/` to the `gh-pages` branch. The prerender step writes an HTML file for every page (e.g. `gallery.html`, served at `/gallery`) with its own title, description and canonical link, so direct links return status 200 and Google sees each page properly; it also writes `sitemap.xml` and copies `index.html` to `404.html` for any other address. GitHub Pages must be set to deploy from that branch (repository Settings → Pages).

The Supabase values must be available when deploying, otherwise the published site won't connect to Supabase: either a local `.env` file (it is git-ignored, never commit it) or the `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` environment variables, which the build reads the same way.

The site is served at the custom domain `tinkerbell-studio.com` (registered at Cloudflare), set by `homepage` in `package.json` and `public/CNAME`. All internal links and image paths use `process.env.PUBLIC_URL`, so changing `homepage` (for example to a custom domain) is enough to move the site.

## Supabase setup

For a new Supabase project:

1. Create a project (a European region is closest to Israel).
2. In the **SQL Editor**, run `supabase/schema.sql`. It creates the `site_content` and `admins` tables, the access policies and the `site-images` bucket. It is safe to run again.
3. Under **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**.
4. Under **Authentication → Users**, add the admin user.
5. Make that user an admin in the SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'admin@example.com';
   ```
6. Copy the project URL and the publishable key into `.env`.

### Security

- Anyone can read the content and view the photos.
- Only users listed in the `admins` table can save content or upload photos. This is enforced by Row Level Security in the database, not by the site's code.
- Signing up is disabled, so new users can only be created from the Supabase dashboard.

### Keeping the free project awake

Free Supabase projects pause after a week without activity. The GitHub workflow `.github/workflows/supabase-keepalive.yml` reads the content once a day to prevent this. It needs two repository variables (Settings → Secrets and variables → Actions → Variables): `SUPABASE_URL` and `SUPABASE_ANON_KEY`, with the same values as in `.env`.

### Admin password

- **Known password:** log in and use **שינוי סיסמה** (change password) in the top bar.
- **Forgotten password:** run this in the Supabase SQL Editor, then delete the query from the editor:
  ```sql
  update auth.users
  set encrypted_password = extensions.crypt('new-password', extensions.gen_salt('bf'))
  where email = 'admin@example.com';
  ```

## Project structure

```
scripts/                prerender-routes.js (runs before deploy)
supabase/schema.sql     Database tables, policies and storage bucket
src/
  App.js                Routes (price pages are generated from the categories)
  content/              Loading content from Supabase, defaults, image URLs
  admin/                Admin screen, form editor, photo upload, password change
  data/components/      Built-in content (JSON)
  data/categories.js    Category helpers (gallery and price links, cover image)
  screens/              Home, gallery, category gallery, contact, 404
  components/           Header, footer, price page, carousel, lightbox, ...
.github/workflows/      Supabase keep-awake job
```

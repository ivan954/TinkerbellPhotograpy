// Runs after `npm run build` (see "predeploy" in package.json).
//
// The site is a single-page app, so GitHub Pages only knows index.html and
// answers every other address with 404.html (status 404). This writes a copy
// of the page for each route (e.g. build/gallery.html, which GitHub Pages
// serves at /gallery with status 200), each with its own title, description
// and canonical link, and a sitemap.xml listing them all for Google.
// The texts match what hooks/usePageTitle.js sets once the page has loaded.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const DATA = path.join(ROOT, "src", "data");
const SITE_NAME = "טינקרבל סטודיו";

const read = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
const seo = read("seo.json");
const categories = read("components/categories.json");
const about = read("components/screens/about.json");
const contact = read("components/screens/contact.json");
const home = read("components/screens/home.json");

const pageTitle = (title) => `${title} | ${SITE_NAME}`;

// The home page's large photo starts downloading with the HTML instead of
// after the app has loaded (same files Photo.js picks: WebP, small on phones).
const heroWebp = (folder) => home.hero.image.replace("/images/", folder).replace(/\.jpe?g$/i, ".webp");
const heroPreload = /^\/images\/(Carousel|About)\//.test(home.hero.image)
  ? `<link rel="preload" as="image" type="image/webp" fetchpriority="high" ` +
    `imagesrcset="${heroWebp("/images/thumbs/")} 800w, ${heroWebp("/images/")} 1920w" imagesizes="100vw">`
  : "";

const routes = [
  { path: "/", title: `${SITE_NAME} | צילומי ילדים ומשפחות במודיעין`, head: heroPreload },
  { path: "/gallery", title: pageTitle(categories.page.title), description: seo.gallery },
  { path: "/about", title: pageTitle(about.pageTitle), description: about.description },
  { path: "/contact", title: pageTitle(contact.page.title), description: seo.contact },
];

for (const category of categories.list.filter((item) => item.visible !== false)) {
  routes.push({
    path: `/imagescreen/${category.key}`,
    title: pageTitle(`צילומי ${category.title}`),
    description: seo.category.replace("{title}", category.title),
  });
  const prices = read(`components/prices/${category.prices}.json`);
  routes.push({
    path: category.pricesPath,
    title: pageTitle(prices.mainTitle),
    description: seo.prices.replace("{title}", prices.mainTitle),
  });
}

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const template = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`index.html has no tag matching ${pattern}`);
  return html.replace(pattern, replacement);
};

const render = ({ path: route, title, description, head = "" }) => {
  const url = `${seo.siteUrl}${route}`;
  let html = setTag(template, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
  html = setTag(html, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escape(title)}"`);
  html = setTag(html, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  html = setTag(html, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  if (description) {
    html = setTag(html, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${escape(description)}"`);
    html = setTag(
      html,
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${escape(description)}"`
    );
  }
  if (head) html = setTag(html, /<\/head>/, `${head}</head>`);
  return html;
};

for (const route of routes) {
  const file = route.path === "/" ? "index.html" : `${route.path.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(BUILD, file)), { recursive: true });
  fs.writeFileSync(path.join(BUILD, file), render(route));
}

// Unknown addresses (and old links) still open the app, which shows its own page.
fs.writeFileSync(path.join(BUILD, "404.html"), template);

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url><loc>${seo.siteUrl}${route.path}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(BUILD, "sitemap.xml"), sitemap);

console.log(`Prerendered ${routes.length} pages and sitemap.xml`);

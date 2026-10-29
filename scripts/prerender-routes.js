// Runs after `npm run build` (see "predeploy" in package.json).
//
// The site is a single-page app, so GitHub Pages only knows index.html and
// answers every other address with 404.html (status 404). This writes a copy
// of the page for each route (e.g. build/gallery.html, which GitHub Pages
// serves at /gallery with status 200), each with its own title, description
// and canonical link, and a sitemap.xml listing them all for Google.
// It also writes /llm-info/ with the studio's facts (src/data/llmInfo.js) as
// static HTML, for AI assistants that don't run JavaScript; llms.txt is a
// plain file in public/.
//
// The texts come from the live content when Supabase can be reached (the
// same rows the site loads), otherwise from the content bundled with the
// site; the titles match what hooks/usePageTitle.js sets once a page loads.

const fs = require("fs");
const path = require("path");
const { combineContent } = require("../src/content/merge");
const { pricesTitle, pricesDescription, formatPrice, fromPrice } = require("../src/data/pageText");
const llmInfo = require("../src/data/llmInfo");

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const DATA = path.join(ROOT, "src", "data");
const SITE_NAME = "טינקרבל סטודיו";
const FETCH_TIMEOUT_MS = 10000;

const read = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
const seo = read("seo.json");

// The same documents as src/content/defaults.js.
const readDefaults = () => {
  const screens = ["home", "about", "faq", "common", "contact", "header", "footer"];
  const defaults = Object.fromEntries(screens.map((key) => [key, read(`components/screens/${key}.json`)]));
  defaults.categories = read("components/categories.json");
  for (const file of fs.readdirSync(path.join(DATA, "components", "prices"))) {
    if (file.endsWith(".json") && file !== "config.json") {
      defaults[`prices/${file.replace(/\.json$/, "")}`] = read(`components/prices/${file}`);
    }
  }
  return defaults;
};

// REACT_APP_SUPABASE_* from the environment, or from .env like the build.
const supabaseSettings = () => {
  const settings = { url: process.env.REACT_APP_SUPABASE_URL, key: process.env.REACT_APP_SUPABASE_ANON_KEY };
  const envFile = path.join(ROOT, ".env");
  if ((!settings.url || !settings.key) && fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
      const match = line.match(/^\s*(REACT_APP_SUPABASE_URL|REACT_APP_SUPABASE_ANON_KEY)\s*=\s*(.*?)\s*$/);
      if (match && match[1].endsWith("URL")) settings.url = settings.url || match[2];
      if (match && match[1].endsWith("KEY")) settings.key = settings.key || match[2];
    }
  }
  return settings.url && settings.key ? { ...settings, url: settings.url.replace(/\/$/, "") } : null;
};

// Every document, with the saved rows on top when Supabase answers.
const loadContent = async () => {
  const defaults = readDefaults();
  const supabase = supabaseSettings();
  if (supabase) {
    try {
      const response = await fetch(`${supabase.url}/rest/v1/site_content?select=key,data`, {
        headers: { apikey: supabase.key },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const rows = Object.fromEntries((await response.json()).map((row) => [row.key, row.data]));
      return { content: combineContent(defaults, rows), live: true, supabase };
    } catch (error) {
      console.warn(`\n⚠️  Couldn't load the live content from Supabase (${error.message}).`);
    }
  } else {
    console.warn("\n⚠️  No Supabase settings (.env or REACT_APP_SUPABASE_*).");
  }
  console.warn(
    "   Using the content bundled with the site: page titles and descriptions may differ\n" +
      "   from the live site until it loads.\n"
  );
  return { content: combineContent(defaults, null), live: false, supabase };
};

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const setTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`index.html has no tag matching ${pattern}`);
  return html.replace(pattern, replacement);
};

const main = async () => {
  const { content, live, supabase } = await loadContent();
  const template = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");
  const pageTitle = (title) => `${title} | ${SITE_NAME}`;
  const categories = content.categories.list.filter((item) => item.visible !== false);
  const today = new Date().toISOString().slice(0, 10);

  // The home page's large photo starts downloading with the HTML instead of
  // after the app has loaded (the same files Photo.js picks: the 800px copy on
  // phones). Photos are in Supabase Storage.
  const bucket = supabase && `${supabase.url}/storage/v1/object/public/site-images`;
  const heroImage = content.home.hero.image;
  const heroUrl = (folder) => (/^https?:/.test(heroImage) ? heroImage.replace("/site-images/", `/site-images/${folder}`) : `${bucket}/${folder}${heroImage}`);
  const heroPreload =
    bucket && heroImage
      ? `<link rel="preload" as="image" fetchpriority="high" ` +
        `imagesrcset="${heroUrl("thumbs/")} 800w, ${heroUrl("")} 1920w" imagesizes="100vw">`
      : "";

  const lowest = categories
    .map((category) => content[`prices/${category.prices}`])
    .filter(Boolean)
    .map(fromPrice)
    .filter(Boolean);

  // `sitemap: false` for addresses that only lead elsewhere.
  const routes = [
    { path: "/", title: seo.homeTitle, head: heroPreload },
    {
      path: "/pricing",
      title: pageTitle(seo.pricingTitle),
      description: seo.pricing.replace(
        "{from}",
        lowest.length ? formatPrice(Math.min(...lowest)) : seo.priceRange.split("–")[0]
      ),
    },
    { path: "/gallery", title: pageTitle(content.categories.page.title), description: seo.gallery },
    { path: "/about", title: pageTitle(content.about.pageTitle), description: content.about.description },
    ...(content.faq.visible ? [{ path: "/faq", title: pageTitle(content.faq.title), description: seo.faq }] : []),
    { path: "/contact", title: pageTitle(content.contact.page.title), description: seo.contact },
  ];

  for (const category of categories) {
    routes.push({
      path: `/imagescreen/${category.key}`,
      title: pageTitle(`צילומי ${category.title}`),
      description: seo.category.replace("{title}", category.title),
    });
    const prices = content[`prices/${category.prices}`];
    if (prices) {
      routes.push({
        path: category.pricesPath,
        title: pageTitle(pricesTitle(category)),
        description: pricesDescription(category, prices),
      });
    }
  }

  // /packages is an old name for the price lists: the app sends it on to /pricing.
  routes.push({ ...routes[1], path: "/packages", canonical: "/pricing", sitemap: false });

  routes.push({
    path: "/llm-info/",
    title: pageTitle(seo.llmTitle),
    description: seo.llm,
    // Shown until the app replaces it, and to crawlers that don't run JavaScript.
    body: `<main class="llm-info-static">${llmInfo}</main>`,
  });

  const render = ({ path: route, title, description, head = "", canonical, body }) => {
    const url = `${seo.siteUrl}${canonical || route}`;
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
    if (body) html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
    return html;
  };

  for (const route of routes) {
    // "/llm-info/" -> llm-info/index.html; "/gallery" -> gallery.html (served at /gallery).
    const file =
      route.path === "/" ? "index.html" : route.path.endsWith("/") ? `${route.path.slice(1)}index.html` : `${route.path.slice(1)}.html`;
    fs.mkdirSync(path.dirname(path.join(BUILD, file)), { recursive: true });
    fs.writeFileSync(path.join(BUILD, file), render(route));
  }

  // Unknown addresses (and old links) still open the app, which shows its own page.
  fs.writeFileSync(path.join(BUILD, "404.html"), template);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((route) => route.sitemap !== false)
  .map((route) => `  <url><loc>${seo.siteUrl}${route.path}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(BUILD, "sitemap.xml"), sitemap);

  console.log(
    `Prerendered ${routes.length} pages and sitemap.xml from the ${live ? "live" : "bundled"} content`
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Texts built from the content (used by the site and by
// scripts/prerender-routes.js, so the static HTML and the loaded page match).
// CommonJS, so Node can require it too.
const seo = require("./seo.json");

// "ניובורן" -> "צילומי ניובורן"; "צילומי תדמית" stays as it is.
const serviceName = (category) =>
  category.title.startsWith("צילומי") ? category.title : `צילומי ${category.title}`;

// "1,550" -> 1550; anything without a number -> null.
const priceNumber = (text) => {
  const digits = String(text ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

const TIERS = ["basic", "extra", "premium"];

const filled = (text) => String(text ?? "").trim() !== "";

// The packages that are shown: those with a price or anything listed in them.
const visibleTiers = (prices) =>
  TIERS.filter(
    (tier) => filled(prices.prices?.[tier]) || (prices.features?.[tier] || []).some(filled)
  );

// The lowest package price of a price list, or null.
const fromPrice = (prices) => {
  const numbers = visibleTiers(prices)
    .map((tier) => priceNumber(prices.prices?.[tier]))
    .filter((value) => value !== null);
  return numbers.length ? Math.min(...numbers) : null;
};

const formatPrice = (value) => value.toLocaleString("en-US");

// The name used in messages: "חבילה פרימיום" -> "פרימיום", "חבילת כוכב קטן" -> "כוכב קטן".
const packageName = (title) => String(title || "").replace(/^חביל[הת]\s+/, "").trim();

const countText = (count) => (count === 1 ? "חבילה אחת" : `${count} חבילות`);

const pricesTitle = (category) => seo.pricesTitle.replace("{service}", serviceName(category));

const pricesDescription = (category, prices) => {
  const from = fromPrice(prices);
  return seo.prices
    .replace("{service}", serviceName(category))
    .replace("{count}", countText(visibleTiers(prices).length))
    .replace("{from}", from ? ` החל מ-${formatPrice(from)} ₪` : "");
};

module.exports = {
  serviceName,
  priceNumber,
  visibleTiers,
  fromPrice,
  formatPrice,
  packageName,
  pricesTitle,
  pricesDescription,
  filled,
};

// The content bundled with the site. Each document can be overridden by a row
// in the Supabase "site_content" table with the same key; anything missing
// there falls back to these files.
import home from "../data/components/screens/home.json";
import about from "../data/components/screens/about.json";
import header from "../data/components/screens/header.json";
import footer from "../data/components/screens/footer.json";
import contact from "../data/components/screens/contact.json";
import common from "../data/components/screens/common.json";
import categories from "../data/components/categories.json";

const priceFiles = require.context("../data/components/prices", false, /\.json$/);

const prices = Object.fromEntries(
  priceFiles
    .keys()
    .filter((file) => !file.endsWith("config.json"))
    .map((file) => [`prices/${file.replace(/^\.\/|\.json$/g, "")}`, priceFiles(file)])
);

const defaults = {
  home,
  about,
  categories,
  ...prices,
  common,
  contact,
  header,
  footer,
};

export default defaults;

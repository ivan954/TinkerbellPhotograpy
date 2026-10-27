// How the admin editor shows each field of the content documents. The editor
// is generated from the JSON itself, so new fields appear automatically; this
// file only gives them Hebrew names and marks special ones.

const LABELS = {
  // General
  title: "כותרת",
  text: "טקסט",
  eyebrow: "כותרת קטנה (מעל הכותרת)",
  subtitle: "תת-כותרת",
  visible: "מוצג באתר",
  items: "פריטים",
  images: "תמונות",
  image: "תמונה",
  imageAlt: "תיאור התמונה",
  path: "תמונה",
  alt: "תיאור התמונה (לנגישות)",
  cover: "תמונת שער",
  label: "טקסט",
  message: "הודעה",
  // Home
  hero: "אזור הפתיחה",
  carousel: "תמונות הרקע המתחלפות",
  interval: "זמן בין תמונות (באלפיות שנייה)",
  highlights: "יתרונות",
  services: "סוגי צילומים",
  about: "קצת עליי",
  steps: "איך זה עובד",
  testimonials: "המלצות",
  quotes: "המלצות כתובות",
  faq: "שאלות נפוצות",
  askText: "טקסט מתחת לשאלות",
  askButton: "טקסט כפתור השאלה",
  askMessage: "ההודעה שנפתחת בוואטסאפ",
  question: "שאלה",
  answer: "תשובה",
  trust: "שורת אמון",
  comingSoon: "כרטיס \"תמונות חדשות בדרך\"",
  moreButton: "טקסט הקישור לעמוד המלא",
  story: "הסיפור שלי",
  pageTitle: "כותרת העמוד",
  description: "תיאור לגוגל (משפט או שניים)",
  cta: "קריאה לפעולה (סוף העמוד)",
  whatsappButton: "טקסט כפתור הוואטסאפ",
  whatsappMessage: "ההודעה שנפתחת בוואטסאפ",
  galleryButton: "טקסט כפתור הגלריה",
  contactButton: "טקסט כפתור יצירת קשר",
  formButton: "טקסט כפתור הטופס",
  priceLink: "טקסט הקישור למחירון",
  // Categories
  page: "עמוד הגלריה",
  list: "קטגוריות",
  // Prices
  mainTitle: "כותרת המחירון",
  packageTitles: "שמות החבילות",
  prices: "מחירים (₪)",
  features: "מה כלול בכל חבילה",
  premium: "פרימיום",
  extra: "אקסטרה",
  basic: "בסיסית",
  additionalInfo: "הערה מתחת לחבילות",
  // Common
  logo: "לוגו",
  pricesPage: "טקסטים בעמודי המחירון",
  intro: "טקסט פתיחה",
  galleryLink: "טקסט הקישור לגלריה",
  featuredBadge: "תווית החבילה המומלצת",
  orderButton: "טקסט כפתור ההזמנה",
  extrasEyebrow: "כותרת קטנה לתוספות",
  extras: "תוספות",
  tables: "טבלאות מחירים",
  headers: "כותרות הטבלאות",
  canvas: "קנבסים",
  kapa: "קאפות",
  size: "גודל",
  price: "מחיר",
  // Contact
  form: "טופס יצירת קשר",
  fields: "שמות השדות",
  name: "שם",
  email: "מייל",
  phone: "טלפון",
  type: "סוג הצילום",
  buttons: "כפתורים",
  submit: "כפתור שליחה",
  messages: "הודעות",
  success: "כותרת אחרי שליחה",
  successText: "טקסט אחרי שליחה",
  messagePlaceholder: "טקסט לדוגמה בשדה ההודעה",
  whatsapp: "וואטסאפ",
  button: "טקסט הכפתור",
  info: "פרטי הסטודיו",
  studio: "הסטודיו",
  photographer: "שם הצלמת וטלפון",
  address: "כתובת",
  street: "רחוב",
  city: "עיר",
  businessHours: "שעות פעילות",
  weekdays: "ימים א'-ה'",
  friday: "יום שישי",
  saturday: "שבת",
  // Header / footer
  aboutPage: "עליי",
  navigation: "תפריט",
  links: "שמות הקישורים",
  home: "בית",
  gallery: "גלריה",
  contact: "צור קשר",
  pricesDropdown: "מחירונים",
  book: "כפתור תיאום צילום",
  copyright: "שורת זכויות יוצרים",
  floatingWhatsapp: "כפתור וואטסאפ צף",
  social: "רשתות ופרטי קשר",
  url: "קישור",
  number: "מספר (בפורמט בינלאומי)",
  display: "מספר להצגה",
  instagram: "אינסטגרם",
  facebook: "פייסבוק",
  waze: "Waze",
};

// Technical fields the site depends on; editing them could break pages.
const HIDDEN = [
  "contact:form.emailjs",
  "footer:social.*.order",
  "common:message",
  "categories:list.*.key",
  "categories:list.*.prices",
  "categories:list.*.pricesPath",
  // Replaced by the single hero image; older saved content may still have it.
  "home:carousel",
];

// The shape of a new item for lists that can start out empty, so "add" knows
// which fields to create.
const LIST_TEMPLATES = {
  "home:testimonials.quotes": { text: "", name: "", city: "", visible: true },
  "home:faq.items": { question: "", answer: "" },
  "home:testimonials.images": { path: "", alt: "" },
};

// Lists whose items can be reordered and hidden but not added or removed
// (a new category also needs its own price page).
const FIXED_LISTS = ["categories:list"];

const IMAGE_KEYS = ["path", "image", "cover"];
const MULTILINE_KEYS = [
  "text",
  "subtitle",
  "additionalInfo",
  "about",
  "intro",
  "successText",
  "story",
  "answer",
  "description",
];

// "list.3.title" -> "list.*.title", so patterns don't depend on positions.
const pattern = (docKey, path) =>
  `${docKey}:${path.map((part) => (typeof part === "number" ? "*" : part)).join(".")}`;

const matches = (rules, docKey, path) => {
  const current = pattern(docKey, path);
  return rules.some((rule) => current === rule || current.startsWith(`${rule}.`));
};

export const isHidden = (docKey, path) => matches(HIDDEN, docKey, path);

export const listTemplate = (docKey, path) => LIST_TEMPLATES[pattern(docKey, path)];

// Only the list itself is fixed; lists inside its items (a category's photos) are not.
export const isFixedList = (docKey, path) => FIXED_LISTS.includes(pattern(docKey, path));

const lastKey = (path) => [...path].reverse().find((part) => typeof part === "string");

export const fieldLabel = (path) => {
  const key = path[path.length - 1];
  if (typeof key === "number") return `${key + 1}`;
  return LABELS[key] || key;
};

// A string is an image when it sits under an image key, or inside "images"
// (a list of photos, or the per-package images of a price list).
export const isImageField = (path) => {
  const key = path[path.length - 1];
  if (IMAGE_KEYS.includes(key)) return true;
  const parent = typeof key === "number" ? lastKey(path) : path[path.length - 2];
  return parent === "images";
};

export const isMultiline = (path, value) =>
  MULTILINE_KEYS.includes(path[path.length - 1]) || String(value).length > 70;

// The title shown for an item in a list, e.g. a category's name.
export const itemTitle = (item, index) => {
  if (item && typeof item === "object") {
    return item.title || item.question || item.name || item.size || item.alt || `פריט ${index + 1}`;
  }
  return `${index + 1}`;
};

// Empty copy of an existing item, used when adding to a list.
export const emptyLike = (value) => {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, emptyLike(inner)]));
  }
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return 0;
  return "";
};

// The documents in the admin menu, in this order. `description` says what the
// page controls; `path` is where to see it on the site.
export const documentList = (categories) => [
  {
    key: "home",
    title: "דף הבית",
    description: "אזור הפתיחה, היתרונות, סוגי הצילומים, ההמלצות והקריאה לפעולה, וגם השאלות שבעמוד \"שאלות נפוצות\".",
    path: "/",
  },
  {
    key: "about",
    title: "עמוד עליי",
    description: "הסיפור שלך והתמונה בעמוד \"עליי\".",
    path: "/about",
  },
  {
    key: "categories",
    title: "גלריות ותמונות",
    description: "הקטגוריות בגלריה: תמונת השער, כל התמונות, הסדר והאם הן מוצגות.",
    path: "/gallery",
  },
  ...categories.list.map((category) => ({
    key: `prices/${category.prices}`,
    title: `מחירון ${category.title}`,
    description: "שמות החבילות, המחירים ומה כלול בכל חבילה.",
    path: category.pricesPath,
    group: "מחירונים",
  })),
  {
    key: "common",
    title: "תוספות, לוגו וטקסטים משותפים",
    description: "הלוגו, שורת האמון, הטקסטים שחוזרים בכל עמודי המחירון וטבלאות התוספות.",
  },
  {
    key: "contact",
    title: "צור קשר",
    description: "טופס יצירת הקשר, פרטי הסטודיו ושעות הפעילות.",
    path: "/contact",
  },
  {
    key: "header",
    title: "תפריט עליון",
    description: "שמות הקישורים בתפריט וכפתור תיאום הצילום.",
    path: "/",
  },
  {
    key: "footer",
    title: "פרטי קשר ותחתית",
    description: "רשתות חברתיות, טלפון, וואטסאפ ושורת זכויות היוצרים.",
    path: "/",
  },
];

// How saved content (Supabase rows) combines with the defaults bundled with
// the site. CommonJS, so scripts/prerender-routes.js can use it too.

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Saved values win; fields that exist only in the bundled defaults (e.g. ones
// added to the site later) are kept. Arrays are replaced as a whole.
const mergeContent = (base, saved) => {
  if (saved === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(saved)) return saved;
  const merged = { ...base };
  for (const [key, value] of Object.entries(saved)) {
    merged[key] = mergeContent(base[key], value);
  }
  return merged;
};

// Content that moved to a document of its own: the FAQ used to be saved as
// part of "home". Until the new document is saved for the first time, the
// questions already saved with the home page are used, so no edits are lost.
const MOVED = {
  faq: { from: "home", field: "faq" },
};

const withMovedContent = (rows) => {
  if (!rows) return rows;
  const result = { ...rows };
  for (const [key, { from, field }] of Object.entries(MOVED)) {
    if (result[key] === undefined && result[from]?.[field] !== undefined) {
      result[key] = result[from][field];
    }
  }
  return result;
};

// Every document: its default with the saved row (if any) on top.
const combineContent = (defaults, savedRows) => {
  const rows = withMovedContent(savedRows);
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, mergeContent(value, rows?.[key])])
  );
};

module.exports = { mergeContent, MOVED, withMovedContent, combineContent };

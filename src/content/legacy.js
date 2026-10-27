// Content that moved to a document of its own: the FAQ used to be saved as
// part of "home". Until the new document is saved for the first time, the
// questions already saved with the home page are used, so no edits are lost.
export const MOVED = {
  faq: { from: "home", field: "faq" },
};

export const withMovedContent = (rows) => {
  if (!rows) return rows;
  const result = { ...rows };
  for (const [key, { from, field }] of Object.entries(MOVED)) {
    if (result[key] === undefined && result[from]?.[field] !== undefined) {
      result[key] = result[from][field];
    }
  }
  return result;
};

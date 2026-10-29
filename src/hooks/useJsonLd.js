import { useEffect } from "react";

// Structured data for Google (schema.org JSON-LD) built from the live content.
// A <script> with this id is created or replaced in <head>; index.html ships a
// static version of the business details with the same id, which this
// updates once the content has loaded. Removed again on unmount, unless
// `keep` (the business details stay on every page).
const useJsonLd = (id, data, { keep = false } = {}) => {
  const json = data ? JSON.stringify(data) : "";
  useEffect(() => {
    if (!json) return undefined;
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = json;
    return keep ? undefined : () => script.remove();
  }, [id, json, keep]);
};

export default useJsonLd;

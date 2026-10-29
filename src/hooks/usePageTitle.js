import { useEffect } from "react";
import seo from "../data/seo.json";

const SITE_NAME = "טינקרבל סטודיו";
export const DEFAULT_DESCRIPTION =
  "טינקרבל סטודיו במודיעין: צילומי ניובורן, הריון, גיל שנה, ילדים ומשפחות בסטים מעוצבים ובאווירה רגועה. כאן הרגעים הקטנים הופכים לאגדה.";

const setMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

// Sets the tab title and the description, social preview and canonical link
// Google and WhatsApp read. scripts/prerender-routes.js writes the same values
// into the HTML of each page, for crawlers that don't run JavaScript.
const usePageTitle = (title, description = DEFAULT_DESCRIPTION) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : seo.homeTitle;
    const url = `${window.location.origin}${window.location.pathname}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('link[rel="canonical"]', "href", url);
  }, [title, description]);
};

export default usePageTitle;

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import defaults from "./defaults";
import { withMovedContent } from "./legacy";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";
import Loader from "../components/Loader";

const CACHE_KEY = "site-content";
// How long the first render waits for Supabase before falling back.
const FETCH_TIMEOUT_MS = 3000;

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Saved values win; fields that exist only in the bundled defaults (e.g. ones
// added to the site later) are kept. Arrays are replaced as a whole.
export const mergeContent = (base, saved) => {
  if (saved === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(saved)) return saved;
  const merged = { ...base };
  for (const [key, value] of Object.entries(saved)) {
    merged[key] = mergeContent(base[key], value);
  }
  return merged;
};

export const buildContent = (savedRows) => {
  const rows = withMovedContent(savedRows);
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, mergeContent(value, rows?.[key])])
  );
};

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};

const writeCache = (rows) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
  } catch {
    // Storage can be full or blocked; the cache is only a fallback.
  }
};

const fetchRows = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=key,data`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    const rows = await response.json();
    return Object.fromEntries(rows.map((row) => [row.key, row.data]));
  } finally {
    clearTimeout(timer);
  }
};

// What the last visit saw, so returning visitors get the page right away
// while the latest content loads in the background.
const cachedRows = isSupabaseConfigured ? readCache() : null;

// Started as soon as the bundle loads, in parallel with React's first render.
// Resolves to null when nothing newer than the cache is available.
const latestRows = isSupabaseConfigured
  ? fetchRows().then(
      (rows) => {
        writeCache(rows);
        return rows;
      },
      (error) => {
        console.warn("Using cached/bundled content:", error.message);
        return cachedRows ? null : readCache();
      }
    )
  : Promise.resolve(null);

const ContentContext = createContext({ content: buildContent(null), setDocument: () => {} });

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() =>
    !isSupabaseConfigured || cachedRows ? buildContent(cachedRows) : null
  );

  useEffect(() => {
    latestRows.then((rows) => {
      if (rows || !cachedRows) setContent(buildContent(rows));
    });
  }, []);

  // Lets the admin screen show a saved change on the site without a reload.
  const setDocument = useCallback((key, data) => {
    setContent((current) => ({ ...current, [key]: mergeContent(defaults[key], data) }));
  }, []);

  if (!content) return <Loader />;

  return (
    <ContentContext.Provider value={{ content, setDocument }}>{children}</ContentContext.Provider>
  );
};

export const useContent = (key) => useContext(ContentContext).content[key];

export const useSetDocument = () => useContext(ContentContext).setDocument;

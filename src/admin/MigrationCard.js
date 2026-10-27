import React, { useMemo, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { BsCloudArrowUp, BsCheckCircle, BsExclamationTriangle } from "react-icons/bs";
import supabase from "./supabaseClient";
import { findBundledPaths, migrateImages } from "./migrateImages";

// Shown while the content still uses photos stored inside the site's code.
// One click moves them all to Supabase and saves the content with the new
// addresses; afterwards the card disappears.
const MigrationCard = ({ saved, hasUnsavedChanges, onMigrated }) => {
  const count = useMemo(() => findBundledPaths(saved).size, [saved]);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);

  if (!count && !result) return null;

  const run = async () => {
    setResult(null);
    setProgress({ done: 0, total: count });
    try {
      const { changed, failed, uploaded } = await migrateImages(saved, (done, total) =>
        setProgress({ done, total })
      );
      const rows = Object.entries(changed).map(([key, data]) => ({ key, data }));
      if (rows.length) {
        const { error } = await supabase.from("site_content").upsert(rows);
        if (error) throw new Error(`שמירת התוכן נכשלה: ${error.message}`);
        onMigrated(changed);
      }
      setResult({ uploaded, failed });
    } catch (error) {
      setResult({ uploaded: 0, failed: [], error: error.message });
    }
    setProgress(null);
  };

  const finished = result && !result.error && !result.failed.length;

  return (
    <div className={`admin-migration ${finished ? "is-done" : ""}`}>
      {finished ? (
        <p className="admin-migration-title">
          <BsCheckCircle /> כל {result.uploaded} התמונות הועברו ל-Supabase, והתוכן נשמר עם הכתובות החדשות.
        </p>
      ) : (
        <>
          <p className="admin-migration-title">
            <BsCloudArrowUp /> {count} תמונות עדיין שמורות בתוך קוד האתר
          </p>
          <p>
            לחיצה אחת מעבירה את כולן ל-Supabase, מוקטנות כמו תמונה שמעלים כאן, ושומרת את כל העמודים עם
            הכתובות החדשות. זה לוקח כמה דקות; אפשר להריץ שוב אם משהו נעצר באמצע.
          </p>
          {hasUnsavedChanges && <p className="admin-error">יש שינויים שלא נשמרו. כדאי לשמור אותם קודם.</p>}
          {progress ? (
            <ProgressBar
              now={(progress.done / progress.total) * 100}
              label={`${progress.done} / ${progress.total}`}
              animated
            />
          ) : (
            <button type="button" className="btn-brand" onClick={run} disabled={hasUnsavedChanges}>
              <BsCloudArrowUp /> העברת התמונות ל-Supabase
            </button>
          )}
        </>
      )}
      {result?.error && (
        <p className="admin-error">
          <BsExclamationTriangle /> {result.error}
        </p>
      )}
      {result?.failed.length > 0 && (
        <div className="admin-error">
          <BsExclamationTriangle /> {result.failed.length} תמונות לא הועברו (אפשר ללחוץ שוב):
          <ul>
            {result.failed.slice(0, 10).map((item) => (
              <li key={item.path} dir="ltr">
                {item.path}: {item.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MigrationCard;

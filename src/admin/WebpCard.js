import React, { useEffect, useRef, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { BsLightningCharge, BsCheckCircle, BsExclamationTriangle } from "react-icons/bs";
import { canWriteWebp } from "./uploadImage";
import { createWebpCopies, findMissingWebp } from "./webpCopies";

// Shown when some photos have no WebP copies yet (photos uploaded before
// they existed, or from a browser that can't write WebP, such as Safari).
// The site works without them, only slower on phones.
const WebpCard = ({ saved }) => {
  const [missing, setMissing] = useState(null);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  // Checked once when the admin screen opens; new uploads get their copies right away.
  const initial = useRef(saved).current;

  useEffect(() => {
    let current = true;
    findMissingWebp(initial).then((paths) => current && setMissing(paths));
    return () => {
      current = false;
    };
  }, [initial]);

  if (!missing || (!missing.length && !result)) return null;

  const run = async () => {
    setResult(null);
    setProgress({ done: 0, total: missing.length });
    const failed = await createWebpCopies(missing, (done, total) => setProgress({ done, total }));
    setProgress(null);
    setResult({ made: missing.length - failed.length, failed });
    setMissing(failed.map((item) => item.path));
  };

  if (result && !result.failed.length) {
    return (
      <div className="admin-notice is-done">
        <p className="admin-notice-title">
          <BsCheckCircle /> נוצרו גרסאות WebP ל-{result.made} תמונות. האתר ייטען מהר יותר בטלפון.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-notice">
      <p className="admin-notice-title">
        <BsLightningCharge /> ל-{missing.length} תמונות עדיין אין גרסת WebP קלה
      </p>
      <p>
        האתר עובד גם בלעדיהן, אבל בטלפון הוא נטען לאט יותר. לחיצה אחת יוצרת לכל תמונה גרסאות WebP בשלושה
        גדלים. זה לוקח כמה דקות; אפשר להריץ שוב אם משהו נעצר באמצע.
      </p>
      {!canWriteWebp() ? (
        <p className="admin-error">הדפדפן הזה (למשל Safari) לא יודע ליצור WebP. יש לפתוח את הניהול ב-Chrome במחשב.</p>
      ) : progress ? (
        <ProgressBar now={(progress.done / progress.total) * 100} label={`${progress.done} / ${progress.total}`} animated />
      ) : (
        <button type="button" className="btn-brand" onClick={run}>
          <BsLightningCharge /> יצירת גרסאות WebP
        </button>
      )}
      {result?.failed.length > 0 && (
        <div className="admin-error">
          <BsExclamationTriangle /> {result.failed.length} תמונות לא עובדו (אפשר ללחוץ שוב):
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

export default WebpCard;

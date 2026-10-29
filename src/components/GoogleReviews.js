import React from "react";
import { BsStarFill, BsStarHalf, BsStar, BsGoogle } from "react-icons/bs";
import { useContent } from "../content/ContentProvider";
import "./GoogleReviews.css";

// Five stars for a rating such as "4.8", in steps of half a star.
const Stars = ({ rating }) => {
  const halves = Math.round(Math.min(5, Math.max(0, rating)) * 2);
  return (
    // Left to right like on Google, so a half star fills from the left.
    <span className="google-stars" dir="ltr" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const left = halves - index * 2;
        if (left >= 2) return <BsStarFill key={index} />;
        if (left === 1) return <BsStarHalf key={index} />;
        return <BsStar key={index} />;
      })}
    </span>
  );
};

// "See our reviews on Google", with the rating entered in the admin screen.
// Shown once the Google business profile link is set (footer → social).
const GoogleReviews = ({ className = "" }) => {
  const { googleReviews } = useContent("common");
  const { social } = useContent("footer");
  const url = social.google?.url;
  if (!googleReviews.visible || !url) return null;

  const rating = Number(String(googleReviews.rating).replace(",", "."));
  const hasRating = rating > 0 && rating <= 5;
  const count = String(googleReviews.count || "").trim();
  const summary = [hasRating && `דירוג ${rating.toFixed(1)} מתוך 5`, count && `${count} ביקורות`]
    .filter(Boolean)
    .join(", ");

  return (
    <a
      className={`google-reviews ${className}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={summary ? `${googleReviews.label} (${summary})` : googleReviews.label}
    >
      <BsGoogle className="google-reviews-logo" aria-hidden="true" />
      <span className="google-reviews-text">
        <strong>{googleReviews.label}</strong>
        {(hasRating || count) && (
          <span className="google-reviews-rating">
            {hasRating && (
              <>
                <span dir="ltr">{rating.toFixed(1)}</span> <Stars rating={rating} />
              </>
            )}
            {count && <span className="google-reviews-count">({count} ביקורות)</span>}
          </span>
        )}
      </span>
    </a>
  );
};

export default GoogleReviews;

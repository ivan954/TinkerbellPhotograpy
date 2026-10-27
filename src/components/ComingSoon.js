import React from "react";
import { BsStars } from "react-icons/bs";
import { useContent } from "../content/ContentProvider";
import "./ComingSoon.css";

// Shown where photos would be, while a gallery or package has none yet.
const ComingSoon = ({ compact = false, className = "" }) => {
  const { comingSoon } = useContent("common");

  return (
    <div className={`coming-soon ${compact ? "is-compact" : ""} ${className}`}>
      <BsStars className="coming-soon-icon" aria-hidden="true" />
      <strong>{comingSoon.title}</strong>
      {!compact && comingSoon.text && <span>{comingSoon.text}</span>}
    </div>
  );
};

export default ComingSoon;

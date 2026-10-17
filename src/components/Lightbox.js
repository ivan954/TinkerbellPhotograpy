import React, { useCallback, useEffect, useRef } from "react";
import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";
import "./Lightbox.css";

const SWIPE_DISTANCE = 50;

// Full-screen photo viewer: arrows, keyboard and swipe navigation.
// The site is right-to-left, so "next" sits on the left.
const Lightbox = ({ images, index, onClose, onChange }) => {
  const closeRef = useRef(null);
  const touchStartX = useRef(null);
  const count = images.length;

  const showNext = useCallback(() => onChange((index + 1) % count), [index, count, onChange]);
  const showPrevious = useCallback(
    () => onChange((index - 1 + count) % count),
    [index, count, onChange]
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showNext();
      if (event.key === "ArrowRight") showPrevious();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, showNext, showPrevious]);

  // Lock the page behind the viewer and give the close button focus.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  // Preload the neighbouring photos so the arrows switch instantly.
  useEffect(() => {
    if (count < 2) return;
    [index - 1, index + 1].forEach((i) => {
      new window.Image().src = images[(i + count) % count].path;
    });
  }, [index, count, images]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (distance > SWIPE_DISTANCE) showNext();
    if (distance < -SWIPE_DISTANCE) showPrevious();
  };

  const image = images[index];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="צפייה בתמונה"
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lightbox-toolbar">
        <span className="lightbox-counter" dir="ltr">
          {index + 1} / {count}
        </span>
        <button ref={closeRef} className="lightbox-button" onClick={onClose} aria-label="סגירה">
          <BsX />
        </button>
      </div>

      <img key={image.path} className="lightbox-image" src={image.path} alt={image.alt} />

      {count > 1 && (
        <>
          <button
            className="lightbox-button lightbox-nav lightbox-prev"
            onClick={showPrevious}
            aria-label="התמונה הקודמת"
          >
            <BsChevronRight />
          </button>
          <button
            className="lightbox-button lightbox-nav lightbox-next"
            onClick={showNext}
            aria-label="התמונה הבאה"
          >
            <BsChevronLeft />
          </button>
        </>
      )}
    </div>
  );
};

export default Lightbox;

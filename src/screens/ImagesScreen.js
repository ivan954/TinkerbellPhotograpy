import React, { useCallback, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BsWhatsapp } from "react-icons/bs";
import Message from "../components/Message";
import Lightbox from "../components/Lightbox";
import categories, { findCategory } from "../data/categories";
import galleryManifest from "../data/galleryManifest.json";
import { whatsappLink } from "../data/whatsapp";
import usePageTitle from "../hooks/usePageTitle";
import "./ImagesScreen.css";

const ImagesScreen = () => {
  const { name } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const category = findCategory((item) => item.key.toLowerCase() === name?.toLowerCase());
  usePageTitle(category ? `גלריית ${category.title}` : "גלריה");

  const images = useMemo(
    () =>
      category
        ? (galleryManifest[category.key] || []).map((index) => ({
            path: `${process.env.PUBLIC_URL}/images/Gallery/${category.key}/${index}.jpg`,
            thumb: `${process.env.PUBLIC_URL}/images/thumbs/Gallery/${category.key}/${index}.jpg`,
            alt: `צילומי ${category.title} - תמונה ${index}`,
          }))
        : [],
    [category]
  );

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  if (!category) {
    return (
      <Container className="py-5 text-center">
        <Message variant="warning">הגלריה המבוקשת לא נמצאה</Message>
        <Link to="/gallery" className="btn-brand">
          חזרה לגלריה
        </Link>
      </Container>
    );
  }

  const otherCategories = categories.filter((item) => item.key !== category.key);

  return (
    <Container className="images-page">
      <header className="page-hero">
        <nav className="breadcrumbs" aria-label="ניווט">
          <Link to="/">בית</Link> / <Link to="/gallery">גלריה</Link> / {category.title}
        </nav>
        <h1>צילומי {category.title}</h1>
        <div className="images-actions">
          <Link to={category.pricesPath} className="btn-brand">
            למחירון {category.title}
          </Link>
          <a
            className="btn-outline-brand"
            href={whatsappLink(`היי, אשמח לפרטים על צילומי ${category.title}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsWhatsapp /> לפרטים בוואטסאפ
          </a>
        </div>
      </header>

      <div className="masonry">
        {images.map((image, index) => (
          <button
            key={image.path}
            className="masonry-item"
            onClick={() => setSelectedIndex(index)}
            aria-label={`הגדלת ${image.alt}`}
          >
            <img src={image.thumb} alt={image.alt} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>

      <nav className="other-categories" aria-label="גלריות נוספות">
        <h2>גלריות נוספות</h2>
        <div className="category-chips">
          {otherCategories.map((item) => (
            <Link key={item.key} to={`/imagescreen/${item.key}`} className="category-chip">
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      {selectedIndex !== null && (
        <Lightbox
          images={images}
          index={selectedIndex}
          onClose={closeLightbox}
          onChange={setSelectedIndex}
        />
      )}
    </Container>
  );
};

export default ImagesScreen;

import React, { useCallback, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BsWhatsapp } from "react-icons/bs";
import Message from "../components/Message";
import Lightbox from "../components/Lightbox";
import Photo from "../components/Photo";
import ComingSoon from "../components/ComingSoon";
import { useCategories } from "../data/categories";
import { useWhatsappLink } from "../data/whatsapp";
import { imageUrl, thumbUrl } from "../content/images";
import usePageTitle from "../hooks/usePageTitle";
import seo from "../data/seo.json";
import "./ImagesScreen.css";

const ImagesScreen = () => {
  const { name } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const categories = useCategories();
  const whatsappLink = useWhatsappLink();

  const category = categories.find((item) => item.key.toLowerCase() === name?.toLowerCase());
  usePageTitle(
    category ? `צילומי ${category.title}` : "גלריה",
    category ? seo.category.replace("{title}", category.title) : seo.gallery
  );

  const images = useMemo(
    () =>
      category
        ? category.images.map((path, index) => ({
            path: imageUrl(path),
            thumb: thumbUrl(path),
            alt: `צילומי ${category.title} - תמונה ${index + 1}`,
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

      {!images.length && <ComingSoon className="images-coming-soon" />}

      <div className="masonry">
        {images.map((image, index) => (
          <button
            key={index}
            className="masonry-item"
            onClick={() => setSelectedIndex(index)}
            aria-label={`הגדלת ${image.alt}`}
          >
            <Photo
              src={image.thumb}
              alt={image.alt}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
            />
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

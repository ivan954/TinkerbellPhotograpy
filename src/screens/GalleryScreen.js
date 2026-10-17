import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Reveal from "../components/Reveal";
import categories, { coverUrl, galleryPath } from "../data/categories";
import galleryManifest from "../data/galleryManifest.json";
import usePageTitle from "../hooks/usePageTitle";
import "./GalleryScreen.css";

const GalleryScreen = () => {
  usePageTitle("גלריה");

  return (
    <Container className="gallery-page">
      <header className="page-hero">
        <h1>הגלריה</h1>
        <p>הצצה לצילומים מהסטודיו. בחרו קטגוריה כדי לראות את כל התמונות.</p>
      </header>

      <div className="gallery-grid">
        {categories.map((category, index) => (
          <Reveal key={category.key} delay={(index % 3) * 90}>
            <Link to={galleryPath(category)} className="gallery-card">
              <img
                className="gallery-card-image"
                src={coverUrl(category)}
                alt={category.title}
                loading="lazy"
                decoding="async"
              />
              <div className="gallery-card-body">
                <h2>{category.title}</h2>
                <span>
                  {galleryManifest[category.key]?.length || 0} תמונות · לצפייה ←
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  );
};

export default GalleryScreen;

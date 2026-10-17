import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Reveal from "../components/Reveal";
import { useCategories, coverUrl, galleryPath } from "../data/categories";
import { useContent } from "../content/ContentProvider";
import usePageTitle from "../hooks/usePageTitle";
import "./GalleryScreen.css";

const GalleryScreen = () => {
  const { page } = useContent("categories");
  const categories = useCategories();
  usePageTitle(page.title);

  return (
    <Container className="gallery-page">
      <header className="page-hero">
        <h1>{page.title}</h1>
        <p>{page.text}</p>
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
                <span>{category.images.length} תמונות · לצפייה ←</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  );
};

export default GalleryScreen;

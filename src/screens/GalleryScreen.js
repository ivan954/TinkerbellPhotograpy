import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Reveal from "../components/Reveal";
import InstagramFeed from "../components/InstagramFeed";
import Photo from "../components/Photo";
import ComingSoon from "../components/ComingSoon";
import { useCategories, coverPath, galleryPath } from "../data/categories";
import { serviceName } from "../data/pageText";
import { useContent } from "../content/ContentProvider";
import usePageTitle from "../hooks/usePageTitle";
import seo from "../data/seo.json";
import "./GalleryScreen.css";

const GalleryScreen = () => {
  const { page } = useContent("categories");
  const categories = useCategories();
  usePageTitle(seo.galleryTitle, seo.gallery);

  return (
    <>
      <Container className="gallery-page">
        <header className="page-hero">
          <h1>{page.title}</h1>
          <p>{page.text}</p>
        </header>

        <div className="gallery-grid">
          {categories.map((category, index) => (
            <Reveal key={category.key} delay={(index % 3) * 90}>
              <Link to={galleryPath(category)} className="gallery-card">
                {coverPath(category) ? (
                  <Photo
                    className="gallery-card-image"
                    path={coverPath(category)}
                    sizes="(max-width: 991px) 50vw, 380px"
                    thumbOnly
                    width="400"
                    height="500"
                    alt={serviceName(category)}
                    // The first row is on screen right away, so it isn't lazy.
                    loading={index < 3 ? "eager" : "lazy"}
                    fetchpriority={index < 2 ? "high" : undefined}
                    decoding="async"
                  />
                ) : (
                  <ComingSoon compact className="gallery-card-image" />
                )}
                <div className="gallery-card-body">
                  <h2>{category.title}</h2>
                  {category.images.length > 0 && (
                    <span>{category.images.length} תמונות · לצפייה ←</span>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
      <InstagramFeed />
    </>
  );
};

export default GalleryScreen;

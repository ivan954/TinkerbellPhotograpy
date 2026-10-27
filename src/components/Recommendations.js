import React from "react";
import { Carousel } from "react-bootstrap";
import { imageUrl } from "../content/images";
import Reveal from "./Reveal";
import "./Recommendations.css";

// Written testimonials (first name and city, added in the admin screen with the
// client's permission). Until there are any, the screenshots are shown instead.
const Recommendations = ({ quotes = [], images = [] }) => {
  const written = quotes.filter((quote) => quote.visible !== false && quote.text);

  if (written.length) {
    return (
      <div className="quotes-grid">
        {written.map((quote, index) => (
          <Reveal as="figure" key={index} className="quote-card" delay={(index % 3) * 100}>
            <span className="quote-mark" aria-hidden="true">”</span>
            <blockquote>{quote.text}</blockquote>
            {(quote.name || quote.city) && (
              <figcaption>
                {quote.name}
                {quote.name && quote.city && ", "}
                {quote.city}
              </figcaption>
            )}
          </Reveal>
        ))}
      </div>
    );
  }

  if (!images.length) return null;

  return (
    <Carousel interval={5000} variant="dark" className="recommendations-carousel">
      {images.map((recommendation) => (
        <Carousel.Item key={recommendation.path}>
          <div className="recommendation-slide">
            <img
              src={imageUrl(recommendation.path)}
              alt={recommendation.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Recommendations;

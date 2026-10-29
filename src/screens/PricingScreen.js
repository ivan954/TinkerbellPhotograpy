import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { BsWhatsapp } from "react-icons/bs";
import Reveal from "../components/Reveal";
import Photo from "../components/Photo";
import ComingSoon from "../components/ComingSoon";
import TrustRow from "../components/TrustRow";
import { coverUrl } from "../data/categories";
import { priceSpan, usePriceLists } from "../data/priceLists";
import { formatPrice, serviceName } from "../data/pageText";
import { useWhatsappLink } from "../data/whatsapp";
import { useContent } from "../content/ContentProvider";
import usePageTitle from "../hooks/usePageTitle";
import seo from "../data/seo.json";
import "./PricingScreen.css";

// All price lists on one page (/pricing, and /packages leads here too).
const PricingScreen = () => {
  const lists = usePriceLists();
  const { floatingWhatsapp } = useContent("footer");
  const whatsappLink = useWhatsappLink();
  const span = priceSpan(lists);
  usePageTitle(
    seo.pricingTitle,
    seo.pricing.replace("{from}", span ? formatPrice(span.min) : seo.priceRange.split("–")[0])
  );

  return (
    <div className="pricing-page">
      <Container>
        <header className="page-hero">
          <nav className="breadcrumbs" aria-label="ניווט">
            <Link to="/">בית</Link> / {seo.pricingTitle}
          </nav>
          <h1>{seo.pricingTitle}</h1>
          <p>בחרו סוג צילום כדי לראות את החבילות, מה כלול בכל אחת ואת התוספות.</p>
        </header>

        <div className="pricing-grid">
          {lists.map(({ category, from }, index) => (
            <Reveal key={category.key} delay={(index % 3) * 80}>
              <Link to={category.pricesPath} className="pricing-card">
                <div className="pricing-card-image">
                  {coverUrl(category) ? (
                    <Photo src={coverUrl(category)} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" />
                  ) : (
                    <ComingSoon compact />
                  )}
                </div>
                <div className="pricing-card-body">
                  <h2>{serviceName(category)}</h2>
                  <span className="pricing-card-from">
                    {from ? `החל מ-${formatPrice(from)} ₪` : "המחירים בתיאום אישי"}
                  </span>
                  <span className="pricing-card-link">למחירון המלא ←</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="pricing-ask">
          <p>לא בטוחים איזו חבילה מתאימה לכם? אשמח לעזור לבחור.</p>
          <a className="btn-whatsapp" href={whatsappLink(floatingWhatsapp.message)} target="_blank" rel="noopener noreferrer">
            <BsWhatsapp /> {floatingWhatsapp.label}
          </a>
        </div>
      </Container>

      <div className="pricing-trust">
        <TrustRow />
      </div>
    </div>
  );
};

export default PricingScreen;

import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { BsPlusLg, BsWhatsapp } from "react-icons/bs";
import Reveal from "../components/Reveal";
import TrustRow from "../components/TrustRow";
import NotFound from "./NotFound";
import { useContent } from "../content/ContentProvider";
import { useWhatsappLink } from "../data/whatsapp";
import usePageTitle from "../hooks/usePageTitle";
import useJsonLd from "../hooks/useJsonLd";
import seo from "../data/seo.json";
import "./FaqScreen.css";

const FaqScreen = () => {
  const faq = useContent("faq");
  const whatsappLink = useWhatsappLink();
  usePageTitle(faq.title, seo.faq);
  const items = faq.items.filter((item) => item.question && item.answer);

  // The same questions and answers as on the page, for Google.
  useJsonLd(
    "faq-schema",
    faq.visible && items.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null
  );

  if (!faq.visible) return <NotFound />;

  return (
    <div className="faq-page">
      <Container>
        <header className="page-hero">
          <nav className="breadcrumbs" aria-label="ניווט">
            <Link to="/">בית</Link> / {faq.title}
          </nav>
          <span className="section-eyebrow">{faq.eyebrow}</span>
          <h1>{faq.title}</h1>
        </header>

        {/* Questions open and close in place; <details> works without JS. */}
        <div className="faq-list">
          {items.map((item, index) => (
            <Reveal as="details" key={index} className="faq-item" delay={Math.min(index, 5) * 60}>
              <summary>
                <span>{item.question}</span>
                <BsPlusLg className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </Reveal>
          ))}
        </div>

        {faq.askText && (
          <div className="faq-ask">
            <p>{faq.askText}</p>
            <a
              className="btn-whatsapp"
              href={whatsappLink(faq.askMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsWhatsapp /> {faq.askButton}
            </a>
          </div>
        )}
      </Container>

      <div className="faq-page-trust">
        <TrustRow />
      </div>
    </div>
  );
};

export default FaqScreen;

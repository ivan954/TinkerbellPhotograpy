import React from "react";
import { Container } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import Reveal from "./Reveal";
import "./Faq.css";

// Questions open and close in place; uses <details>, so it works without JS.
const Faq = ({ faq }) => {
  const items = faq.items.filter((item) => item.question && item.answer);
  if (!faq.visible || !items.length) return null;

  return (
    <section className="section" id="faq">
      <Container>
        <Reveal className="section-heading">
          <span className="section-eyebrow">{faq.eyebrow}</span>
          <h2>{faq.title}</h2>
        </Reveal>
        <div className="faq-list">
          {items.map((item, index) => (
            <details key={index} className="faq-item">
              <summary>
                <span>{item.question}</span>
                <BsPlusLg className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Faq;

import React from "react";
import { Container } from "react-bootstrap";
import { BsCalendarHeart, BsEnvelopePaper, BsCupHot } from "react-icons/bs";
import { useContent } from "../content/ContentProvider";
import "./TrustRow.css";

// Icons for the trust items, in order (they repeat if more items are added).
const ICONS = [BsCalendarHeart, BsEnvelopePaper, BsCupHot];

// A short row of reassurances: deposit, how photos arrive, feeding breaks.
const TrustRow = () => {
  const { trust } = useContent("common");
  const items = trust.items.filter((item) => item.title);
  if (!trust.visible || !items.length) return null;

  return (
    <section className="trust-row" aria-label="כדאי לדעת">
      <Container>
        <ul>
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li key={index}>
                <Icon aria-hidden="true" />
                <div>
                  <strong>{item.title}</strong>
                  {item.text && <span>{item.text}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};

export default TrustRow;

import React from "react";
import { Container } from "react-bootstrap";
import llmInfo from "../data/llmInfo";
import usePageTitle from "../hooks/usePageTitle";
import seo from "../data/seo.json";
import "./LlmInfoScreen.css";

// Plain facts about the studio for search engines and AI assistants
// (/llm-info/), linked only from the footer. The text is the studio's own
// (data/llmInfo.js); crawlers that don't run JavaScript get the same HTML
// from the prerendered page.
const LlmInfoScreen = () => {
  usePageTitle(seo.llmTitle, seo.llm);

  return (
    <Container className="llm-info-page">
      {/* Trusted, fixed text from the repository, not user input. */}
      <div className="llm-info-body" dangerouslySetInnerHTML={{ __html: llmInfo }} />
      <p className="llm-info-file">
        גרסת טקסט: <a href="/llms.txt">llms.txt</a>
      </p>
    </Container>
  );
};

export default LlmInfoScreen;

import footerData from "./components/screens/footer.json";

// WhatsApp link with a ready-to-send message, so a visitor can book in one tap.
export const whatsappLink = (text) =>
  text
    ? `${footerData.social.whatsapp.url}?text=${encodeURIComponent(text)}`
    : footerData.social.whatsapp.url;

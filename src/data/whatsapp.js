import { useContent } from "../content/ContentProvider";

// WhatsApp link with a ready-to-send message, so a visitor can book in one tap.
export const useWhatsappLink = () => {
  const { url } = useContent("footer").social.whatsapp;
  return (text) => (text ? `${url}?text=${encodeURIComponent(text)}` : url);
};

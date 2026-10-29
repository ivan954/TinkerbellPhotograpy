import { useContent } from "../content/ContentProvider";
import { imageUrl, thumbUrl } from "../content/images";
import { priceSpan, usePriceLists } from "../data/priceLists";
import { formatPrice } from "../data/pageText";
import useJsonLd from "../hooks/useJsonLd";
import seo from "../data/seo.json";

// Opening hours and coordinates rarely change and are written as free text in
// the content, so they are kept here (and in index.html).
const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "09:00",
    closes: "17:00",
  },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "15:00" },
];
const GEO = { "@type": "GeoCoordinates", latitude: 31.90588756, longitude: 35.00098228 };

// The business details Google reads, kept in step with the live content:
// phone, email, social profiles (including the Google business profile once
// it is set in the admin) and the price range of all packages.
const SiteSchema = () => {
  const { social } = useContent("footer");
  const { info } = useContent("contact");
  const { hero } = useContent("home");
  const { logo } = useContent("common");
  const span = priceSpan(usePriceLists());

  useJsonLd(
    "business-schema",
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "טינקרבל סטודיו",
      alternateName: "Tinkerbell Studio",
      description: "סטודיו לצילומי ניובורן, הריון, גיל שנה, ילדים ומשפחות במודיעין",
      url: `${seo.siteUrl}/`,
      image: thumbUrl(hero.image),
      logo: imageUrl(logo.path),
      telephone: social.phone.number,
      email: social.email.address,
      priceRange: span ? `₪${formatPrice(span.min)}–₪${formatPrice(span.max)}` : `₪${seo.priceRange.replace("–", "–₪")}`,
      currenciesAccepted: "ILS",
      areaServed: "מודיעין-מכבים-רעות",
      address: {
        "@type": "PostalAddress",
        streetAddress: info.address.street.replace("כתובת - ", "").trim(),
        addressLocality: info.address.city.trim(),
        addressCountry: "IL",
      },
      geo: GEO,
      openingHoursSpecification: OPENING_HOURS,
      sameAs: [social.instagram?.url, social.facebook?.url, social.google?.url].filter(Boolean),
    },
    { keep: true }
  );
  return null;
};

export default SiteSchema;

// One entry per photography category: the gallery folder, the price list and
// the route of its price page, so every screen links them the same way.
const categories = [
  { key: "NewBorn", title: "ניובורן", prices: "newborn", pricesPath: "/NewBornPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "Pregnancy", title: "הריון", prices: "pregnancy", pricesPath: "/PregnancyPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "OneYearOld", title: "גיל שנה", prices: "oneyear", pricesPath: "/OneYearPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "Children", title: "ילדים", prices: "children", pricesPath: "/ChildrenPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "Family", title: "משפחה", prices: "family", pricesPath: "/FamilyPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "Halake", title: "חלאקה", prices: "halake", pricesPath: "/HalakePrices", cover: "1.jpg" },
  { key: "FirstClass", title: "כיתה א'", prices: "firstclass", pricesPath: "/FirstClassPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "Purim", title: "פורים", prices: "purim", pricesPath: "/PurimPrices", cover: "GalleryFaceCard/image.jpg" },
  { key: "Shavuot", title: "שבועות", prices: "shavuot", pricesPath: "/ShavuotPrices", cover: "3.jpg" },
  { key: "Tadmit", title: "צילומי תדמית", prices: "tadmit", pricesPath: "/TadmitPrices", cover: "2.jpg" },
];

export const thumbUrl = (category, file) =>
  `${process.env.PUBLIC_URL}/images/thumbs/Gallery/${category.key}/${file}`;

export const coverUrl = (category) => thumbUrl(category, category.cover);

export const galleryPath = (category) => `/imagescreen/${category.key}`;

export const findCategory = (predicate) => categories.find(predicate);

export default categories;

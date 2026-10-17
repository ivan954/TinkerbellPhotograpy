// Photography categories come from the "categories" content document: each one
// links its gallery folder, its price list and the route of its price page.
import { useContent } from "../content/ContentProvider";
import { thumbUrl } from "../content/images";

// Categories marked as hidden in the admin screen are left out everywhere.
export const useCategories = () =>
  useContent("categories").list.filter((category) => category.visible !== false);

export const coverUrl = (category) => thumbUrl(category.cover);

export const galleryPath = (category) => `/imagescreen/${category.key}`;

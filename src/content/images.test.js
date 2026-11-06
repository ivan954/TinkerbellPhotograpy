import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { storagePath, webpSrcSet } from "./images";
import Photo from "../components/Photo";

jest.mock("./config", () => ({
  SUPABASE_URL: "https://x.supabase.co",
  IMAGES_BUCKET: "site-images",
}));

const BUCKET = "https://x.supabase.co/storage/v1/object/public/site-images";

test("finds the path inside the bucket for uploads and built-in photos", () => {
  expect(storagePath(`${BUCKET}/categories/1-ab.jpg`)).toBe("categories/1-ab.jpg");
  expect(storagePath("bundled/Gallery/Purim/1.jpg")).toBe("bundled/Gallery/Purim/1.jpg");
  expect(storagePath("https://example.com/photo.jpg")).toBe(null);
});

test("WebP copies are listed at 400, 800 and 1600px", () => {
  expect(webpSrcSet("bundled/Gallery/Purim/1.jpg")).toBe(
    `${BUCKET}/w400/bundled/Gallery/Purim/1.jpg.webp 400w, ` +
      `${BUCKET}/w800/bundled/Gallery/Purim/1.jpg.webp 800w, ` +
      `${BUCKET}/w1600/bundled/Gallery/Purim/1.jpg.webp 1600w`
  );
  expect(webpSrcSet("https://example.com/photo.jpg")).toBe(null);
});

test("a photo without WebP copies falls back to its JPEG copies", () => {
  render(<Photo path="bundled/Gallery/Purim/1.jpg" sizes="50vw" alt="צילומי פורים" />);
  const img = screen.getByAltText("צילומי פורים");
  expect(img.getAttribute("srcset")).toContain(".webp 400w");

  fireEvent.error(img);
  expect(img.getAttribute("srcset")).toBe(
    `${BUCKET}/thumbs/bundled/Gallery/Purim/1.jpg 800w, ${BUCKET}/bundled/Gallery/Purim/1.jpg 1920w`
  );
  expect(img.getAttribute("src")).toBe(`${BUCKET}/bundled/Gallery/Purim/1.jpg`);
});

test("small tiles fall back to the 800px JPEG only", () => {
  render(<Photo path="bundled/Gallery/Purim/1.jpg" thumbOnly alt="אריח" />);
  const img = screen.getByAltText("אריח");
  fireEvent.error(img);
  expect(img.getAttribute("srcset")).toBe(null);
  expect(img.getAttribute("src")).toBe(`${BUCKET}/thumbs/bundled/Gallery/Purim/1.jpg`);
});

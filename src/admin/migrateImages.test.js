import { bundledStoragePath, findBundledPaths, migrateImages } from "./migrateImages";
import { uploadImageTo } from "./uploadImage";

jest.mock("./uploadImage", () => ({ uploadImageTo: jest.fn() }));

const url = (path) => `https://x.supabase.co/storage/v1/object/public/site-images/${path}`;

beforeEach(() => {
  // CRA resets mocks before each test, so the fake upload is set up here.
  uploadImageTo.mockImplementation(async (blob, path) => url(path));
  global.fetch = jest.fn(async (path) =>
    path.includes("missing")
      ? { ok: false, status: 404 }
      : { ok: true, blob: async () => new Blob(["x"], { type: "image/jpeg" }) }
  );
});

const content = {
  home: {
    hero: { image: "/images/Carousel/2.jpg", title: "/images/ in a sentence is not a path" },
    testimonials: { images: [{ path: "/images/Recommendations/1.jpeg", alt: "המלצה" }] },
  },
  categories: {
    list: [
      { cover: "/images/Gallery/NewBorn/GalleryFaceCard/image.jpg", images: ["/images/Gallery/NewBorn/1.jpg"] },
      { cover: "https://x.supabase.co/storage/v1/object/public/site-images/categories/1.jpg", images: [] },
    ],
  },
  "prices/newborn": { images: { premium: "/images/Gallery/NewBorn/1.jpg" } },
  contact: { page: { title: "בואו נדבר" } },
};

test("storage paths are fixed and JPEGs end in .jpg", () => {
  expect(bundledStoragePath("/images/Gallery/NewBorn/1.jpg")).toBe("bundled/Gallery/NewBorn/1.jpg");
  expect(bundledStoragePath("/images/Recommendations/1.jpeg")).toBe("bundled/Recommendations/1.jpg");
  expect(bundledStoragePath("/images/Logo/Logo.png")).toBe("bundled/Logo/Logo.png");
});

test("finds each bundled photo once, in every document and nesting", () => {
  expect([...findBundledPaths(content)].sort()).toEqual([
    "/images/Carousel/2.jpg",
    "/images/Gallery/NewBorn/1.jpg",
    "/images/Gallery/NewBorn/GalleryFaceCard/image.jpg",
    "/images/Recommendations/1.jpeg",
  ]);
});

test("uploads each photo once (re-runs skip existing) and rewrites only documents that had them", async () => {
  const progress = [];
  const { changed, failed, uploaded } = await migrateImages(content, (done, total) => progress.push([done, total]));

  expect(failed).toEqual([]);
  expect(uploaded).toBe(4);
  expect(uploadImageTo).toHaveBeenCalledTimes(4);
  expect(uploadImageTo.mock.calls.every(([, , options]) => options.skipExisting)).toBe(true);
  expect(progress[progress.length - 1]).toEqual([4, 4]);

  expect(Object.keys(changed).sort()).toEqual(["categories", "home", "prices/newborn"]);
  expect(changed.home.hero).toEqual({ image: url("bundled/Carousel/2.jpg"), title: content.home.hero.title });
  expect(changed.home.testimonials.images[0]).toEqual({ path: url("bundled/Recommendations/1.jpg"), alt: "המלצה" });
  expect(changed.categories.list[0].images).toEqual([url("bundled/Gallery/NewBorn/1.jpg")]);
  expect(changed.categories.list[1]).toEqual(content.categories.list[1]);
  expect(changed["prices/newborn"].images.premium).toBe(url("bundled/Gallery/NewBorn/1.jpg"));
  expect(findBundledPaths(changed).size).toBe(0);
});

test("a photo that can't be read is reported and keeps its old path", async () => {
  const { changed, failed } = await migrateImages({ about: { image: "/images/About/missing.jpg" } });
  expect(failed).toEqual([{ path: "/images/About/missing.jpg", message: "הקובץ לא נמצא (404)" }]);
  expect(changed.about.image).toBe("/images/About/missing.jpg");
});

test("an upload that returns no address counts as failed", async () => {
  uploadImageTo.mockImplementation(async () => undefined);
  const { failed, uploaded } = await migrateImages({ about: { image: "/images/About/About.jpeg" } });
  expect(uploaded).toBe(0);
  expect(failed).toHaveLength(1);
});

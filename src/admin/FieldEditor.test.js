import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import FieldEditor from "./FieldEditor";

jest.mock("./uploadImage", () => jest.fn());

beforeAll(() => {
  // jsdom has no matchMedia; the editor uses it to tell phones apart.
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
});

const category = (images) => ({
  key: "Halake",
  title: "חלאקה",
  visible: true,
  prices: "halake",
  pricesPath: "/HalakePrices",
  cover: "",
  images,
});

const renderEditor = (docKey, value) =>
  render(<FieldEditor docKey={docKey} value={value} update={() => {}} folder={docKey} />);

test("a category whose photos were all deleted still offers to add photos", () => {
  renderEditor("categories", { list: [category([])] });
  expect(screen.getByText("הוספת תמונות")).toBeInTheDocument();
});

test("a category with photos offers to add more", () => {
  renderEditor("categories", { list: [category(["/images/Gallery/Halake/1.jpg"])] });
  expect(screen.getByText("הוספת תמונות")).toBeInTheDocument();
});

test("categories themselves still can't be added or removed", () => {
  renderEditor("categories", { list: [category([])] });
  const list = screen.getByText("קטגוריות").closest("section");
  expect(within(list).queryByText("הוספה")).not.toBeInTheDocument();
});

test("emptied testimonial screenshots can be uploaded again", () => {
  renderEditor("home", { testimonials: { visible: true, images: [] } });
  expect(screen.getByText("הוספת תמונות")).toBeInTheDocument();
});

test("an empty list of written testimonials can be added to", () => {
  renderEditor("home", { testimonials: { visible: true, quotes: [] } });
  expect(screen.getByText("הוספה")).toBeInTheDocument();
});

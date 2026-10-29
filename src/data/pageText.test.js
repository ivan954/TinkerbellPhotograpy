import { packageName, pricesDescription, pricesTitle, serviceName, fromPrice } from "./pageText";

const newborn = { title: "ניובורן" };
const prices = (values, features = {}) => ({
  prices: values,
  features: { basic: [], extra: [], premium: [], ...features },
});

test("package names drop the word 'package'", () => {
  expect(packageName("חבילה פרימיום")).toBe("פרימיום");
  expect(packageName("חבילת כוכב קטן")).toBe("כוכב קטן");
  expect(packageName("כוכב קטן")).toBe("כוכב קטן");
});

test("service names don't repeat 'צילומי'", () => {
  expect(serviceName(newborn)).toBe("צילומי ניובורן");
  expect(serviceName({ title: "צילומי תדמית" })).toBe("צילומי תדמית");
  expect(pricesTitle(newborn)).toBe("צילומי ניובורן במודיעין – מחירון");
});

test("the lowest price counts only shown packages", () => {
  expect(fromPrice(prices({ basic: "900", extra: "1,200", premium: "1,550" }))).toBe(900);
  expect(fromPrice(prices({ basic: "", extra: "1,200", premium: "" }, { premium: ["משהו"] }))).toBe(1200);
  expect(fromPrice(prices({ basic: "", extra: "", premium: "" }))).toBe(null);
});

test("descriptions say how many packages and from what price", () => {
  expect(pricesDescription(newborn, prices({ basic: "900", extra: "1,200", premium: "1,550" }))).toContain(
    "3 חבילות החל מ-900 ₪"
  );
  expect(pricesDescription(newborn, prices({ basic: "", extra: "1,200", premium: "" }))).toContain(
    "חבילה אחת החל מ-1,200 ₪"
  );
});

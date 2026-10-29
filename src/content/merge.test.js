import { buildContent } from "./ContentProvider";

// The real defaults load the price lists with webpack's require.context,
// which Jest doesn't have; a small stand-in is enough here.
jest.mock("./defaults", () => ({
  home: { hero: { title: "ברירת מחדל" } },
  faq: {
    visible: true,
    title: "שאלות נפוצות",
    items: [{ question: "שאלה מקורית", answer: "תשובה מקורית" }],
    askButton: "לשאלה בוואטסאפ",
  },
}));
jest.mock("./config", () => ({ SUPABASE_URL: "", SUPABASE_ANON_KEY: "", isSupabaseConfigured: false }));

const savedFaq = {
  visible: true,
  title: "שאלות נפוצות",
  items: [{ question: "שאלה ששמרתי", answer: "תשובה ששמרתי" }],
};

test("questions saved with the home page show on the FAQ page until it is saved", () => {
  const content = buildContent({ home: { hero: { title: "כותרת" }, faq: savedFaq } });
  expect(content.faq.items).toEqual(savedFaq.items);
  // Fields added later (the WhatsApp question button) still come from the defaults.
  expect(content.faq.askButton).toBe("לשאלה בוואטסאפ");
  expect(content.home.hero.title).toBe("כותרת");
});

test("once the FAQ page is saved, it wins over the old copy", () => {
  const own = { ...savedFaq, items: [{ question: "חדשה", answer: "חדשה" }] };
  expect(buildContent({ home: { faq: savedFaq }, faq: own }).faq.items).toEqual(own.items);
});

test("without anything saved, the bundled questions are used", () => {
  expect(buildContent(null).faq.items[0].question).toBe("שאלה מקורית");
  expect(buildContent({}).faq.items[0].question).toBe("שאלה מקורית");
});

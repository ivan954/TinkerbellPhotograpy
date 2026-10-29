import { useAllContent } from "../content/ContentProvider";
import { useCategories } from "./categories";
import { fromPrice, priceNumber, visibleTiers } from "./pageText";

// Every shown category with its price list and lowest package price.
export const usePriceLists = () => {
  const content = useAllContent();
  return useCategories().map((category) => {
    const prices = content[`prices/${category.prices}`];
    return { category, prices, from: prices ? fromPrice(prices) : null };
  });
};

// Lowest and highest package price across all price lists, or null.
export const priceSpan = (lists) => {
  const numbers = lists.flatMap(({ prices }) =>
    prices
      ? visibleTiers(prices)
          .map((tier) => priceNumber(prices.prices[tier]))
          .filter((value) => value !== null)
      : []
  );
  return numbers.length ? { min: Math.min(...numbers), max: Math.max(...numbers) } : null;
};

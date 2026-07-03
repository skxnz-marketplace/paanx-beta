import { products } from "@/data/products";

export function searchProducts(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;

  return products.filter((item) => {
    const haystack = [
      item.name,
      item.brand,
      item.category,
      item.subcategory,
      item.packSize,
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

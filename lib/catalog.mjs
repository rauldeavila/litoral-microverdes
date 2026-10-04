// A single published document preserves the exact order chosen in the dashboard.
export const catalogQuery = `*[_type == "catalog" && _id == "catalog"][0]{
  "products": products[visible == true]{_key, name, grams, image}
}`;

export function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];
  const keys = new Set();
  return products.flatMap((product) => {
    if (
      !product ||
      typeof product._key !== "string" ||
      !product._key ||
      keys.has(product._key) ||
      typeof product.name !== "string" ||
      !product.name.trim() ||
      !Number.isFinite(product.grams) ||
      product.grams <= 0 ||
      !/^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|jpeg|png|webp|avif)$/.test(
        product.image?.asset?._ref || "",
      )
    )
      return [];
    keys.add(product._key);
    return [
      {
        id: product._key,
        name: product.name.trim(),
        grams: product.grams,
        image: product.image,
      },
    ];
  });
}

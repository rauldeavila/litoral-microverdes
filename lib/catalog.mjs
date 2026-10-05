// A single published document preserves the exact order chosen in the dashboard.
export const catalogQuery = `*[_type == "catalog" && _id == "catalog"][0]{
  pageCopy{eyebrow, title, description},
  "products": products[visible == true]{_key, name, grams, image}
}`;

export const catalogCopyFields = [
  {
    name: "eyebrow",
    label: "Chamada acima do título",
    maxLength: 100,
    defaultValue: "Cultivados perto de você",
  },
  {
    name: "title",
    label: "Título principal",
    maxLength: 120,
    defaultValue: "Nossos microverdes",
  },
  {
    name: "description",
    label: "Subtítulo",
    maxLength: 500,
    defaultValue:
      "Pequenos no tamanho, cheios de vida. Conheça as variedades que cultivamos para levar frescor à sua mesa.",
  },
];

// Existing catalogs need no migration; missing or invalid copy uses the original text.
export function normalizeCatalogCopy(copy) {
  return Object.fromEntries(
    catalogCopyFields.map(({ name, maxLength, defaultValue }) => {
      const value = copy?.[name];
      return [
        name,
        typeof value === "string" &&
        value.trim() &&
        value.trim().length <= maxLength
          ? value.trim()
          : defaultValue,
      ];
    }),
  );
}

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

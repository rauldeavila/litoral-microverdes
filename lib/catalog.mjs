// A single published document preserves the exact order chosen in the dashboard.
export const catalogQuery = `*[_type == "catalog" && _id == coalesce($documentId, "catalog")][0]{
  pageCopy{eyebrow, title, description},
  categories[]{_key, name},
  banners[]{_key, name, image, localImage, visible},
  "products": products[visible == true]{_key, name, grams, image, categoryId}
}`;

export const defaultCategories = [
  { _key: "microverdes", name: "Microverdes" },
  { _key: "flores-comestiveis", name: "Flores Comestíveis" },
  { _key: "pancs", name: "PANCs" },
];
export const defaultBanners = Array.from({ length: 7 }, (_, index) => ({
  _key: `original-banner-${index + 1}`,
  _type: "banner",
  name: `Cultivo de microverdes ${index + 1}`,
  localImage: `/images/carousel/image-${index + 1}.png`,
  image: {
    _type: "image",
    alt: `Cultivo de microverdes da Litoral — foto ${index + 1}`,
  },
  visible: true,
}));

export function isImageAsset(image) {
  return /^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|jpeg|png|webp|avif)$/.test(
    image?.asset?._ref || "",
  );
}

export function isOriginalBanner(path) {
  return defaultBanners.some((banner) => banner.localImage === path);
}

export function normalizeCategories(categories) {
  if (categories == null)
    return defaultCategories.map((category) => ({ ...category }));
  if (!Array.isArray(categories)) return [];
  const seen = new Set();
  return categories
    .filter((category) => {
      if (
        !category ||
        typeof category._key !== "string" ||
        !category._key ||
        seen.has(category._key) ||
        typeof category.name !== "string" ||
        !category.name.trim()
      )
        return false;
      seen.add(category._key);
      return true;
    })
    .map(({ _key, name }) => ({ _key, name: name.trim() }));
}

export function normalizeBanners(banners) {
  const items = banners == null ? defaultBanners : banners;
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  return items.filter((banner) => {
    if (
      !banner ||
      !banner.visible ||
      typeof banner._key !== "string" ||
      !banner._key ||
      seen.has(banner._key) ||
      typeof banner.name !== "string" ||
      !banner.name.trim() ||
      !(isImageAsset(banner.image) || isOriginalBanner(banner.localImage))
    )
      return false;
    seen.add(banner._key);
    return true;
  });
}

// Defaults are applied in memory: loading old content never writes to Sanity.
export function prepareCatalogForEditing(document) {
  const categories = normalizeCategories(document?.categories);
  return {
    pageCopy: normalizeCatalogCopy(document?.pageCopy),
    categories,
    banners: (document?.banners ?? defaultBanners).map((banner) => ({
      ...banner,
    })),
    products: (document?.products || []).map((product) => ({
      ...product,
      categoryId: product.categoryId || categories[0]?._key || "microverdes",
    })),
  };
}

export function catalogDocumentId(environment) {
  return environment === "development" ? "catalog-preview" : "catalog";
}

export async function loadEditableCatalog(client, documentId) {
  const document = await client.getDocument(documentId);
  const source =
    document ||
    (documentId === "catalog-preview"
      ? await client.getDocument("catalog")
      : null);
  return {
    ...prepareCatalogForEditing(source),
    revision: document?._rev || null,
  };
}

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
        categoryId: product.categoryId || "microverdes",
      },
    ];
  });
}

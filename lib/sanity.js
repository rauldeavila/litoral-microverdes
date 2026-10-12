import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  catalogId,
} from "./sanity-config";
import {
  catalogQuery,
  normalizeProducts,
  normalizeCatalogCopy,
  normalizeCategories,
  normalizeBanners,
  isImageAsset,
} from "./catalog.mjs";

export async function getCatalog() {
  if (!isSanityConfigured)
    return {
      products: [],
      pageCopy: normalizeCatalogCopy(),
      categories: normalizeCategories(),
      banners: normalizeBanners().map((banner) => ({
        ...banner,
        imageUrl: banner.localImage,
      })),
    };

  const client = createClient({
    projectId,
    catalogId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
    timeout: 10000,
    maxRetries: 2,
  });
  // Let ISR retain its last successful page if Sanity is temporarily unavailable.
  let catalog = await client.fetch(catalogQuery, { documentId: catalogId });
  if (!catalog && catalogId === "catalog-preview")
    catalog = await client.fetch(catalogQuery, { documentId: "catalog" });
  const builder = createImageUrlBuilder(client);
  const products = normalizeProducts(catalog?.products).map(
    ({ image, ...product }) => ({
      ...product,
      imageUrl: builder
        .image(image)
        .width(960)
        .height(960)
        .fit("crop")
        .auto("format")
        .quality(85)
        .url(),
      imageAlt:
        typeof image.alt === "string" && image.alt.trim()
          ? image.alt.trim()
          : product.name,
    }),
  );
  const banners = normalizeBanners(catalog?.banners).map((banner) => ({
    _key: banner._key,
    name: banner.name,
    imageAlt: banner.image?.alt || banner.name,
    imageUrl: isImageAsset(banner.image)
      ? builder
          .image(banner.image)
          .width(1920)
          .height(820)
          .fit("crop")
          .auto("format")
          .quality(85)
          .url()
      : banner.localImage,
  }));
  return {
    products,
    pageCopy: normalizeCatalogCopy(catalog?.pageCopy),
    categories: normalizeCategories(catalog?.categories),
    banners,
  };
}

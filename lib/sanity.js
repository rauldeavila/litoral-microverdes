import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
} from "./sanity-config";
import {
  catalogQuery,
  normalizeProducts,
  normalizeCatalogCopy,
} from "./catalog.mjs";

export async function getCatalog() {
  if (!isSanityConfigured)
    return { products: [], pageCopy: normalizeCatalogCopy() };

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
    timeout: 10000,
    maxRetries: 2,
  });
  // Let ISR retain its last successful page if Sanity is temporarily unavailable.
  const catalog = await client.fetch(catalogQuery);
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
  return { products, pageCopy: normalizeCatalogCopy(catalog?.pageCopy) };
}

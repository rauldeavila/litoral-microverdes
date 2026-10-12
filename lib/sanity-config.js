// Public identifiers for the project owned by Litoral Microverdes. No API secret.
import { catalogDocumentId } from "./catalog.mjs";

export const catalogId = catalogDocumentId(process.env.NODE_ENV);
export const isLocalPreview = catalogId === "catalog-preview";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "uoowndbg";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-10-04";
export const isSanityConfigured = Boolean(projectId);

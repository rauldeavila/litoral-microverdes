import test from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import {
  catalogQuery,
  defaultCategories,
  defaultBanners,
  normalizeBanners,
  prepareCatalogForEditing,
  loadEditableCatalog,
  catalogDocumentId,
} from "../lib/catalog.mjs";
import {
  publishCatalog,
  validateCategories,
  validateBanners,
  moveProduct,
} from "../lib/catalog-editor.mjs";

const product = {
  _key: "brocolis",
  _type: "product",
  name: "Brócolis",
  grams: 60,
  visible: true,
  image: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-abc123-960x960-png" },
    alt: "Brócolis",
  },
};

test("legacy content receives starter categories and banners without changing original data", () => {
  const original = { products: [product] };
  const snapshot = JSON.stringify(original);
  const prepared = prepareCatalogForEditing(original);
  assert.deepEqual(
    prepared.categories.map((c) => c.name),
    ["Microverdes", "Flores Comestíveis", "PANCs"],
  );
  assert.equal(prepared.products[0].categoryId, "microverdes");
  assert.equal(prepared.banners.length, 7);
  assert.equal(JSON.stringify(original), snapshot);
  assert.deepEqual(
    prepareCatalogForEditing({ products: [], banners: [] }).banners,
    [],
  );
});

test("local preview falls back to production without inheriting its revision or writing to it", async () => {
  const reads = [];
  const client = {
    async getDocument(id) {
      reads.push(id);
      return id === "catalog"
        ? { _rev: "live-revision", products: [product] }
        : undefined;
    },
  };
  const prepared = await loadEditableCatalog(
    client,
    catalogDocumentId("development"),
  );
  assert.deepEqual(reads, ["catalog-preview", "catalog"]);
  assert.equal(prepared.revision, null);
  let saved;
  await publishCatalog(
    {
      async create(doc) {
        saved = doc;
        return doc;
      },
    },
    prepared.products,
    prepared.revision,
    prepared.pageCopy,
    {
      categories: prepared.categories,
      banners: prepared.banners,
      documentId: "catalog-preview",
    },
  );
  assert.equal(saved._id, "catalog-preview");
  assert.equal(catalogDocumentId("production"), "catalog");
  assert.equal(catalogDocumentId("test"), "catalog");
  const existing = await loadEditableCatalog(
    {
      async getDocument(id) {
        assert.equal(id, "catalog-preview");
        return { ...saved, _rev: "preview-revision" };
      },
    },
    "catalog-preview",
  );
  assert.equal(existing.revision, "preview-revision");
});

test("renaming and reordering categories preserve product membership; referenced categories cannot disappear", () => {
  const prepared = prepareCatalogForEditing({ products: [product] });
  const categories = moveProduct(prepared.categories, 0, 2).map((c) =>
    c._key === "microverdes" ? { ...c, name: "Brotos frescos" } : c,
  );
  assert.equal(validateCategories(categories, prepared.products), null);
  assert.equal(prepared.products[0].categoryId, "microverdes");
  assert.match(
    validateCategories(
      categories.filter((c) => c._key !== "microverdes"),
      prepared.products,
    ),
    /categoria válida/,
  );
  assert.match(
    validateCategories(
      [...categories, { _key: "duplicate", name: " brotos fréscos " }],
      prepared.products,
    ),
    /mesmo nome/,
  );
  assert.match(validateCategories([], []), /entre 1 e 30/);
});

test("banner visibility, custom uploads and explicit empty list survive normalization", () => {
  const uploaded = {
    _key: "upload",
    name: "Nossa horta",
    visible: true,
    image: product.image,
  };
  const banners = [
    uploaded,
    { ...defaultBanners[0], visible: false },
    defaultBanners[1],
  ];
  assert.equal(validateBanners(banners), null);
  assert.deepEqual(
    normalizeBanners(banners).map((b) => b._key),
    ["upload", "original-banner-2"],
  );
  assert.deepEqual(normalizeBanners([]), []);
  assert.deepEqual(normalizeBanners([{ ...uploaded, visible: false }]), []);
  assert.match(
    validateBanners([
      {
        ...uploaded,
        image: {},
        localImage: "https://external.example/image.png",
      },
    ]),
    /imagem válida/,
  );
  assert.match(validateBanners([uploaded, uploaded]), /identificador/);
});

test("one revision-checked save persists categories, hidden products and ordered banners together", async () => {
  const initial = prepareCatalogForEditing({
    products: [product, { ...product, _key: "hidden", visible: false }],
  });
  let stored;
  const client = {
    patch(id) {
      assert.equal(id, "catalog-preview");
      return {
        ifRevisionId(rev) {
          assert.equal(rev, "revision");
          return this;
        },
        set(value) {
          stored = value;
          return this;
        },
        async commit() {
          return stored;
        },
      };
    },
  };
  const banners = [defaultBanners[2], { ...defaultBanners[0], visible: false }];
  await publishCatalog(client, initial.products, "revision", initial.pageCopy, {
    documentId: "catalog-preview",
    categories: defaultCategories,
    banners,
  });
  assert.equal(stored.products.length, 2);
  assert.deepEqual(
    stored.banners.map((b) => b._key),
    ["original-banner-3", "original-banner-1"],
  );
  const result = await (
    await evaluate(parse(catalogQuery), {
      params: { documentId: "catalog-preview" },
      dataset: [
        { _id: "catalog", _type: "catalog", products: [] },
        { _id: "catalog-preview", _type: "catalog", ...stored },
      ],
    })
  ).get();
  assert.equal(result.products.length, 1);
  assert.equal(result.products[0].categoryId, "microverdes");
  assert.equal(normalizeBanners(result.banners).length, 1);
  await assert.rejects(
    publishCatalog(client, initial.products, "revision", initial.pageCopy, {
      categories: [],
    }),
    /categorias/,
  );
  await assert.rejects(
    publishCatalog(client, initial.products, "revision", initial.pageCopy, {
      documentId: "arbitrary",
    }),
    /Destino/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import { parse, evaluate } from "groq-js";
import { catalogQuery, normalizeProducts } from "../lib/catalog.mjs";

const product = (key, extra = {}) => ({
  _key: key,
  _type: "product",
  name: `Microverde ${key}`,
  grams: 30,
  visible: true,
  image: { _type: "image", asset: { _ref: "image-abc123-960x960-jpg" } },
  ...extra,
});

test("public catalog excludes drafts and hidden products while retaining editorial order", async () => {
  const data = [
    {
      _id: "drafts.catalog",
      _type: "catalog",
      products: [product("unpublished")],
    },
    { _id: "other-catalog", _type: "catalog", products: [product("other")] },
    {
      _id: "catalog",
      _type: "catalog",
      products: [
        product("second"),
        product("hidden", { visible: false }),
        product("first"),
      ],
    },
  ];
  const result = await (
    await evaluate(parse(catalogQuery), { dataset: data })
  ).get();
  assert.deepEqual(
    normalizeProducts(result.products).map((p) => p.id),
    ["second", "first"],
  );
  data[2].products.reverse();
  const reordered = await (
    await evaluate(parse(catalogQuery), { dataset: data })
  ).get();
  assert.deepEqual(
    normalizeProducts(reordered.products).map((p) => p.id),
    ["first", "second"],
  );
});

test("invalid CMS records cannot create broken cards or duplicate React keys", () => {
  const result = normalizeProducts([
    null,
    product("blank", { name: " " }),
    product("zero", { grams: 0 }),
    product("negative", { grams: -1 }),
    product("text", { grams: "30" }),
    product("missing-image", { image: null }),
    product("external-image", {
      image: { asset: { _ref: "https://other.example/photo.jpg" } },
    }),
    product("ok", { name: "  Rúcula  ", grams: 12.5 }),
    product("ok"),
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "Rúcula");
  assert.equal(result[0].grams, 12.5);
});

test("an unpublished or empty catalog has no products", async () => {
  const result = await (
    await evaluate(parse(catalogQuery), {
      dataset: [
        {
          _id: "drafts.catalog",
          _type: "catalog",
          products: [product("draft")],
        },
      ],
    })
  ).get();
  assert.equal(result, null);
  assert.deepEqual(normalizeProducts(result?.products), []);
  assert.deepEqual(normalizeProducts([]), []);
});

const { moveProduct, publishCatalog, validateCatalog } =
  await import("../lib/catalog-editor.mjs");
const editable = (key) =>
  product(key, {
    image: {
      _type: "image",
      alt: "",
      asset: { _type: "reference", _ref: "image-abc123-960x960-jpg" },
    },
  });

test("reordering preserves stable IDs and hidden items", () => {
  const items = [editable("a"), editable("b"), editable("c")];
  items[1].visible = false;
  assert.deepEqual(
    moveProduct(items, 0, 2).map((p) => p._key),
    ["b", "c", "a"],
  );
  assert.deepEqual(
    items.map((p) => p._key),
    ["a", "b", "c"],
  );
  assert.equal(moveProduct(items, -1, 0), items);
});

test("publishing rejects invalid weights and images before making a request", async () => {
  const client = {
    create() {
      throw new Error("Unexpected network request");
    },
  };
  await assert.rejects(
    publishCatalog(client, [editable("a"), editable("a")], null),
    /identificador/,
  );
  await assert.rejects(
    publishCatalog(client, [{ ...editable("a"), grams: -2 }], null),
    /peso/,
  );
  await assert.rejects(
    publishCatalog(client, [{ ...editable("a"), image: null }], null),
    /foto/,
  );
  assert.equal(validateCatalog([editable("a")]), null);
});

test("concurrent edits are rejected instead of overwriting another publication", async () => {
  let stored = null;
  const client = {
    async create(doc) {
      if (stored)
        throw Object.assign(new Error("Conflict"), { statusCode: 409 });
      return (stored = { ...doc, _rev: "first" });
    },
    patch(id) {
      let rev, update;
      return {
        ifRevisionId(value) {
          rev = value;
          return this;
        },
        set(value) {
          update = value;
          return this;
        },
        async commit() {
          assert.equal(id, "catalog");
          if (rev !== stored._rev)
            throw Object.assign(new Error("Conflict"), { statusCode: 409 });
          return (stored = { ...stored, ...update, _rev: "second" });
        },
      };
    },
  };
  await publishCatalog(client, [editable("a")], null);
  await assert.rejects(publishCatalog(client, [editable("b")], null), {
    statusCode: 409,
  });
  await publishCatalog(client, [editable("b")], "first");
  await assert.rejects(publishCatalog(client, [editable("c")], "first"), {
    statusCode: 409,
  });
  assert.equal(stored.products[0]._key, "b");
});

import { catalogCopyFields } from "./catalog.mjs";

export function moveProduct(products, from, to) {
  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 0 ||
    to < 0 ||
    from >= products.length ||
    to >= products.length
  )
    return products;
  const result = [...products];
  const [product] = result.splice(from, 1);
  result.splice(to, 0, product);
  return result;
}

export function validateCatalog(products) {
  if (!Array.isArray(products) || products.length > 200)
    return "O catálogo pode ter até 200 produtos.";
  const keys = new Set();
  for (const [index, product] of products.entries()) {
    const label = `Produto ${index + 1}`;
    if (
      !product ||
      typeof product._key !== "string" ||
      !product._key ||
      keys.has(product._key)
    )
      return `${label}: identificador inválido. Recarregue o catálogo.`;
    keys.add(product._key);
    if (
      typeof product.name !== "string" ||
      product.name.trim().length < 2 ||
      product.name.trim().length > 100
    )
      return `${label}: informe um nome entre 2 e 100 caracteres.`;
    if (
      !Number.isFinite(product.grams) ||
      product.grams <= 0 ||
      product.grams > 10000 ||
      Math.abs(product.grams * 100 - Math.round(product.grams * 100)) > 0.000001
    )
      return `${label}: informe um peso válido, maior que zero, com até duas casas decimais.`;
    if (
      !/^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|jpeg|png|webp|avif)$/.test(
        product.image?.asset?._ref || "",
      )
    )
      return `${label}: envie uma foto em JPG, PNG, WebP ou AVIF.`;
    if (typeof product.visible !== "boolean")
      return `${label}: escolha a visibilidade.`;
    if (
      typeof product.image?.alt !== "string" ||
      product.image.alt.length > 200
    )
      return `${label}: a descrição da foto deve ter até 200 caracteres.`;
  }
  return null;
}

// Project permissions are enforced by Sanity. Revision checks prevent lost edits.
export async function publishCatalog(client, products, revision, pageCopy) {
  const error = validateCatalog(products);
  if (error) throw new Error(error);
  let sanitizedCopy;
  if (pageCopy !== undefined) {
    sanitizedCopy = {};
    for (const { name, label, maxLength } of catalogCopyFields) {
      const value = pageCopy?.[name];
      if (
        typeof value !== "string" ||
        !value.trim() ||
        value.trim().length > maxLength
      )
        throw new Error(
          `${label}: informe um texto de até ${maxLength} caracteres.`,
        );
      sanitizedCopy[name] = value.trim();
    }
  }
  const sanitized = products.map(({ _key, name, grams, image, visible }) => ({
    _key,
    _type: "product",
    name: name.trim(),
    grams,
    image,
    visible,
  }));
  const changes = {
    products: sanitized,
    ...(sanitizedCopy && { pageCopy: sanitizedCopy }),
  };
  if (!revision)
    return client.create({
      _id: "catalog",
      _type: "catalog",
      ...changes,
    });
  return client.patch("catalog").ifRevisionId(revision).set(changes).commit();
}

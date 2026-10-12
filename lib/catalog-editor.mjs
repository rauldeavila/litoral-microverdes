import {
  catalogCopyFields,
  isImageAsset,
  isOriginalBanner,
} from "./catalog.mjs";

export function validateCategories(categories, products) {
  if (
    !Array.isArray(categories) ||
    categories.length < 1 ||
    categories.length > 30
  )
    return "Mantenha entre 1 e 30 categorias.";
  const ids = new Set();
  const names = new Set();
  for (const category of categories) {
    if (
      !category ||
      typeof category._key !== "string" ||
      !category._key ||
      ids.has(category._key)
    )
      return "Categoria com identificador inválido ou repetido.";
    if (
      typeof category.name !== "string" ||
      category.name.trim().length < 2 ||
      category.name.trim().length > 60
    )
      return "Cada categoria precisa de um nome entre 2 e 60 caracteres.";
    const name = category.name
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (names.has(name))
      return "Existem categorias com o mesmo nome. Use nomes diferentes.";
    names.add(name);
    ids.add(category._key);
  }
  if (products.some((product) => !ids.has(product.categoryId)))
    return "Escolha uma categoria válida para cada produto antes de salvar.";
  return null;
}

export function validateBanners(banners) {
  if (!Array.isArray(banners) || banners.length > 30)
    return "O carrossel pode ter até 30 banners.";
  const ids = new Set();
  for (const [index, banner] of banners.entries()) {
    const label = `Banner ${index + 1}`;
    if (
      !banner ||
      typeof banner._key !== "string" ||
      !banner._key ||
      ids.has(banner._key)
    )
      return `${label}: identificador inválido ou repetido.`;
    ids.add(banner._key);
    if (
      typeof banner.name !== "string" ||
      banner.name.trim().length < 2 ||
      banner.name.trim().length > 100
    )
      return `${label}: informe um nome entre 2 e 100 caracteres.`;
    if (!isImageAsset(banner.image) && !isOriginalBanner(banner.localImage))
      return `${label}: envie uma imagem válida.`;
    if (typeof banner.visible !== "boolean")
      return `${label}: escolha a visibilidade.`;
    if (typeof banner.image?.alt !== "string" || banner.image.alt.length > 200)
      return `${label}: a descrição da imagem deve ter até 200 caracteres.`;
  }
  return null;
}

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
export async function publishCatalog(
  client,
  products,
  revision,
  pageCopy,
  options = {},
) {
  const { categories, banners, documentId = "catalog" } = options;
  if (!["catalog", "catalog-preview"].includes(documentId))
    throw new Error("Destino do catálogo inválido.");
  const error = validateCatalog(products);
  if (error) throw new Error(error);
  if (categories !== undefined) {
    const categoryError = validateCategories(categories, products);
    if (categoryError) throw new Error(categoryError);
  }
  if (banners !== undefined) {
    const bannerError = validateBanners(banners);
    if (bannerError) throw new Error(bannerError);
  }
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
  const sanitized = products.map(
    ({ _key, name, grams, image, visible, categoryId }) => ({
      _key,
      _type: "product",
      name: name.trim(),
      grams,
      image,
      visible,
      ...(categoryId && { categoryId }),
    }),
  );
  const changes = {
    products: sanitized,
    ...(sanitizedCopy && { pageCopy: sanitizedCopy }),
    ...(categories !== undefined && {
      categories: categories.map(({ _key, name }) => ({
        _key,
        _type: "category",
        name: name.trim(),
      })),
    }),
    ...(banners !== undefined && {
      banners: banners.map(({ _key, name, image, localImage, visible }) => ({
        _key,
        _type: "banner",
        name: name.trim(),
        image,
        visible,
        ...(!isImageAsset(image) &&
          isOriginalBanner(localImage) && { localImage }),
      })),
    }),
  };
  if (!revision)
    return client.create({
      _id: documentId,
      _type: "catalog",
      ...changes,
    });
  return client.patch(documentId).ifRevisionId(revision).set(changes).commit();
}

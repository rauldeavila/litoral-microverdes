import { useEffect, useMemo, useRef, useState } from "react";
import CatalogSession from "./CatalogSession";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  GripVertical,
  LogOut,
  Plus,
  Save,
  Sprout,
  Trash2,
  Upload,
} from "lucide-react";
import { dataset, projectId } from "../lib/sanity-config";
import { moveProduct, publishCatalog } from "../lib/catalog-editor.mjs";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-green-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-green-950 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40";
const inputClass =
  "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 focus:border-green-700 focus:outline-2 focus:outline-green-700";

export default function CatalogDashboard() {
  return (
    <CatalogSession>{(session) => <Editor {...session} />}</CatalogSession>
  );
}

function Editor({ client, user, logOut }) {
  const [products, setProducts] = useState([]);
  const [revision, setRevision] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragged, setDragged] = useState(null);
  const mounted = useRef(true);
  const imageBuilder = useMemo(
    () => createImageUrlBuilder({ projectId, dataset }),
    [],
  );
  const active = products.find((product) => product._key === selected);
  const busy = status !== "ready";

  async function load() {
    setStatus("loading");
    setError("");
    setNotice("");
    try {
      // Sanity checks the user's effective permissions (including inherited
      // organization roles) on every upload and mutation.
      const document = await client
        .withConfig({ useCdn: false, perspective: "published" })
        .getDocument("catalog");
      if (!mounted.current) return;
      const items = document?.products || [];
      setProducts(items);
      setRevision(document?._rev || null);
      setSelected(items[0]?._key || null);
      setDirty(false);
      setStatus("ready");
    } catch (cause) {
      if (!mounted.current) return;
      setError(
        cause.statusCode === 401 || cause.statusCode === 403
          ? "Sua conta não tem permissão para acessar o catálogo. Entre com uma conta autorizada no projeto Sanity."
          : cause.message ||
              "Não foi possível carregar o catálogo. Tente novamente.",
      );
      setStatus("error");
    }
  }

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [client, user?.id]);
  useEffect(() => {
    if (!dirty && status !== "uploading") return;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, status]);

  function update(items) {
    setProducts(items);
    setDirty(true);
    setNotice("");
    setError("");
  }
  function edit(values) {
    update(
      products.map((product) =>
        product._key === selected ? { ...product, ...values } : product,
      ),
    );
  }
  function add() {
    const product = {
      _key: crypto.randomUUID(),
      _type: "product",
      name: "",
      grams: "",
      visible: true,
      image: { _type: "image", alt: "" },
    };
    update([...products, product]);
    setSelected(product._key);
  }
  function remove() {
    if (
      !window.confirm(
        `Remover ${active.name || "este produto"} do catálogo? A remoção só será aplicada quando você publicar.`,
      )
    )
      return;
    const items = products.filter((product) => product._key !== selected);
    update(items);
    setSelected(items[0]?._key || null);
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        file.type,
      ) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Escolha uma foto JPG, PNG, WebP ou AVIF de até 10 MB.");
      return;
    }
    setStatus("uploading");
    setError("");
    const key = selected;
    try {
      const asset = await client.assets.upload("image", file, {
        filename: file.name,
      });
      if (!mounted.current) return;
      setProducts((items) =>
        items.map((product) =>
          product._key === key
            ? {
                ...product,
                image: {
                  _type: "image",
                  alt: product.image?.alt || "",
                  asset: { _type: "reference", _ref: asset._id },
                },
              }
            : product,
        ),
      );
      setDirty(true);
      setNotice("Foto enviada. Publique para exibir a mudança no site.");
    } catch {
      setError(
        "Não foi possível enviar a foto. Verifique sua conexão e sua permissão de edição.",
      );
    } finally {
      if (mounted.current) setStatus("ready");
    }
  }
  async function publish() {
    setStatus("saving");
    setError("");
    setNotice("");
    try {
      const document = await publishCatalog(client, products, revision);
      if (!mounted.current) return;
      setProducts(document.products);
      setRevision(document._rev);
      setDirty(false);
      setNotice(
        "Catálogo publicado! As alterações aparecem no site após cerca de um minuto, na próxima visita.",
      );
    } catch (cause) {
      setError(
        cause.statusCode === 409
          ? "Outra pessoa publicou mudanças enquanto você editava. Suas alterações continuam nesta tela. Copie o que precisar e recarregue o catálogo antes de publicar novamente."
          : cause.statusCode === 401 || cause.statusCode === 403
            ? "Sua conta não tem permissão de edição. Peça acesso ao responsável pelo projeto."
            : cause.message ||
              "Não foi possível publicar. Suas alterações foram mantidas; tente novamente.",
      );
    } finally {
      if (mounted.current) setStatus("ready");
    }
  }
  function photo(product) {
    if (!product?.image?.asset?._ref) return null;
    try {
      return imageBuilder
        .image(product.image)
        .width(600)
        .height(600)
        .fit("crop")
        .auto("format")
        .url();
    } catch {
      return null;
    }
  }
  async function exit() {
    if (dirty && !window.confirm("Sair sem publicar as alterações desta tela?"))
      return;
    try {
      await logOut();
    } catch {
      setError("Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900">
      <header className="border-b border-green-900/10 bg-white px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sprout className="text-green-800" size={30} />
            <div>
              <p className="font-bold text-green-950">Litoral Microverdes</p>
              <p className="text-sm text-gray-500">Painel do catálogo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">
              {user?.name}
            </span>
            <a
              href="/catalogo"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              Ver catálogo <ExternalLink size={15} />
            </a>
            <button
              type="button"
              onClick={exit}
              disabled={status === "saving" || status === "uploading"}
              className={buttonClass}
              aria-label="Sair do painel"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-950">
              Seu catálogo
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
              Adicione fotos, edite os produtos e organize a vitrine. Publique
              quando estiver tudo pronto.
            </p>
          </div>
          <button
            type="button"
            onClick={publish}
            disabled={busy || !dirty}
            className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={18} />
            {status === "saving" ? "Publicando…" : "Publicar alterações"}
          </button>
        </div>
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
            <button
              type="button"
              className="ml-3 font-semibold underline"
              disabled={status === "saving" || status === "uploading"}
              onClick={() => {
                if (
                  !dirty ||
                  window.confirm(
                    "Recarregar e descartar as alterações ainda não publicadas?",
                  )
                )
                  load();
              }}
            >
              Recarregar catálogo
            </button>
          </div>
        )}
        {notice && (
          <p
            role="status"
            className="mb-5 rounded-xl bg-green-100 p-4 text-sm text-green-900"
          >
            {notice}
          </p>
        )}
        {status === "loading" ? (
          <p role="status" className="py-12 text-center">
            Carregando catálogo…
          </p>
        ) : (
          status !== "error" && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
              <section
                className="min-w-0 rounded-2xl border border-green-900/10 bg-white p-5 md:p-6"
                aria-label="Lista de produtos"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="font-semibold">
                    Produtos ({products.length})
                  </h2>
                  <button
                    type="button"
                    disabled={busy || products.length >= 200}
                    onClick={add}
                    className={buttonClass}
                  >
                    <Plus size={17} /> Novo produto
                  </button>
                </div>
                <p className="mb-5 text-xs leading-relaxed text-gray-500">
                  Arraste pela alça ou use as setas para reordenar.{" "}
                  {dirty ? "Há alterações não publicadas." : "Tudo salvo."}
                </p>
                <ul className="space-y-3">
                  {products.map((product, index) => (
                    <li
                      key={product._key}
                      onDragOver={(event) => {
                        if (!busy && dragged !== null) event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (!busy && dragged !== null)
                          update(moveProduct(products, dragged, index));
                        setDragged(null);
                      }}
                      className={`flex items-center gap-2 rounded-xl border p-3 ${selected === product._key ? "border-green-700 bg-green-50" : "border-gray-200"}`}
                    >
                      <span
                        draggable={!busy}
                        onDragStart={(event) => {
                          setDragged(index);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData(
                            "text/plain",
                            product._key,
                          );
                        }}
                        onDragEnd={() => setDragged(null)}
                        className="cursor-grab text-gray-400"
                        title="Arrastar para reordenar"
                      >
                        <GripVertical size={18} />
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setSelected(product._key)}
                        aria-pressed={selected === product._key}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        {photo(product) ? (
                          <img
                            src={photo(product)}
                            alt=""
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                            <Sprout />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {product.name || "Novo produto"}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            {product.grams || "—"} g ·{" "}
                            {product.visible ? "Visível" : "Oculto"}
                          </span>
                        </span>
                      </button>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={busy || index === 0}
                          className="rounded p-1 text-green-900 hover:bg-green-100 disabled:opacity-25"
                          aria-label={`Mover ${product.name || "produto"} para cima`}
                          onClick={() =>
                            update(moveProduct(products, index, index - 1))
                          }
                        >
                          <ArrowUp size={17} />
                        </button>
                        <button
                          type="button"
                          disabled={busy || index === products.length - 1}
                          className="rounded p-1 text-green-900 hover:bg-green-100 disabled:opacity-25"
                          aria-label={`Mover ${product.name || "produto"} para baixo`}
                          onClick={() =>
                            update(moveProduct(products, index, index + 1))
                          }
                        >
                          <ArrowDown size={17} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {products.length === 0 && (
                  <div className="py-14 text-center">
                    <Sprout className="mx-auto mb-4 text-green-700" size={36} />
                    <h3 className="font-semibold text-green-950">
                      Vamos montar sua vitrine?
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Comece adicionando seu primeiro microverde.
                    </p>
                  </div>
                )}
              </section>
              <section
                aria-label="Editar produto"
                className="rounded-2xl border border-green-900/10 bg-white p-5 md:p-6"
              >
                {!active ? (
                  <p className="py-12 text-center text-sm text-gray-500">
                    Selecione um produto para editar.
                  </p>
                ) : (
                  <fieldset disabled={busy} className="space-y-5">
                    <legend className="mb-5 text-lg font-semibold text-green-950">
                      Editar produto
                    </legend>
                    <div>
                      {photo(active) ? (
                        <img
                          src={photo(active)}
                          alt={
                            active.image?.alt ||
                            active.name ||
                            "Foto do produto"
                          }
                          width={600}
                          height={600}
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-[#e8ece4] text-green-700">
                          <Sprout size={48} />
                        </div>
                      )}
                      <label
                        className={`${buttonClass} mt-3 w-full cursor-pointer`}
                      >
                        <Upload size={17} />
                        {status === "uploading"
                          ? "Enviando foto…"
                          : "Escolher foto"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="sr-only"
                          onChange={upload}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        Foto quadrada, de preferência 960 × 960 pixels. Até 10
                        MB.
                      </p>
                    </div>
                    <label className="block text-sm font-medium">
                      Nome do microverde
                      <input
                        className={inputClass}
                        value={active.name}
                        maxLength={100}
                        onChange={(event) => edit({ name: event.target.value })}
                        placeholder="Ex.: Rúcula"
                      />
                    </label>
                    <label className="block text-sm font-medium">
                      Peso da embalagem (g)
                      <input
                        type="number"
                        min="0.01"
                        max="10000"
                        step="0.01"
                        className={inputClass}
                        value={active.grams}
                        onChange={(event) =>
                          edit({
                            grams:
                              event.target.value === ""
                                ? ""
                                : Number(event.target.value),
                          })
                        }
                        placeholder="Ex.: 30"
                      />
                    </label>
                    <label className="block text-sm font-medium">
                      Descrição da foto
                      <input
                        className={inputClass}
                        value={active.image?.alt || ""}
                        maxLength={200}
                        onChange={(event) =>
                          edit({
                            image: { ...active.image, alt: event.target.value },
                          })
                        }
                        placeholder="Opcional, para acessibilidade"
                      />
                    </label>
                    <label className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={active.visible}
                        onChange={(event) =>
                          edit({ visible: event.target.checked })
                        }
                        className="h-5 w-5 accent-green-800"
                      />
                      Exibir no catálogo
                    </label>
                    <button
                      type="button"
                      onClick={remove}
                      className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:underline"
                    >
                      <Trash2 size={17} /> Remover produto
                    </button>
                  </fieldset>
                )}
              </section>
            </div>
          )
        )}
      </main>
    </div>
  );
}

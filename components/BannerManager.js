import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { moveProduct } from "../lib/catalog-editor.mjs";

export function BannerManager({
  banners,
  busy,
  onChange,
  onUpload,
  onPaste,
  photo,
  buttonClass,
  inputClass,
}) {
  const [selected, setSelected] = useState(banners[0]?._key || null);
  const [removing, setRemoving] = useState(null);
  const active =
    banners.find((banner) => banner._key === selected) || banners[0];
  function edit(values) {
    onChange(
      banners.map((banner) =>
        banner._key === active._key ? { ...banner, ...values } : banner,
      ),
    );
  }
  function add() {
    const banner = {
      _key: crypto.randomUUID(),
      _type: "banner",
      name: "",
      image: { _type: "image", alt: "" },
      visible: true,
    };
    onChange([...banners, banner]);
    setSelected(banner._key);
  }
  return (
    <section
      aria-label="Gerenciar banners"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
    >
      <div className="min-w-0 rounded-2xl border border-green-900/10 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-green-950">
            Banners ({banners.length})
          </h2>
          <button
            type="button"
            disabled={busy || banners.length >= 30}
            onClick={add}
            className={buttonClass}
          >
            <Plus size={17} /> Novo banner
          </button>
        </div>
        <p className="mb-5 mt-3 text-sm text-gray-500">
          Use as setas para definir a sequência. O site alterna os banners
          visíveis a cada 6 segundos.
        </p>
        <ul className="space-y-3">
          {banners.map((banner, index) => (
            <li
              key={banner._key}
              className={`flex items-center gap-2 rounded-xl border p-3 ${active?._key === banner._key ? "border-green-700 bg-green-50" : "border-gray-200"}`}
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => setSelected(banner._key)}
                aria-pressed={active?._key === banner._key}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                {photo(banner) ? (
                  <img
                    src={photo(banner)}
                    alt=""
                    width={96}
                    height={48}
                    className="h-12 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <ImagePlus className="shrink-0 text-green-700" size={32} />
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {banner.name || "Novo banner"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {banner.visible ? "Visível" : "Oculto"}
                  </span>
                </span>
              </button>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  className="rounded p-2 text-green-900 hover:bg-green-100 disabled:opacity-25"
                  disabled={busy || index === 0}
                  aria-label={`Mover banner ${index + 1} para cima`}
                  onClick={() =>
                    onChange(moveProduct(banners, index, index - 1))
                  }
                >
                  <ArrowUp size={17} />
                </button>
                <button
                  type="button"
                  className="rounded p-2 text-green-900 hover:bg-green-100 disabled:opacity-25"
                  disabled={busy || index === banners.length - 1}
                  aria-label={`Mover banner ${index + 1} para baixo`}
                  onClick={() =>
                    onChange(moveProduct(banners, index, index + 1))
                  }
                >
                  <ArrowDown size={17} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!banners.length && (
          <p className="py-12 text-center text-sm text-gray-500">
            Adicione uma imagem para começar. Sem banners visíveis, o carrossel
            fica oculto no site.
          </p>
        )}
      </div>
      <div className="min-w-0 rounded-2xl border border-green-900/10 bg-white p-5 md:p-6">
        {active ? (
          <fieldset disabled={busy} className="space-y-5">
            <legend className="mb-5 text-lg font-semibold text-green-950">
              Editar banner
            </legend>
            <div>
              <button
                type="button"
                className="block aspect-[21/9] w-full overflow-hidden rounded-xl bg-green-50 text-green-700 focus:outline-2 focus:outline-offset-4 focus:outline-green-700"
                aria-label="Imagem do banner: clique e cole uma imagem"
                onClick={(event) => event.currentTarget.focus()}
                onPaste={(event) => onPaste(event, active._key)}
              >
                {photo(active) ? (
                  <img
                    src={photo(active)}
                    alt={active.image?.alt || active.name}
                    width={1400}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="mx-auto" size={48} />
                )}
              </button>
              <p className="mt-3 text-xs text-gray-500">
                Clique na imagem e cole com ⌘V ou Ctrl+V. Use uma foto
                horizontal, de preferência 1920 × 820 px. No celular, o recorte
                central é mais próximo.
              </p>
              <label className={`${buttonClass} mt-3 w-full cursor-pointer`}>
                <Upload size={17} /> Escolher imagem do banner
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    onUpload(file, active._key);
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, WebP ou AVIF, até 10 MB.
              </p>
            </div>
            <label className="block text-sm font-medium">
              Nome do banner
              <input
                className={inputClass}
                value={active.name}
                maxLength={100}
                placeholder="Ex.: Nossa produção"
                onChange={(event) => edit({ name: event.target.value })}
              />
            </label>
            <label className="block text-sm font-medium">
              Descrição da imagem do banner
              <input
                className={inputClass}
                value={active.image?.alt || ""}
                maxLength={200}
                placeholder="Descreva a imagem para acessibilidade"
                onChange={(event) =>
                  edit({ image: { ...active.image, alt: event.target.value } })
                }
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium">
              <input
                type="checkbox"
                checked={active.visible}
                onChange={(event) => edit({ visible: event.target.checked })}
                className="h-5 w-5 accent-green-800"
              />{" "}
              Exibir no carrossel
            </label>
            {removing === active._key ? (
              <div className="rounded-xl bg-red-50 p-4 text-sm">
                <p>
                  Remover este banner? A mudança só será aplicada ao salvar.
                </p>
                <div className="mt-3 flex gap-4">
                  <button
                    type="button"
                    className="font-semibold text-red-700 underline"
                    onClick={() => {
                      onChange(
                        banners.filter((banner) => banner._key !== active._key),
                      );
                      setRemoving(null);
                    }}
                  >
                    Confirmar remoção do banner
                  </button>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setRemoving(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:underline"
                onClick={() => setRemoving(active._key)}
              >
                <Trash2 size={17} /> Remover banner
              </button>
            )}
          </fieldset>
        ) : (
          <p className="py-12 text-center text-sm text-gray-500">
            Selecione um banner para editar.
          </p>
        )}
      </div>
    </section>
  );
}

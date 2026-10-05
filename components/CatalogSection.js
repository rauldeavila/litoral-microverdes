import { ArrowUpRight, Sprout } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { whatsappUrl } from "../lib/contact";

export function CatalogSection({ products, pageCopy }) {
  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-titulo"
      className="w-full scroll-mt-8"
    >
      <div className="flex flex-col justify-between gap-6 border-b border-green-900/15 pb-8 md:flex-row md:items-end md:pb-10">
        <div className="max-w-2xl">
          <p className="mb-3 break-words text-xs font-semibold uppercase tracking-[0.18em] text-green-800">
            {pageCopy.eyebrow}
          </p>
          <h2
            id="catalogo-titulo"
            className="break-words text-4xl font-bold tracking-tight text-green-950 md:text-6xl"
          >
            {pageCopy.title}
          </h2>
          <p className="mt-5 max-w-xl whitespace-pre-line break-words text-base leading-relaxed text-gray-600 md:text-lg">
            {pageCopy.description}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e5ebdd] px-4 py-2 text-sm text-green-900">
          <Sprout size={17} aria-hidden="true" /> Produção local · RS
        </span>
      </div>
      {products.length > 0 ? (
        <>
          <p className="pb-6 pt-7 text-sm text-gray-500">
            {products.length}{" "}
            {products.length === 1 ? "variedade" : "variedades"}
          </p>
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="my-10 rounded-2xl border border-green-900/10 bg-white px-6 py-14 text-center">
          <Sprout
            className="mx-auto mb-4 text-green-800"
            size={36}
            aria-hidden="true"
          />
          <h3 className="text-2xl font-semibold text-green-950">
            Nosso catálogo está florescendo
          </h3>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-600">
            Em breve, você encontra nossas variedades por aqui. Enquanto isso,
            fale com a gente para conhecer os microverdes disponíveis.
          </p>
          <a
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-800"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com a Litoral <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}

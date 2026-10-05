import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product, priority = false, onViewProduct }) {
  return (
    <article
      className="group flex h-full flex-col"
      aria-labelledby={`product-${product.id}`}
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-[#e8ece4]">
        <img
          src={product.imageUrl}
          alt={product.imageAlt || product.name}
          width={960}
          height={960}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <h2
          id={`product-${product.id}`}
          className="text-xl font-semibold leading-snug text-green-950 md:text-2xl"
        >
          {product.name}
        </h2>
        <p className="mb-5 mt-2 text-sm text-gray-600">
          Embalagem de{" "}
          {new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(
            product.grams,
          )}{" "}
          g
        </p>
        <button
          type="button"
          disabled={!onViewProduct}
          onClick={onViewProduct ? () => onViewProduct(product) : undefined}
          aria-label={`Ver produto: ${product.name}`}
          title={!onViewProduct ? "Detalhes do produto em breve" : undefined}
          className="mt-auto flex w-full items-center justify-between rounded-full border border-green-900 px-5 py-3 text-sm font-semibold text-green-900 transition-colors enabled:hover:bg-green-900 enabled:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Ver produto <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

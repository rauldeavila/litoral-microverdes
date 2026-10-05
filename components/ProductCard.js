import { whatsappUrl } from "../lib/contact";

export function ProductCard({ product, priority = false }) {
  return (
    <article
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-green-900/15 bg-[#e5ebdd]"
      aria-labelledby={`product-${product.id}`}
    >
      <div className="aspect-square overflow-hidden bg-[#e8ece4]">
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
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h2
          id={`product-${product.id}`}
          className="break-words text-xl font-semibold leading-snug text-green-950 md:text-2xl"
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
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Comprar ${product.name} pelo WhatsApp`}
          className="mt-auto flex w-full items-center justify-center rounded-full bg-green-900 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-800"
        >
          Comprar
        </a>
      </div>
    </article>
  );
}

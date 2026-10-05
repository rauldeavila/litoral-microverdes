import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sprout } from "lucide-react";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { getCatalog } from "../lib/sanity";
import { whatsappUrl } from "../lib/contact";

export default function Catalogo({ products, pageCopy }) {
  return (
    <>
      <Head>
        <title>Catálogo de microverdes | Litoral Microverdes</title>
        <meta
          name="description"
          content="Conheça os microverdes da Litoral: produção local, frescos e sem agrotóxicos. Veja nossas variedades e os tamanhos de embalagem."
        />
      </Head>
      <div className="min-h-screen bg-[#f1f1f1] px-5 py-6 md:px-8 md:py-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Header
            onWhatsAppClick={() =>
              window.open(whatsappUrl, "_blank", "noopener,noreferrer")
            }
          />
          <main id="catalogo">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-900 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Início
            </Link>
            <div className="flex flex-col justify-between gap-6 border-b border-green-900/15 pb-8 md:flex-row md:items-end md:pb-10">
              <div className="max-w-2xl">
                <p className="mb-3 break-words text-xs font-semibold uppercase tracking-[0.18em] text-green-800">
                  {pageCopy.eyebrow}
                </p>
                <h1 className="break-words text-4xl font-bold tracking-tight text-green-950 md:text-6xl">
                  {pageCopy.title}
                </h1>
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
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 3}
                    />
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
                <h2 className="text-2xl font-semibold text-green-950">
                  Nosso catálogo está florescendo
                </h2>
                <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-600">
                  Em breve, você encontra nossas variedades por aqui. Enquanto
                  isso, fale com a gente para conhecer os microverdes
                  disponíveis.
                </p>
                <a
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-800"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com a Litoral{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            )}
          </main>
          <footer className="mt-16 flex flex-col justify-between gap-4 border-t border-green-900/15 py-7 text-sm text-gray-600 md:flex-row">
            <p>Litoral Microverdes · Fazenda Urbana</p>
            <p>Entregas no Litoral Norte, Porto Alegre e região.</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: await getCatalog(), revalidate: 60 };
}

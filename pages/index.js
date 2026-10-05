import Head from "next/head";
import { Header } from "../components/Header";
import { ImageCarousel } from "../components/ImageCarousel";
import { CTAButton } from "../components/CTAButton";
import { SocialLinks } from "../components/SocialLinks";
import AnimatedTitle from "../components/AnimatedTitle";
import { CatalogSection } from "../components/CatalogSection";
import { whatsappUrl } from "../lib/contact";
import { getCatalog } from "../lib/sanity";

const carouselImages = [
  "/images/carousel/image-1.png",
  "/images/carousel/image-2.png",
  "/images/carousel/image-3.png",
  "/images/carousel/image-4.png",
  "/images/carousel/image-5.png",
  "/images/carousel/image-6.png",
  "/images/carousel/image-7.png",
];

export default function Home({ products, pageCopy }) {
  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Head>
        <title>Litoral Microverdes | Frescos, locais e sem agrotóxicos</title>
        <meta
          name="description"
          content="Conheça os microverdes da Litoral: produção local, frescos e sem agrotóxicos. Veja nossas variedades e peça pelo WhatsApp."
        />
      </Head>
      <div className="min-h-screen bg-[#f1f1f1] pt-4 md:pt-8 lg:pt-12">
        <div className="mx-auto w-full max-w-md px-4 md:max-w-2xl md:px-8 lg:max-w-4xl lg:px-12 xl:max-w-6xl">
          <Header onWhatsAppClick={handleWhatsAppClick} />
        </div>

        <main className="flex w-full flex-col items-center gap-8">
          <div className="flex w-full max-w-6xl flex-col items-center gap-8 px-4 md:px-8 lg:px-12">
            <AnimatedTitle />
            <CTAButton onClick={handleWhatsAppClick} />
            <div className="flex flex-col items-center gap-1 text-center text-gray-800">
              <p>Fazenda Urbana - RS</p>
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-gray-800"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Entregas no Litoral Norte, Porto Alegre e região.</span>
              </div>
            </div>
          </div>

          <ImageCarousel images={carouselImages} />

          <div className="px-4">
            <SocialLinks onWhatsAppClick={handleWhatsAppClick} />
          </div>

          <div className="mx-auto mt-8 w-full max-w-6xl px-4 md:mt-16 md:px-8 lg:px-12">
            <CatalogSection products={products} pageCopy={pageCopy} />
          </div>
        </main>

        <footer className="mx-auto mt-16 max-w-6xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-4 border-t border-green-900/15 py-7 text-sm text-gray-600 md:flex-row">
            <p>Litoral Microverdes · Fazenda Urbana</p>
            <p>Entregas no Litoral Norte, Porto Alegre e região.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: await getCatalog(), revalidate: 60 };
}

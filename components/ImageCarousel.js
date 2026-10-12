import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [interaction, setInteraction] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const count = images.length;
  const index = count ? current % count : 0;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReducedMotion(media.matches);
    const visibility = () => setPageVisible(!document.hidden);
    motion();
    visibility();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (count < 2 || reducedMotion || !pageVisible) return;
    const timer = window.setTimeout(
      () => setCurrent((value) => (value + 1) % count),
      6000,
    );
    return () => window.clearTimeout(timer);
  }, [current, interaction, count, reducedMotion, pageVisible]);

  function navigate(next) {
    setCurrent((next + count) % count);
    setInteraction((value) => value + 1);
  }

  if (!count) return null;
  return (
    <section
      className="w-full"
      aria-label="Banners da Litoral"
      aria-roledescription="carrossel"
    >
      <div
        className="relative aspect-[4/3] max-h-[620px] w-full overflow-hidden bg-[#e5ebdd] md:aspect-[21/9]"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            navigate(index + (event.key === "ArrowLeft" ? -1 : 1));
          }
        }}
      >
        {images.map((banner, position) => (
          <div
            key={banner._key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} de ${count}`}
            aria-hidden={position !== index}
            className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700 ${position === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.imageAlt || banner.name}
              fill
              sizes="100vw"
              unoptimized={banner.imageUrl.startsWith("https://")}
              loading={position === 0 ? "eager" : "lazy"}
              className="object-cover"
            />
          </div>
        ))}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => navigate(index - 1)}
              aria-label="Banner anterior"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:left-8 md:h-14 md:w-14"
            >
              <ChevronLeft aria-hidden="true" size={28} />
            </button>
            <button
              type="button"
              onClick={() => navigate(index + 1)}
              aria-label="Próximo banner"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:right-8 md:h-14 md:w-14"
            >
              <ChevronRight aria-hidden="true" size={28} />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-1 px-4 pt-3"
          aria-label="Escolher banner"
        >
          {images.map((banner, position) => (
            <button
              key={banner._key}
              type="button"
              onClick={() => navigate(position)}
              aria-label={`Mostrar banner ${position + 1}: ${banner.name}`}
              aria-current={position === index ? "true" : undefined}
              className="flex h-11 w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-green-800"
            >
              <span
                className={`h-2.5 rounded-full transition-all ${position === index ? "w-7 bg-green-900" : "w-2.5 bg-green-900/25"}`}
              />
            </button>
          ))}
          <span
            className="ml-3 text-xs tabular-nums text-gray-500"
            aria-live="off"
          >
            {index + 1} / {count}
          </span>
        </div>
      )}
    </section>
  );
}

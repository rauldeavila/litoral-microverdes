import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

export function ImageCarousel({ images }) {
  const [paused, setPaused] = useState(false);

  return (
    <section className="w-full" aria-label="Fotos dos nossos microverdes">
      <div
        className="carousel-window"
        tabIndex={0}
        aria-label="Galeria de fotos"
      >
        <div
          className="carousel-track"
          style={{ animationPlayState: paused ? "paused" : undefined }}
        >
          {[false, true].map((duplicate) => (
            <div
              key={String(duplicate)}
              className="carousel-group"
              aria-hidden={duplicate || undefined}
            >
              {images.map((image, index) => (
                <div className="carousel-frame" key={image}>
                  <Image
                    src={image}
                    alt={
                      duplicate
                        ? ""
                        : `Microverdes da Litoral — foto ${index + 1}`
                    }
                    fill
                    className="object-cover"
                    sizes="(max-width: 857px) 240px, (max-width: 1714px) 28vw, 480px"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-controls mx-auto mt-3 flex max-w-6xl justify-end px-4 md:px-8">
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label="Pausar movimento das fotos"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-green-900 hover:bg-green-900/5 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
          {paused ? "Continuar fotos" : "Pausar fotos"}
        </button>
      </div>
    </section>
  );
}

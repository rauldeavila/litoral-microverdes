import Image from "next/image";

export function ImageCarousel({ images }) {
  return (
    <section className="w-full" aria-label="Fotos dos nossos microverdes">
      <div
        className="carousel-window"
        tabIndex={0}
        aria-label="Galeria de fotos"
      >
        <div className="carousel-track">
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
    </section>
  );
}

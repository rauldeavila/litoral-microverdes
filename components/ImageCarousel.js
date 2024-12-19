import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export function ImageCarousel({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="border-2 border-black w-full bg-gradient-to-br from-green-600 to-green-800 rounded-3xl overflow-hidden">
      <div className="relative h-64 md:h-[400px] lg:h-[500px]">
        <style jsx global>{`
          @keyframes zoomInAnimation {
            0% {
              transform: scale(1);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: scale(1.1);
              opacity: 1;
            }
          }

          @keyframes zoomOutAnimation {
            0% {
              transform: scale(1.1);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .zoom-in {
            animation: zoomInAnimation 5s ease-out forwards;
          }

          .zoom-out {
            animation: zoomOutAnimation 5s ease-out forwards;
          }
        `}</style>

        {images.map((image, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={image}
              className={`absolute inset-0 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 1s ease-in-out' }}
            >
              <Image
                src={image}
                alt={`Carousel Image ${index + 1}`}
                fill
                className={`object-cover ${index === currentImageIndex ? (isEven ? 'zoom-in' : 'zoom-out') : ''}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
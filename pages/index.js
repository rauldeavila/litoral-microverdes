import React from 'react';
import { Header } from '../components/Header';
import { ImageCarousel } from '../components/ImageCarousel';
import { CTAButton } from '../components/CTAButton';
import { SocialLinks } from '../components/SocialLinks';
import AnimatedTitle from '../components/AnimatedTitle';

export default function Home() {
  const carouselImages = [
    '/images/carousel/image-1.png',
    '/images/carousel/image-2.png',
    '/images/carousel/image-3.png',
    '/images/carousel/image-4.png',
    '/images/carousel/image-5.png',
    '/images/carousel/image-6.png',
    '/images/carousel/image-7.png',
  ];

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5551998189818', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-8 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <Header onWhatsAppClick={handleWhatsAppClick} />

        <main className="w-full flex flex-col items-center justify-center gap-8 -mt-50">
          <AnimatedTitle />

          <CTAButton onClick={handleWhatsAppClick} />

          <div className="text-gray-800 flex flex-col items-center gap-1">
            <p>Fazenda Urbana - RS</p>
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-800"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>⁠Entregas no Litoral Norte, Porto Alegre e região.</span>
            </div>
          </div>

          <div className="w-full md:w-3/4 lg:w-2/3">
            <ImageCarousel images={carouselImages} />
          </div>

          <SocialLinks onWhatsAppClick={handleWhatsAppClick} />
        </main>
      </div>
    </div>
  );
}
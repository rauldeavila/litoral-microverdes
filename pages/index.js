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
    <div className="min-h-screen bg-[#f1f1f1] p-4 flex flex-col items-center">
      <Header onWhatsAppClick={handleWhatsAppClick} />

      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center gap-8 -mt-50">
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

        <ImageCarousel images={carouselImages} />
        <SocialLinks onWhatsAppClick={handleWhatsAppClick} />
      </main>
    </div>
  );
}
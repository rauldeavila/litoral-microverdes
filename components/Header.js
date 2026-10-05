import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Header({ onWhatsAppClick }) {
  return (
    <header className="w-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl flex items-center justify-between relative mb-10 mt-1 md:-mt-4 z-10">
      <Link
        href="/"
        aria-label="Litoral Microverdes — início"
        className="flex items-center gap-2"
      >
        <Image
          src="/images/logo-transparent.png"
          alt="Litoral Microverdes"
          width={150}
          height={48}
          className="h-auto rounded-xl"
        />
      </Link>
      <nav aria-label="Navegação principal" className="flex items-center gap-4">
        <Link
          href="/#catalogo"
          className="text-sm font-semibold text-green-900 underline-offset-4 hover:underline"
        >
          Catálogo
        </Link>
        <button
          aria-label="Falar com a Litoral no WhatsApp"
          onClick={onWhatsAppClick}
          className="flex items-center justify-between px-4 py-2 bg-white rounded-full shadow-xs hover:shadow-md transition-all duration-300 hover:bg-green-50 relative z-10"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-500">
              <WhatsAppIcon />
            </span>
          </div>
        </button>
      </nav>
    </header>
  );
}

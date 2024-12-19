import { Instagram } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export function SocialLinks({ onWhatsAppClick }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <a
        href="https://instagram.com/litoralmicroverdes"
        target="_blank"
        rel="noopener noreferrer"
        className="border-2 border-gray-800 w-full max-w-xs bg-white hover:bg-pink-100 text-green rounded-full py-3 px-6 flex items-center justify-center gap-2 font-medium group transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <Instagram className="text-pink-500" />
          <span>@litoralmicroverdes</span>
        </div>
      </a>

      <button
        onClick={onWhatsAppClick}
        className="border-2 border-gray-800 w-full max-w-xs bg-white hover:bg-green-100 text-green rounded-full py-3 px-6 flex items-center justify-center gap-2 font-medium group transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <span className="text-green-500"><WhatsAppIcon /></span>
          <span>Contato</span>
        </div>

      </button>
    </div>
  );
}
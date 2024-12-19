import { ShoppingCart } from 'lucide-react';

export function CTAButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-gray-800 w-full max-w-xs bg-green-900 hover:bg-green-800 text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 font-medium group transition-all duration-300"
    >
      <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
      Comprar Agora
    </button>
  );
}

import { ShoppingBag } from 'lucide-react';
import { useSalesStore } from '../../stores/salesStore';
import { useState } from 'react';

interface SalesButtonProps {
  salespersonId: string;
  salespersonName?: string;
  disabled?: boolean;
}

export default function SalesButton({ salespersonId, salespersonName, disabled = false }: SalesButtonProps) {
  const addSale = useSalesStore((state) => state.addSale);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await addSale(salespersonId);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-primary-600 p-4 text-white shadow-md transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-400 ${
        isAnimating ? 'animate-pulse-once' : ''
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <ShoppingBag className="mr-2 h-6 w-6" />
      <span className="text-lg font-medium">
        {isLoading ? 'Registrando...' : 'Registrar Venda'}
      </span>
      
      {/* Ripple effect on click */}
      {isAnimating && !disabled && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
        </span>
      )}
    </button>
  );
}
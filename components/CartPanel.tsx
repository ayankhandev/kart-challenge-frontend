"use client";

import { ChevronLeft } from "lucide-react";
import { CartItem } from "@/types";
import Image from "next/image";

interface CartPanelProps {
  cart: CartItem[];
  onCheckout: () => void;
  onClose: () => void;
}

export function CartPanel({
  cart,
  onCheckout,
  onClose
}: CartPanelProps) {

  // Simplified to straight subtotal as requested by UI example
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="w-full lg:w-[400px] h-fit min-h-[400px] flex flex-col glass-panel shadow-2xl z-10 animate-in mt-0 lg:mt-8 mb-auto lg:rounded-3xl lg:mr-8 p-6 lg:p-8 bg-card border border-border">
        <button onClick={onClose} className="lg:hidden p-2 -ml-2 mb-4 w-fit rounded-full bg-muted/50 hover:bg-muted transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-foreground mb-6">
          Your cart (0)
        </h2>

        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <Image 
            src="/empty-cart.png" 
            alt="Empty Cart" 
            width={121} 
            height={102} 
            className="mb-6 object-contain"
            priority
          />
          <p className="text-muted-foreground font-medium text-center">
            Your added items will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[400px] h-fit flex flex-col glass-panel shadow-2xl z-10 animate-in mt-0 lg:mt-8 mb-auto lg:rounded-3xl lg:mr-8 p-6 lg:p-8 bg-card border border-border">
      
      {/* Mobile Back Button */}
      <button onClick={onClose} className="lg:hidden p-2 -ml-2 mb-4 w-fit rounded-full bg-muted/50 hover:bg-muted transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-bold text-foreground mb-6">
        Your cart ({cart.length})
      </h2>

      <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 -mr-2 space-y-4 mb-6">
        {cart.map((item) => {
          const itemTotal = item.quantity * item.price;
          return (
            <div key={item.id} className="flex flex-col text-base text-foreground">
              <span className="font-semibold text-foreground">{item.name}</span>
              <div className="flex gap-4 text-muted-foreground mt-0.5 items-center">
                <span>{item.quantity} X @${item.price.toFixed(2)}</span>
                <span className="text-foreground font-semibold">${itemTotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>


      <div className="border-t-2 border-border border-dashed pt-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl text-foreground">Order Total</span>
          <span className="text-2xl font-bold text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center"
      >
        Confirm order
      </button>


    </div>
  );
}

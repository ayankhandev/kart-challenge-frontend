"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "./ProductGrid";
import { CartPanel } from "./CartPanel";
import { OrderConfirmedModal } from "./OrderConfirmedModal";
import { useCartStore } from "@/store/useCartStore";

export function PosDashboard() {
  const { cart } = useCartStore();

  const [isOrderConfirmedOpen, setIsOrderConfirmedOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full bg-background items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading POS...</p>
        </div>
      </div>
    );
  }

  const handleCheckoutInitiation = () => {
    setIsCartOpen(false);
    setIsOrderConfirmedOpen(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden absolute inset-0 bg-background text-foreground">
      {/* Left Area - Main Content */}
      <div className={`flex-1 overflow-hidden lg:flex ${isCartOpen ? 'hidden' : 'flex'} flex-col relative`}>
        <ProductGrid />
        
        {/* Mobile Floating Cart Button */}
        {cart.length > 0 && (
          <div className="lg:hidden absolute bottom-6 left-6 right-6 z-40 animate-in slide-in-from-bottom-5">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/40 flex justify-between items-center font-bold text-lg transition-transform active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                 <div className="bg-primary-foreground/20 px-3 py-1 rounded-full text-base leading-none flex items-center justify-center">{cart.length}</div>
                 <span>View Order</span>
              </div>
              <span>${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Area - Cart Panel */}
      <div className={`w-full lg:w-[420px] h-full flex-shrink-0 lg:flex ${isCartOpen ? 'flex' : 'hidden'} flex-col bg-background/95 backdrop-blur-2xl lg:backdrop-blur-none lg:bg-transparent z-50 absolute lg:relative inset-0 lg:inset-auto`}>
        <CartPanel
          cart={cart}
          onCheckout={handleCheckoutInitiation}
          onClose={() => setIsCartOpen(false)}
        />
      </div>

      <OrderConfirmedModal
        isOpen={isOrderConfirmedOpen}
        onClose={() => setIsOrderConfirmedOpen(false)}
      />
    </div>
  );
}

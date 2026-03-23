"use client";

import { useState, useEffect } from "react";
import { XCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface OrderConfirmedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderConfirmedModal({ isOpen, onClose }: OrderConfirmedModalProps) {
  const { cart, couponCode, clearCart } = useCartStore();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && status === "idle") {
       processOrder();
    }
    if (!isOpen) {
       setStatus("idle");
    }
  }, [isOpen, status]);

  const processOrder = async () => {
    setStatus("loading");
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        ...(couponCode && { couponCode }),
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const res = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Failed to place order.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in">
      <div className="bg-card w-full max-w-lg rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden transform transition-all scale-100">
        
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-foreground">Processing Order...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we confirm.</p>
          </>
        )}
        
        {status === "error" && (
          <>
             <XCircle className="w-20 h-20 text-red-500 mb-4" />
             <h2 className="text-2xl font-bold text-foreground mb-2">Checkout Failed</h2>
             <p className="text-muted-foreground mb-8">{errorMessage}</p>
             <button onClick={() => {
                setStatus("idle");
                onClose();
             }} className="w-full bg-muted text-foreground py-4 rounded-2xl font-bold text-lg hover:bg-muted/80 transition-colors">
               Go Back
             </button>
          </>
        )}

        {status === "success" && (
          <div className="w-full flex flex-col items-start text-left">
            <div className="w-full flex justify-center mb-6">
              <CheckCircle2 className="w-24 h-24 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-extrabold mb-2 text-foreground w-full text-center">Order Confirmed</h2>
            <p className="text-muted-foreground mb-6 w-full text-center">We hope you enjoy your food!</p>
            
            <div className="w-full text-left bg-muted/50 rounded-2xl p-4 mb-6 max-h-[35vh] overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <span className="font-semibold text-foreground">{item.name}</span>
                    <p className="text-sm text-muted-foreground mt-0.5">Qty {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="w-full flex justify-between items-end border-t-2 border-border border-dashed pt-5 mb-8 text-left">
                <span className="font-bold text-xl text-foreground">Total</span>
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  ${total.toFixed(2)}
                </span>
            </div>
            
            <button 
              onClick={() => {
                clearCart();
                onClose();
              }} 
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Start New Order
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Ticket } from "lucide-react";
import { usePromoValidation } from "@/hooks/usePromoValidation";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}

export function CouponModal({ isOpen, onClose, onApply }: CouponModalProps) {
  const [code, setCode] = useState("");
  const [mounted, setMounted] = useState(false);
  const { validatePromo, isVerifying, error, clearError } = usePromoValidation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await validatePromo(code);
    if (valid) {
      onApply(code.trim());
      setCode("");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in">
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Apply Code</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground ml-1">Promo Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) clearError();
              }}
              placeholder="e.g. SUMMER20"
              className="w-full bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl px-5 py-4 text-xl font-bold tracking-widest placeholder:text-muted-foreground/40 transition-all outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2 ml-1 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full flex items-center justify-center bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
          >
            {isVerifying ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-background"></div>
            ) : (
              "Apply Promo"
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

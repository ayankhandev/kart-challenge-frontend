import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  cart: CartItem[];
  couponCode: string | null;
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      couponCode: null,
      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      updateQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        }),
      })),
      removeItem: (id) => set((state) => {
        const newCart = state.cart.filter((item) => item.id !== id);
        return { 
          cart: newCart,
          couponCode: newCart.length === 0 ? null : state.couponCode
        };
      }),
      clearCart: () => set({ cart: [], couponCode: null }),
      applyCoupon: (code) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),
    }),
    {
      name: 'pos-cart-storage',
    }
  )
);

import { apiFetch } from "@/lib/api";
import { CartItem } from "@/types";

interface CreateOrderPayload {
  items: { productId: number; quantity: number }[];
  couponCode?: string;
}

interface CreateOrderResponse {
  id: string;
  [key: string]: unknown;
}

export function buildOrderPayload(cart: CartItem[], couponCode: string | null): CreateOrderPayload {
  return {
    items: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    ...(couponCode && { couponCode }),
  };
}

export async function createOrder(cart: CartItem[], couponCode: string | null): Promise<CreateOrderResponse> {
  const payload = buildOrderPayload(cart, couponCode);
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

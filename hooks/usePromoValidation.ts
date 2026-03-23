"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

interface PromoResponse {
  valid: boolean;
}

export function usePromoValidation() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const validatePromo = async (code: string): Promise<boolean> => {
    const trimmed = code.trim();
    if (trimmed.length < 8 || trimmed.length > 10) {
      setError("Coupon code must be between 8 and 10 characters.");
      return false;
    }

    setIsVerifying(true);
    setError("");

    try {
      const data = await apiFetch<PromoResponse>(`/promo/validate/${trimmed}`);
      if (data.valid) {
        return true;
      } else {
        setError(`The code ${trimmed} is not valid.`);
        return false;
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setError("Promo service is unavailable right now.");
      } else if (err instanceof ApiError) {
        setError("Invalid promo code formatting.");
      } else {
        setError("Failed to verify promo code. Please check your connection.");
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const clearError = () => setError("");

  return { validatePromo, isVerifying, error, clearError };
}

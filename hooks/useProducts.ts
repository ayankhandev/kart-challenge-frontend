"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/types";
import { apiFetch } from "@/lib/api";

interface ProductsResponse {
  data: Product[];
  meta: { page: number; totalPages: number };
}

export function useProducts(selectedCategory: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [knownCategories, setKnownCategories] = useState<Set<string>>(new Set(["All"]));

  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Reset when category changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [selectedCategory]);

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setLoading(true);
      try {
        const catQuery = selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
        const json = await apiFetch<ProductsResponse>(`/products?page=${page}&limit=8${catQuery}`);

        if (isMounted) {
          setProducts((prev) => {
            if (page === 1) return json.data;
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems = json.data.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newItems];
          });
          setHasMore(json.meta.page < json.meta.totalPages);

          setKnownCategories((prev) => {
            const next = new Set(prev);
            json.data.forEach((p) => next.add(p.category));
            return next;
          });
        }
      } catch {
        // Quietly fail
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [page, selectedCategory]);

  const loadNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return {
    products,
    loading,
    hasMore,
    knownCategories: Array.from(knownCategories),
    lastProductRef,
    loadNextPage,
  };
}

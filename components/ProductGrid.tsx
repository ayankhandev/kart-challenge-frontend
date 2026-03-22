"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/types";
import { Plus, Minus, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function ProductGrid() {
  const { cart, addToCart, removeItem, updateQuantity } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [knownCategories, setKnownCategories] = useState<Set<string>>(new Set(["All"]));



  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductElementRef = useCallback(
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

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setPage(1);
    setProducts([]);
    setHasMore(true);
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      try {
        const catQuery = selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const res = await fetch(`${baseUrl}/products?page=${page}&limit=8${catQuery}`);
        
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setProducts((prev) => {
               if (page === 1) return json.data;
               const existingIds = new Set(prev.map(p => p.id));
               const newItems = json.data.filter((p: Product) => !existingIds.has(p.id));
               return [...prev, ...newItems];
            });
            setHasMore(json.meta.page < json.meta.totalPages);
            
            setKnownCategories((prev) => {
              const next = new Set(prev);
              json.data.forEach((p: Product) => next.add(p.category));
              return next;
            });
          }
        }
      } catch (err) {
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

  const categoryArray = Array.from(knownCategories);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8 animate-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dessert</h1>
        </div>
      </div>



      {products.length === 0 && !loading ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-xl font-medium">No products found.</p>
          <p className="text-muted-foreground/70 mt-1">Try adjusting your category or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
          {products.map((product, index) => {
            const isLast = index === products.length - 1;
            const cartItem = cart.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const inCart = quantity > 0;

            return (
              <div
                key={product.id}
                ref={isLast ? lastProductElementRef : null}
                className="group relative flex flex-col gap-3"
              >
                <div 
                  onClick={() => {
                    if (!inCart) addToCart(product);
                  }}
                  className={`aspect-[4/3] w-full relative rounded-2xl overflow-visible cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    inCart ? "border-2 border-primary ring-2 ring-primary/20 shadow-md" : "border border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  <img
                    src={product.image.thumbnail}
                    alt={product.name}
                    loading="lazy"
                    className="object-cover w-full h-full rounded-2xl"
                  />
                  
                  {/* Action Controllers Centered on Bottom Border */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 w-max">
                    {inCart ? (
                      <div className="flex items-center bg-background shadow-lg rounded-full px-1.5 py-1.5 border border-border">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (quantity === 1) removeItem(product.id); 
                            else updateQuantity(product.id, -1); 
                          }}
                          className="w-8 h-8 rounded-full bg-muted shadow-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-8 text-center text-foreground">{quantity}</span>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            updateQuantity(product.id, 1); 
                          }}
                          className="w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-sm flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="flex items-center gap-2 bg-background hover:bg-muted text-foreground border border-border shadow-lg px-4 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95 group-hover:border-primary group-hover:text-primary"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Transparent, left-aligned text details */}
                <div className="pt-2 text-left bg-transparent">
                  <h3 className="font-bold text-lg leading-tight mb-1 text-foreground truncate">{product.name}</h3>
                  <p className="font-semibold text-primary">${product.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-10 mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}

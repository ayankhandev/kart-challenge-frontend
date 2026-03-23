"use client";

import { useState } from "react";
import { Plus, Minus, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useProducts } from "@/hooks/useProducts";

function ProductSkeleton() {
  return (
    <div className="group relative flex flex-col gap-3">
      {/* Image skeleton — exact same aspect ratio & radius as the real card */}
      <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden">
        <div className="skeleton w-full h-full rounded-2xl" />
        {/* Button skeleton sitting on the bottom border, matching real layout */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 w-[80%] flex justify-center">
          <div className="skeleton w-full h-12 rounded-full" />
        </div>
      </div>
      {/* Text skeleton — matches pt-2, category + name + price heights */}
      <div className="pt-2 text-left flex flex-col gap-1.5">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-12 rounded" />
      </div>
    </div>
  );
}

export function ProductGrid() {
  const { cart, addToCart, removeItem, updateQuantity } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { products, loading, knownCategories, lastProductRef } = useProducts(selectedCategory);

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
  };

  const isInitialLoad = products.length === 0 && loading;

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8 animate-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dessert</h1>
        </div>
      </div>

      {isInitialLoad ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 && !loading ? (
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
                ref={isLast ? lastProductRef : null}
                className="group relative flex flex-col gap-3"
              >
                <div
                  onClick={() => {
                    if (!inCart) addToCart(product);
                  }}
                  className={`aspect-[4/3] w-full relative rounded-2xl overflow-visible cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    inCart ? "ring-2 ring-inset ring-primary shadow-md" : "border border-border hover:border-primary/40 bg-card"
                  }`}
                >
                  <picture className="w-full h-full block">
                    <source media="(min-width: 1024px)" srcSet={product.image.desktop} />
                    <source media="(min-width: 768px)" srcSet={product.image.tablet} />
                    <img
                      src={product.image.mobile}
                      alt={product.name}
                      loading="lazy"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  </picture>

                  {inCart && <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-primary pointer-events-none" />}

                  {/* Action Controllers Centered on Bottom Border */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 w-[80%] flex justify-center">
                    {inCart ? (
                      <div className="flex items-center justify-between w-full bg-primary text-primary-foreground shadow-xl rounded-full p-1.5 h-12">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (quantity === 1) removeItem(product.id);
                            else updateQuantity(product.id, -1);
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="font-bold flex-1 text-center text-lg">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, 1);
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="flex items-center justify-center w-full gap-2 bg-background hover:bg-muted text-foreground border border-border shadow-lg px-4 h-12 rounded-full font-semibold text-sm transition-all active:scale-95 group-hover:border-primary group-hover:text-primary"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="truncate">Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Transparent, left-aligned text details */}
                <div className="pt-2 text-left bg-transparent">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.category}</span>
                  <h3 className="font-bold text-lg leading-tight mb-1 text-foreground truncate">{product.name}</h3>
                  <p className="font-semibold text-primary">${product.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="flex justify-center items-center py-10 mt-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}

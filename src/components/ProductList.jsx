import React from "react";
import ProductItem from "./ProductItem";

export default function ProductList({ products = [], favorites = [], onToggleFavorite }) {
  if (!products || products.length === 0) {
    return <div className="empty">No products found.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          isFav={!!favorites.find((x) => x.id === p.id)}
          onToggleFavorite={() => onToggleFavorite(p)}
        />
      ))}
    </div>
  );
}
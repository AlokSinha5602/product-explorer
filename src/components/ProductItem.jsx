import React from "react";

export default function ProductItem({ product, isFav = false, onToggleFavorite }) {
  const { title, thumbnail, price, rating, brand } = product;

  return (
    <div className="card">
      <div className="thumb-wrap">
        <img src={thumbnail} alt={title} loading="lazy" />
        <button
          className={`fav-btn ${isFav ? "active" : ""}`}
          onClick={onToggleFavorite}
          aria-pressed={isFav}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-body">
        <h3 className="title">{title}</h3>
        <div className="meta">
          <span className="brand">{brand}</span>
          <span className="rating">⭐ {rating}</span>
        </div>
        <div className="price">₹ {price}</div>
      </div>
    </div>
  );
}
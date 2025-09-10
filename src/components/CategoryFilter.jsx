import React from "react";

/**
 * Props:
 * - categories: array of strings
 * - selected: selected category string
 * - onChange: fn(category)
 */
export default function CategoryFilter({ categories = [], selected = "all", onChange }) {
  return (
    <div className="category-filter">
      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
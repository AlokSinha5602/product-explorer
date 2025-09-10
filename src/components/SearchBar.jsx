import React, { useState, useEffect } from "react";

/**
 * Debounced search bar.
 * props:
 *  - value: current string
 *  - onChange: function(newValue)
 */
export default function SearchBar({ value = "", onChange }) {
  const [local, setLocal] = useState(value);

  // reflect external updates
  useEffect(() => setLocal(value), [value]);

  // debounce updates to parent
  useEffect(() => {
    const id = setTimeout(() => {
      if (onChange) onChange(local);
    }, 450);
    return () => clearTimeout(id);
  }, [local, onChange]);

  return (
    <div className="searchbar">
      <input
        aria-label="Search products"
        placeholder="Search products by name..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      <button className="btn small" onClick={() => onChange("")}>Clear</button>
    </div>
  );
}
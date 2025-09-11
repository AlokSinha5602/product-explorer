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
    if (local === value) return; // don't trigger if no change
    const id = setTimeout(() => {
      if (onChange) onChange(local);
    }, 450);
    return () => clearTimeout(id);
  }, [local, value,  onChange]);

  return (
    <div className="searchbar">
      <input
        aria-label="Search products"
        placeholder="Search products by name..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      <button
        className="btn small"
        onClick={() => {
          if (local !== "") {
            setLocal("");
            if (onChange) onChange("");
          }
        }}
        disabled={local === ""}
      >
        Clear
      </button>
    </div>
  );
}
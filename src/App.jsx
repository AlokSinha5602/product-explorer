import React, { useEffect, useState, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import ProductList from "./components/ProductList";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";
import axios from "axios";

const API_BASE = "https://dummyjson.com";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit] = useState(12);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [dark, setDark] = useLocalStorage("pe-dark-mode", false);
  const [favorites, setFavorites] = useLocalStorage("pe-favorites", []);

  // Fetch categories
  useEffect(() => {
    let ignore = false;
    async function fetchCategories() {
      try {
        const res = await axios.get(`${API_BASE}/products/categories`);
        const data = await res.json();
        if (!ignore && Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Categories fetch error", err);
      }
    }
    fetchCategories();
    return () => { ignore = true; };
  }, []);

  // Build endpoint based on filters (search, category, pagination)
  const buildUrl = useCallback(() => {
    if (query && query.trim() !== "") {
      // search supports q param
      return `${API_BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
    }
    if (selectedCategory && selectedCategory !== "all") {
      // category endpoint doesn't support limit/skip parameters in same way, use query params for pagination
      return `${API_BASE}/products/category/${encodeURIComponent(selectedCategory)}?limit=${limit}&skip=${skip}`;
    }
    return `${API_BASE}/products?limit=${limit}&skip=${skip}`;
  }, [query, selectedCategory, limit, skip]);

  // Fetch products when filters change
  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const url = buildUrl();
        const res = await axios.get(url, { signal: controller.signal });
        // if (!res.ok) throw new Error(`API returned ${res.status}`);
        // const data = await res.json();
        const data = res.data;
        // DummyJSON returns {products: [...], total: n, skip: x, limit: y}
        if (data.products) {
          setProducts(data.products);
          setTotal(typeof data.total === "number" ? data.total : (data.products.length || 0));
        } else {
          setProducts([]);
          setTotal(0);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError("Failed to fetch products. Try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    return () => controller.abort();
  }, [buildUrl]);

  // Pagination helpers
  const canPrev = skip > 0;
  const canNext = skip + limit < total;

  function goPrev() {
    if (!canPrev) return;
    setSkip(Math.max(0, skip - limit));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goNext() {
    if (!canNext) return;
    setSkip(skip + limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // toggle favorite
  function toggleFavorite(product) {
    const exists = favorites.find((p) => p.id === product.id);
    let next;
    if (exists) {
      next = favorites.filter((p) => p.id !== product.id);
    } else {
      next = [product, ...favorites];
    }
    setFavorites(next);
  }

  // theme toggle handling (applies class to document)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", !!dark);
  }, [dark]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Product Explorer</h1>
        <div className="header-controls">
          <button
            className="btn small"
            onClick={() => setDark((d) => !d)}
            aria-pressed={dark}
            title="Toggle dark mode"
          >
            {dark ? " Dark" : "Light"}
          </button>

          <div className="favorites-summary">
            <strong>Favorites:</strong> {favorites.length}
          </div>
        </div>
      </header>

      <main>
        <div className="controls-row">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setSkip(0); // reset pagination on new search
            }}
          />
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={(c) => {
              setSelectedCategory(c);
              setQuery(""); // clear search when selecting category (optional)
              setSkip(0);
            }}
          />
        </div>

        <section className="status-row">
          {loading && <div className="loading">Loading products...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && (
            <div className="meta">
              Showing {products.length} of {total} results
            </div>
          )}
        </section>

        <ProductList
          products={products}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        <div className="pagination">
          <button className="btn" onClick={goPrev} disabled={!canPrev}>
            ← Prev
          </button>
          <div>Page {Math.floor(skip / limit) + 1} / {Math.max(1, Math.ceil(total / limit))}</div>
          <button className="btn" onClick={goNext} disabled={!canNext}>
            Next →
          </button>
        </div>

        <footer className="app-footer">
          {/* <div>Fetched from DummyJSON</div>
          <div>Email submission: <code>aman.k.sharma@cepialabs.in</code></div> */}
        </footer>
      </main>
    </div>
  );
}
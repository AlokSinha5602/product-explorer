import { useState, useEffect } from "react";

/**
 * Simple hook to keep state synced with localStorage.
 * - key: storage key
 * - initial: initial value
 */
export default function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return typeof initial === "function" ? initial() : initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [key, state]);

  return [state, setState];
}
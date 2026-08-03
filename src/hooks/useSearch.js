"use client";

import { useState, useEffect } from "react";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async (searchTerm = query) => {
    const term = searchTerm.trim();

    if (term.length < 2) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(term)}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos.");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setError("Erro ao buscar produtos.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const performAutoSearch = async () => {
      const term = query.trim();

      if (term.length < 2) {
        setResults([]);
        setError(null);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await fetch(
          `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(term)}`,
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar produtos.");
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setError("Erro ao buscar produtos.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performAutoSearch();
  }, [query]);

  const clear = () => {
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
    setLoading(false);
  };

  const isEmpty = hasSearched && !loading && results.length === 0 && !error;
  const hasResults = results.length > 0;

  return {
    query,
    results,
    loading,
    error,
    hasSearched,
    isEmpty,
    hasResults,
    setQuery,
    search,
    clear,
  };
};

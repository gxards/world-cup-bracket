"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "wc26-third-place-selections";

export function useThirdPlaceSelections(candidateIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as unknown;

        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((id): id is string => typeof id === "string")
            .filter((id) => candidateIds.includes(id))
            .slice(0, 8);

          setSelectedIds(cleaned);
        }
      }
    } catch {
      // ignore invalid storage
    } finally {
      setHydrated(true);
    }
  }, [candidateIds]);

  useEffect(() => {
    if (!hydrated) return;

    setSelectedIds((prev) => {
      const next = prev.filter((id) => candidateIds.includes(id)).slice(0, 8);

      if (
        next.length === prev.length &&
        next.every((id, i) => id === prev[i])
      ) {
        return prev;
      }

      return next;
    });
  }, [candidateIds, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds, hydrated]);

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((teamId) => teamId !== id);
      }

      if (prev.length >= 8) {
        return prev;
      }

      return [...prev, id];
    });
  }

  function resetSelections() {
    setSelectedIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    selectedIds,
    setSelectedIds,
    toggleSelection,
    resetSelections,
    hydrated,
  };
}
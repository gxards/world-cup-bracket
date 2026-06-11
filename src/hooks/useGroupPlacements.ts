"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createEmptyPlacements,
  type GroupPlacements,
  type Position,
} from "@/lib/group-stage";

const STORAGE_KEY = "wc26-group-placements";
const THIRD_PLACE_STORAGE_KEY = "wc26-third-place-selections";

export function useGroupPlacements() {
  const [placements, setPlacements] = useState<GroupPlacements>(
    createEmptyPlacements
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GroupPlacements;
        setPlacements({ ...createEmptyPlacements(), ...parsed });
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(placements));
  }, [placements, hydrated]);

  const placeTeam = useCallback(
    (
      groupId: string,
      teamId: string,
      target: { type: "slot"; position: Position } | { type: "pool" }
    ) => {
      setPlacements((prev) => {
        const next = structuredClone(prev);
        const group = next[groupId];
        if (!group) return prev;

        const sourcePosition = ([1, 2, 3, 4] as Position[]).find(
          (p) => group[p] === teamId
        );

        if (target.type === "pool") {
          if (sourcePosition) group[sourcePosition] = null;
          return next;
        }

        const displaced = group[target.position];

        if (sourcePosition) {
          group[sourcePosition] = displaced;
        } else if (displaced) {
          // Team came from pool; displaced goes back to pool (cleared from slot)
          // No slot assignment for displaced — it becomes unassigned
        }

        group[target.position] = teamId;
        return next;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    setPlacements(createEmptyPlacements());
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(THIRD_PLACE_STORAGE_KEY);
  }, []);

  const resetGroup = useCallback((groupId: string) => {
    setPlacements((prev) => ({
      ...prev,
      [groupId]: { 1: null, 2: null, 3: null, 4: null },
    }));
  }, []);

  return { placements, placeTeam, resetAll, resetGroup, hydrated };
}
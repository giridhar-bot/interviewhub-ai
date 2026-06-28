"use client";

import { useEffect, useCallback } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; meta?: boolean } = {}
) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      const ctrlMatch = modifiers.ctrl ? e.ctrlKey || e.metaKey : true;
      const shiftMatch = modifiers.shift ? e.shiftKey : true;
      const metaMatch = modifiers.meta ? e.metaKey : true;

      if (e.key.toLowerCase() === key.toLowerCase() && ctrlMatch && shiftMatch && metaMatch) {
        e.preventDefault();
        callback();
      }
    },
    [key, callback, modifiers.ctrl, modifiers.shift, modifiers.meta]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}

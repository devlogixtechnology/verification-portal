"use client";

import { useEffect, type ReactNode } from "react";

export interface ThemeScopeProps {
  /** Matches the `[data-vf-theme="..."]` selector in a project's token file. */
  theme: string;
  children: ReactNode;
}

/**
 * Applies a project's theme to the document root for as long as its routes are
 * mounted.
 *
 * The attribute has to sit on `<html>`, not on a wrapper inside the page: the
 * app bar, the footer and the page background itself live above this layout in
 * the tree, and they have to retint with everything else. Scoping it here is
 * what keeps one project's surfaces from disagreeing with the chrome around
 * them.
 */
export default function ThemeScope({ theme, children }: ThemeScopeProps) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.vfTheme;
    root.dataset.vfTheme = theme;

    return () => {
      if (previous === undefined) delete root.dataset.vfTheme;
      else root.dataset.vfTheme = previous;
    };
  }, [theme]);

  return <>{children}</>;
}

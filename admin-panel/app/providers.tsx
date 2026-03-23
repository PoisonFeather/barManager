"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Folosim @ts-ignore doar pentru a trece de eroarea de tipuri de la "children" 
    // pe care o dă uneori librăria, dar lăsăm componenta să-și facă magia.
    // @ts-ignore
    <ThemeProvider 
  attribute="class"  // <--- Trebuie să fie EXACT "class"
  defaultTheme="system" 
  enableSystem
>
  {children}
</ThemeProvider>
  );
}
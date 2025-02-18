"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import Providers from "./Providers";
import { ComponentProps } from "react";

export const ThemeProvider = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Providers />
    </NextThemesProvider>
  );
};

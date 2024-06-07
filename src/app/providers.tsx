"use client";

import {
  ColorModeScript,
  ThemeConfig,
  UIProvider,
  defaultConfig,
  extendConfig,
} from "@yamada-ui/react";

export const config: ThemeConfig = {
  initialColorMode: "system",
};
const customConfig = extendConfig(config);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={defaultConfig.initialColorMode} />
      <UIProvider config={customConfig}>{children}</UIProvider>
    </>
  );
}

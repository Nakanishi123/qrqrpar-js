import { IconButton, useColorMode } from "@yamada-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggleButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="DarkMode Switch"
      icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
      onClick={toggleColorMode}
    />
  );
}

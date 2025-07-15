import * as React from "react";
import { Switch } from "./switch";

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Switch
      checked={isDark}
      onCheckedChange={setIsDark}
      aria-label="Toggle dark mode"
    />
  );
}

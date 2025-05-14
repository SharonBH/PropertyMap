
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";

// Define our own type for ThemeProviderProps
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  [key: string]: any;
};

export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  ...props 
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemeProvider
      defaultTheme={defaultTheme}
      themes={["light", "dark", "blue", "green"]}
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}

// Export the useTheme hook directly from next-themes
export const useTheme = useNextTheme;

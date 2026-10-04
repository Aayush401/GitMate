import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
export function ThemeProviderC({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props} 
    >
      {children}
    </NextThemesProvider>
  );
}
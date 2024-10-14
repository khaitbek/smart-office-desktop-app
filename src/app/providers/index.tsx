import { TanstackQueryProvider } from "./query";
import { RouterProvider } from "./router";
import { ThemeProvider } from "./theme";

export default function Providers() {
  return (
    <>
      <ThemeProvider defaultTheme="system">
        <TanstackQueryProvider>
          <RouterProvider />
        </TanstackQueryProvider>
      </ThemeProvider>
    </>
  );
}

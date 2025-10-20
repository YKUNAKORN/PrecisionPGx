import { ThemeProvider } from "./theme-provder";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="theme"
      >
        {children}
      </ThemeProvider>  
    </div>
  );
};
export default Providers;

import "./globals.css";
import { AppProvider } from "../components/app-provider";
import { Sidebar } from "../components/sidebar";

export const metadata = {
  title: "Arabic Interpreting Lab",
  description: "A personal Arabic interpreting learning lab.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <AppProvider>
          <div className="shell">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

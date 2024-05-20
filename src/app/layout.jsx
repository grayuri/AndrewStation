import Header from "@/components/Header";
import './globals.scss'

export const metadata = {
  title: "Andrew Station",
  description: "An incredible app to manage the pack stations and their problems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

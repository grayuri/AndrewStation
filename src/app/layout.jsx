import { Bitter, Montserrat } from 'next/font/google'
import Header from "@/components/Header";
import './globals.scss'

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
})

export const metadata = {
  title: "Andrew Station",
  description: "This is Andrew, a simple web application to check and manage the packing stations problems."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bitter.variable} ${montserrat.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}

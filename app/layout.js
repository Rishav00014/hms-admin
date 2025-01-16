import { Nunito_Sans } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { ReduxProvider } from "./redux-provider";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

const nunito = Nunito_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Air India | Trolley Management System",
  description:
    "Effective trolley management in manufacturing and construction is important for streamlining operations",
};

export default function RootLayout({ children, witLayout = true }) {
  return (
    <html lang="en">
      <body className={nunito?.className}>
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          zIndex={1600}
          showAtBottom={false}
        />
        <Toaster position="top-right" />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

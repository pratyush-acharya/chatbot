import "@styles/globals.css";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WFTChat",
  description: "WFTChat",
};

/**
 * Renders the root layout of the application with the given child components.
 *
 * @param {Object} children - The child components to be rendered.
 * @return {Object} The root layout component with the children components.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

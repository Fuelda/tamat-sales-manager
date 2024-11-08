import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./styles/content.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales Lead Management",
  description: "Manage your sales leads and track your business growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Sales Lead Management
            </Link>
            <ul className="flex space-x-4">
              <li>
                <Link href="/companies" className="hover:text-gray-300">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-gray-300">
                  Contacts
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-gray-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/mails" className="hover:text-gray-300">
                  Mails
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto mt-8">{children}</main>
      </body>
    </html>
  );
}

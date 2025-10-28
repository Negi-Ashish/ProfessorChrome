import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professor Chrome | Smart Test Creation and Learning Platform",
  description:
    "Professor Chrome helps teachers create tests faster, analyze student performance instantly, and make learning easier for both educators and students. Scalable for schools, colleges, institutes, and multiple classes.",
  keywords: [
    "Professor Chrome",
    "online test platform",
    "AI teaching tool",
    "student performance analysis",
    "automated proofreading",
    "education technology",
    "school assessment system",
    "college exam platform",
    "institute learning tools",
  ],
  openGraph: {
    title: "Professor Chrome | AI-Powered Test and Study Assistant",
    description:
      "An AI-enabled solution that simplifies test creation, grading, and study workflows for teachers and students across schools, colleges, and institutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  ${space.className}`}
      >
        {children}
      </body>
    </html>
  );
}

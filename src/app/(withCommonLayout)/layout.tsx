import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

export default function WithCommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      <main className="flex-grow w-full mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
}

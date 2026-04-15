import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { NeoFiTestPage } from "@/components/test/neofi-test-page";

export const metadata: Metadata = {
  title: "Homepage Preview",
  description: "Preview route for the current learn.sol homepage design.",
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <NeoFiTestPage />
    </div>
  );
}

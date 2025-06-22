import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardHeader() {
  return (
    <div className={`text-center mb-12 ${inter.className}`}>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Learning Dashboard
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
        Track your progress through the Solana development journey
      </p>
    </div>
  );
}

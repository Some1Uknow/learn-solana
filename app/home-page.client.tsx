import { Navbar } from "@/components/layout/navbar";
import { HomePage } from "@/components/home/homepage";

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#181818]">
      <Navbar />
      <HomePage />
    </div>
  );
}

export default HomePageClient;

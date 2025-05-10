import { Separator } from "@/components/ui/separator";
import { ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="flex flex-col items-center justify-center">
            <Link href="#" className="font-bold flex items-center">
            <ShoppingBasketIcon className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
              <h3 className="text-2xl">Nonna</h3>
            </Link>
            <div className="relative w-full max-w-[300px] h-[300px] mt-6 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Image 
                src="/Team.jpeg" 
                alt="Elite Performance Team" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
        </div>

        <Separator className="my-6" />
        <section className="flex justify-center">
          <h3>
            &copy; 2025 Designed and developed by
            <span
              className="text-primary transition-all border-primary hover:border-b-2 ml-1 cursor-pointer"
            >
              Elite Performance
            </span>
          </h3>
        </section>
      </div>
    </footer>
  );
};

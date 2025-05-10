"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="container w-full relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          squareSize={3}
          gridGap={4}
          color={isDark ? "#4B5563" : "#9CA3AF"}
          maxOpacity={0.2}
          flickerChance={0.03}
        />
      </div>
      
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32 relative z-10">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Design is out now! </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                Nonna
              </span>
              Groceries Management
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
              {`Make your groceries accessible to everyone`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
              Get Started
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";
import { ShoppingBasketIcon } from "lucide-react";
import React from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "../ui/sheet";
// import { Separator } from "../ui/separator";
// import { Button } from "../ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";

interface FeatureProps {
  title: string;
  description: string;
}

export const Navbar = () => {
  // const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <ShoppingBasketIcon className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        Nonna
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        {/* <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger> */}

          {/* <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          > */}
            {/* <SheetFooter className="flex-col sm:flex-col justify-start items-start"> */}
              <ToggleTheme />
            {/* </SheetFooter> */}
          {/* </SheetContent> */}
        {/* </Sheet> */}
      </div>

      <div className="hidden lg:flex">
        <ToggleTheme />
      </div>
    </header>
  );
};

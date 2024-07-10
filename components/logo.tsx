"use client";

import { Landmark, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2
  "
    >
      <Wallet className="stroke w-11 h-11 stroke-custom-purple stroke-[1.5]" />
      <p className="bg-gradient-to-r from-custom-purple via-custom-red to-custom-orange bg-clip-text text-3xl leading-tight tracking-tighter text-transparent font-medium">
        BudgetAnalysis
      </p>
    </Link>
  );
};

const LogoMobile = () => {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-2
  "
    >
      <p className="bg-gradient-to-r from-custom-purple via-custom-red to-custom-orange bg-clip-text text-3xl leading-tight tracking-tighter text-transparent font-medium">
        BudgetTracker
      </p>
    </Link>
  );
};

export { LogoMobile, Logo };

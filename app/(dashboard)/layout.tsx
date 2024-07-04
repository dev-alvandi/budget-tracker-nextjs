import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative h-screen w-full flex flex-col">
      <Navbar data-testid="navbar-component" />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;

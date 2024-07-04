import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center ">
      {children}
    </div>
  );
};

export default layout;

import { Logo } from "@/components/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative flex flex-col h-screen items-center justify-center border">
      <Logo />
      <div className="m-12">{children}</div>
    </div>
  );
};

export default AuthLayout;

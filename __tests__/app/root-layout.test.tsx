import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
// import { ClerkProvider } from "@clerk/nextjs";
// import RootProviders from "@/providers/root-providers";
// import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { ReactNode } from "react";

// Mock the ClerkProvider component
jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
}));

// Mock the Toaster component
jest.mock("@/components/ui/sonner", () => ({
  Toaster: ({ children }: { children: ReactNode }) => (
    <div data-testid="toaster-component">{children}</div>
  ),
}));

// Mock the RootProviders component
jest.mock("@/providers/root-providers", () => ({
  RootProviders: ({ children }: { children: ReactNode }) => (
    <div data-testid="root-providers">{children}</div>
  ),
}));

describe("RootLayout Component", () => {
  it("renders layout with ClerkProvider, Toaster, and RootProviders", () => {
    // Mock metadata for the page
    const metadata: Metadata = {
      title: "Budget Tracker",
      description: "A budget tracker app built on Next.js",
    };

    render(
      <RootLayout>
        <div data-testid="child-content">Test Child Content</div>
      </RootLayout>
    );

    // Check if ClerkProvider is rendered
    const clerkProviderElement = screen.getByTestId("clerk-provider");
    expect(clerkProviderElement).toBeInTheDocument();

    // Check if Toaster component is rendered
    const toasterElement = screen.getByTestId("toaster-component");
    expect(toasterElement).toBeInTheDocument();

    // Check if RootProviders component is rendered
    const rootProvidersElement = screen.getByTestId("root-providers");
    expect(rootProvidersElement).toBeInTheDocument();
  });
});

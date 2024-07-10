import { render, screen } from "@testing-library/react";
import DashboardLayout from "@/app/(dashboard)/layout";
import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

jest.mock("@/components/navbar", () => {
  <nav data-testid="mock-navbar">Navbar</nav>;
});

describe("Layout Component", () => {
  it.skip("renders Navbar component and child content", () => {
    const mockChildContent = (
      <div data-testid="child-content">Test Child Content</div>
    );

    render(
      <ClerkProvider>
        <DashboardLayout>{mockChildContent}</DashboardLayout>
      </ClerkProvider>
    );

    // Expect Navbar component to be rendered
    const navbarComponent = screen.getByTestId("navbar-component");
    expect(navbarComponent).toBeInTheDocument();

    // Expect child content to be rendered
    const childContent = screen.getByTestId("child-content");
    expect(childContent).toBeInTheDocument();
  });
});

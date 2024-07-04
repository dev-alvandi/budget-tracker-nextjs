import { render, screen } from "@testing-library/react";
import DashboardLayout from "@/app/(dashboard)/layout";
import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";

describe("Layout Component", () => {
  it("renders Navbar component and child content", () => {
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

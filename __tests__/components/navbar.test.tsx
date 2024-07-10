import { NavbarItem } from "@/components/navbar";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { NextRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: (): Partial<NextRouter> => ({
    pathname: "/transactions",
  }),
}));

describe("Logo component", () => {
  it("opens the correct link on click", async () => {
    render(
      // <RouterContext.Provider value={}>
      <NavbarItem link="/transactions" label="Transactions" />
      // </RouterContext.Provider>
    );

    const linkElement = screen.getByTestId("link-transactions", {
      exact: false,
    });

    fireEvent.click(linkElement);
    userEvent.click(linkElement);
    console.log(window.location.pathname);
    expect(window.location.pathname).toBe("/transactions");

    // expect(linkElement).toBeInTheDocument;
    // expect(linkElement).toHaveTextContent("Transactions");
  });
});

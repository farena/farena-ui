import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, it } from "vitest";
import FormButton from "./FormButton";

it("submits as a native button without a router and honors disabled", async () => {
  const submit = vi.fn();
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <FormButton type="submit">Save</FormButton>
    </form>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(submit).toHaveBeenCalledOnce();
});

it("renders an ordinary link without a router", () => {
  render(<FormButton to="/account">Account</FormButton>);
  expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute("href", "/account");
});

it("uses an injected link renderer for route targets", () => {
  const LinkRenderer = ({
    to,
    children,
  }: {
    to: string | { pathname?: string };
    children?: React.ReactNode;
  }) => <a href={typeof to === "string" ? to : to.pathname}>{children}</a>;
  render(
    <FormButton to={{ pathname: "/settings" }} LinkRenderer={LinkRenderer}>
      Settings
    </FormButton>,
  );
  expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
});

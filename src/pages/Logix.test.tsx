import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Login } from "./Login";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthProvider";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Login component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    );
  });
  it("Render component", () => {
    const title = screen.getByText("Welcome back");
    const text = screen.getByText("Sign in to your Video Organizer account");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /Sign in/i });

    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("Invalid email shows error", () => {
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "email" } });
    fireEvent.blur(emailInput);
    const error = screen.getByText("Invalid email format");
    expect(error).toBeInTheDocument();
  });

  it("Email is required", () => {
    const emailInput = screen.getByLabelText("Email");
    fireEvent.blur(emailInput);
    const error = screen.getByText("Email is required");
    expect(error).toBeInTheDocument();
  });

  it("Password is required", () => {
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.blur(passwordInput);
    const error = screen.getByText("Password is required");
    expect(error).toBeInTheDocument();
  });

  it("shows the backend error message when the user does not exist", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        json: async () => ({
          status: "Error",
          message: "User not found",
        }),
      } as Response);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/ });
    fireEvent.change(emailInput, { target: { value: "adsf@asdf.com" } });
    fireEvent.change(passwordInput, { target: { value: "1232141" } });
    fireEvent.click(submitBtn);
    expect(await screen.findByText("User not found")).toBeInTheDocument();
  });
});

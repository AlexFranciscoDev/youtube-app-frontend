import { Register } from "./Register";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Register component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>,
    );
  });
  it("Verify that register component is rendered correctly", () => {
    const title = screen.getByText("Create your account");
    const text = screen.getByText("Start organizing your favorite videos");
    const username = screen.getByLabelText("Username");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm password");
    const profileImage = screen.getByLabelText("Profile image");
    const button = screen.getByRole("button", {name: /Create account/i});
    const signInLink = screen.getByRole("link", {name: /Sign in/i});

    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(confirmPassword).toBeInTheDocument();
    expect(profileImage).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
  });
});

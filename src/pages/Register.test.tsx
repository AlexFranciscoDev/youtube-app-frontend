import { Register } from "./Register";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import userEvent from "@testing-library/user-event";

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
    const button = screen.getByRole("button", { name: /Create account/i });
    const signInLink = screen.getByRole("link", { name: /Sign in/i });

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

  describe("Username validation", () => {
    it("Username is required", async () => {
      const username = screen.getByLabelText("Username");
      fireEvent.blur(username);
      const errorRequired = screen.getByText("Username is required");
      expect(errorRequired).toBeInTheDocument();
    });

    it("Username must be at least 5 characters long", async () => {
      const user = userEvent.setup();
      const username = screen.getByLabelText("Username");
      await user.type(username, "alex");
      fireEvent.blur(username);
      const errorLength = screen.getByText(
        "Username must be at least 5 characters",
      );
      expect(errorLength).toBeInTheDocument();
    });

    it("Username must not contain spaces", async () => {
      const user = userEvent.setup();
      const username = screen.getByLabelText("Username");
      await user.type(username, "alex dev");
      fireEvent.blur(username);
      const errorSpaces = screen.getByText("Username cannot contain spaces");
      expect(errorSpaces).toBeInTheDocument();
    });

    it("Valid username", async () => {
      const user = userEvent.setup();
      const username = screen.getByLabelText("Username");
      await user.type(username, "alexdev");
      fireEvent.blur(username);
      expect(
        screen.queryByText("Username is required"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Username must be at least 5 characters"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Username cannot contain spaces"),
      ).not.toBeInTheDocument();
    });
  });
});

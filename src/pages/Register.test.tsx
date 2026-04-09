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

  describe("Email validation", () => {
    it("Check that email field is not empty", () => {
      const email = screen.getByLabelText("Email");
      fireEvent.blur(email);
      const errorEmail = screen.getByText("Email is required");
      expect(errorEmail).toBeInTheDocument();
    });

    it("Check that the email format has correct format", async () => {
      const user = userEvent.setup();
      const email = screen.getByLabelText("Email");
      await user.type(email, "notanemail");
      fireEvent.blur(email);
      const errorEmail = screen.getByText("Invalid email format");
      expect(errorEmail).toBeInTheDocument();
    });

    it("Check email has a correct format", async () => {
      const user = userEvent.setup();
      const email = screen.getByLabelText("Email");
      await user.type(email, "user@test.com");
      fireEvent.blur(email);
      expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Invalid email format"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Password validation", () => {
    it("Check that password field is not empty", () => {
      const password = screen.getByLabelText("Password");
      fireEvent.blur(password);
      const errorPassword = screen.getByText("Password is required");
      expect(errorPassword).toBeInTheDocument();
    });

    it("Check that password length is correct", async () => {
      const user = userEvent.setup();
      const password = screen.getByLabelText("Password");
      await user.type(password, "123");
      fireEvent.blur(password);
      const errorPassword = screen.getByText(
        "Password must be at least 5 characters",
      );
      expect(errorPassword).toBeInTheDocument();
    });

    it("Check that confirm password field is not empty", () => {
      const confirmPassword = screen.getByLabelText("Confirm password");
      fireEvent.blur(confirmPassword);
      const errorConfirmPassword = screen.getByText(
        "Please confirm your password",
      );
      expect(errorConfirmPassword).toBeInTheDocument();
    });

    it("Check that password and confirm password match", async () => {
      const user = userEvent.setup();
      const password = screen.getByLabelText("Password");
      const confirmPassword = screen.getByLabelText("Confirm password");
      await user.type(password, "12345");
      await user.type(confirmPassword, "99999");
      fireEvent.blur(confirmPassword);
      const error = screen.getByText("Passwords do not match");
      expect(error).toBeInTheDocument();
    });

    it("Check password and confirm password are valid", async () => {
      const user = userEvent.setup();
      const password = screen.getByLabelText("Password");
      const confirmPassword = screen.getByLabelText("Confirm password");
      await user.type(password, "12345");
      await user.type(confirmPassword, "12345");
      fireEvent.blur(confirmPassword);
      expect(
        screen.queryByText("Password is required"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Password must be at least 5 characters"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Please confirm your password"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Passwords do not match"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty submit", () => {
    it("Show all errors and don't fetch", () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(vi.fn());
      const button = screen.getByRole("button", { name: /Create account/i });
      fireEvent.click(button);
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(
        screen.getByText("Please confirm your password"),
      ).toBeInTheDocument();
      expect(screen.getByText("Profile image is required")).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe("Upload image displays preview", () => {
    beforeEach(() => {
      vi.stubGlobal("URL", {
        createObjectURL: vi.fn(() => "blob:fake-url"),
        revokeObjectURL: vi.fn(),
      });
    });
    afterEach(() => {
      vi.unstubAllGlobals()
    })
    it("Display picture review", () => {
      // Create fake file
      const fakeFile = new File(["fake content"], "profile-picture.png", {
        type: "image/png",
      });
      // Simulate upload
      const inputImage = screen.getByLabelText("Profile image");
      fireEvent.change(inputImage, { target: { files: [fakeFile] } });
      // Verify preview
      const preview = screen.getByAltText("Profile preview");
      expect(preview).toHaveAttribute("src", "blob:fake-url");
    });
  });
});

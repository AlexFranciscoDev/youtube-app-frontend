import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Login } from "./Login";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthProvider";
import userEvent from "@testing-library/user-event";
import * as AuthContextModule from "../context/AuthContext";

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

  afterEach(() => {
    vi.restoreAllMocks();
    navigateMock.mockReset();
  });

  it("Render login component", () => {
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

  it("Password is not valid", () => {
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/ });
    fireEvent.change(passwordInput, { target: { value: "12" } });
    fireEvent.click(submitBtn);
    const error = screen.getByText("Password must be at least 5 characters");
    expect(error).toBeInTheDocument();
  });

  it("Password is required", () => {
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.blur(passwordInput);
    const error = screen.getByText("Password is required");
    expect(error).toBeInTheDocument();
  });

  it("shows the backend error message when the User is not found", async () => {
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

  it("Show errors and doesnt't fetch if the form is not valid", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(vi.fn());
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/ });
    fireEvent.change(emailInput, { target: { value: "adsedqw@dawdw.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitBtn);
    const errorPassword = await screen.findByText(
      "Password must be at least 5 characters",
    );
    expect(errorPassword).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("Checks that fetch calls the right data", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({
        status: "Success",
        user: {
          id: "1",
          name: "Alex",
          email: "alex@alex.com",
        },
        token: "fake-token",
      }),
    } as Response);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/ });

    await user.type(emailInput, "alex@alex.com");
    await user.type(passwordInput, "123456");
    await user.click(submitBtn);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, options] = fetchSpy.mock.calls[0];
    const body = JSON.parse(options?.body as string);

    expect(url).toBe("http://localhost:3000/api/user/login");
    expect(options?.method).toBe("POST");
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(body).toEqual({
      email: "alex@alex.com",
      password: "123456",
    });
  });

  it("calls login with the user and token when the backend responds successfully", async () => {
    const user = userEvent.setup();

    const loginMock = vi.fn();

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      isLoggedIn: false,
      user: null,
      token: null,
      login: loginMock,
      logout: vi.fn(),
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        status: "Success",
        user: {
          id: "1",
          username: "Alex",
          email: "alex@alex.com",
        },
        token: "fake-token",
      }),
    } as Response);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/ });

    await user.type(emailInput, "alex@alex.com");
    await user.type(passwordInput, "123456");
    await user.click(submitBtn);

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(loginMock).toHaveBeenCalledWith(
      {
        id: "1",
        username: "Alex",
        email: "alex@alex.com",
      },
      "fake-token",
    );
  });

  it("navigates to home when login succeeds", async () => {
    const user = userEvent.setup();

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      isLoggedIn: false,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({
        status: "Success",
        user: {
          id: "1",
          username: "Alex",
          email: "alex@alex.com",
        },
        token: "fake-token",
      }),
    } as Response);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/i });

    await user.type(emailInput, "alex@alex.com");
    await user.type(passwordInput, "123456");
    await user.click(submitBtn);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("shows the fetch error message when the request fails", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network error"),
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: /Sign in/i });

    await user.type(emailInput, "alex@alex.com");
    await user.type(passwordInput, "123456");
    await user.click(submitBtn);

    expect(await screen.findByText("Network error")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});

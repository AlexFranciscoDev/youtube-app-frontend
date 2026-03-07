import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./AuthForm.css";
import { validateEmail, validatePassword } from "../utils/validators";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Global } from "../helpers/Global";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorUser, setErrorUser] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrorEmail(emailError);
    setErrorPassword(passwordError);
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;
    // Set loading before fetching the data
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch(Global.url + "user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      // Set error message if there's any
      if (data.status === "Error") {
        setErrorUser(data.message);
        return;
      }
      // In case there was already an error. Clean the state
      setErrorUser("");
      // Add the data to local storage
      login(data.user, data.token);
      // Redirect to main page.
      navigate("/");
    } catch (error: unknown) {
      setErrorUser(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !errorEmail && !errorPassword;

  const passwordType = showPassword ? "text" : "password";
  const passwordLabel = showPassword ? "Hide password" : "Show password";
  const passwordIcon = showPassword ? faEyeSlash : faEye;

  return (
    <div className="auth-page">
      <section className="auth-card">
        {isLoading && (
          <div className="auth-overlay" aria-live="polite">
            <div className="auth-spinner" role="status" aria-label="Loading">
              <span className="auth-spinner__dot" />
            </div>
          </div>
        )}
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-description">
          Sign in to your Video Organizer account
        </p>
        {errorUser && <span className="auth-error">{errorUser}</span>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className={`auth-input${errorEmail ? " auth-input--error" : ""}`}
              type="email"
              placeholder="tu@email.com"
              onChange={(event) => {
                setEmail(event.target.value);
                if (touched.email)
                  setErrorEmail(validateEmail(event.target.value));
              }}
              onBlur={(event) => {
                setTouched((prev) => ({ ...prev, email: true }));
                setErrorEmail(validateEmail(event.target.value));
              }}
            />
            {errorEmail && <span className="auth-error">{errorEmail}</span>}
          </div>
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">Password</label>
              <a href="#" className="auth-link">
                Forgot your password?
              </a>
            </div>
            <div className="password-wrapper">
              <input
                id="password"
                className={`auth-input${errorPassword ? " auth-input--error" : ""}`}
                type={passwordType}
                placeholder="*******"
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (touched.password)
                    setErrorPassword(validatePassword(event.target.value));
                }}
                onBlur={(event) => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setErrorPassword(validatePassword(event.target.value));
                }}
              />
              <button
                type="button"
                aria-label={passwordLabel}
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={passwordIcon} />
              </button>
            </div>
            {errorPassword && (
              <span className="auth-error">{errorPassword}</span>
            )}
          </div>
          <button type="submit" className="auth-submit" disabled={!isFormValid || isLoading}>
            Sign in
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </section>
    </div>
  );
};

import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./AuthForm.css";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
  validateProfileImage,
} from "../utils/validators";
import { Global } from "../helpers/Global";
import { useNavigate } from "react-router";

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorProfileImage, setErrorProfileImage] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [messageRegister, setMessageRegister] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    profileImage: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      confirmPassword,
      password,
    );
    const profileImageError = validateProfileImage(profileImage);
    setErrorUsername(usernameError);
    setErrorEmail(emailError);
    setErrorPassword(passwordError);
    setErrorConfirmPassword(confirmPasswordError);
    setErrorProfileImage(profileImageError);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      profileImage: true,
    });

    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      profileImageError
    )
      return;

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) formData.append("image", profileImage);

      const response = await fetch(Global.url + "user/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "Error") {
        setRegisterSuccess(data.status);
        setMessageRegister(data.message);
        return;
      }
      setRegisterSuccess(data.status);
      setMessageRegister(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid =
    !errorUsername &&
    !errorEmail &&
    !errorPassword &&
    !errorConfirmPassword &&
    !errorProfileImage;

  const passwordType = showPassword ? "text" : "password";
  const passwordLabel = showPassword ? "Hide password" : "Show password";
  const passwordIcon = showPassword ? faEyeSlash : faEye;
  const confirmType = showConfirmPassword ? "text" : "password";
  const confirmLabel = showConfirmPassword ? "Hide password" : "Show password";
  const confirmIcon = showConfirmPassword ? faEyeSlash : faEye;

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">
          <FontAwesomeIcon icon={faPlay} />
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-description">
          Start organizing your favorite videos
        </p>
        {registerSuccess ? (
          <span className="auth-success">{messageRegister}</span>
        ) : (
          <span className="auth-error">{messageRegister}</span>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              className={`auth-input${errorUsername ? " auth-input--error" : ""}`}
              type="text"
              placeholder="@tu_usuario"
              onChange={(event) => {
                setUsername(event.target.value);
                if (touched.username)
                  setErrorUsername(validateUsername(event.target.value));
              }}
              onBlur={(event) => {
                setTouched((prev) => ({ ...prev, username: true }));
                setErrorUsername(validateUsername(event.target.value));
              }}
            />
            {errorUsername && (
              <span className="auth-error">{errorUsername}</span>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <div className="password-wrapper">
              <input
                id="register-password"
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
          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
                className={`auth-input${errorConfirmPassword ? " auth-input--error" : ""}`}
                type={confirmType}
                placeholder="*******"
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (touched.confirmPassword)
                    setErrorConfirmPassword(
                      validateConfirmPassword(event.target.value, password),
                    );
                }}
                onBlur={(event) => {
                  setTouched((prev) => ({ ...prev, confirmPassword: true }));
                  setErrorConfirmPassword(
                    validateConfirmPassword(event.target.value, password),
                  );
                }}
              />
              <button
                type="button"
                aria-label={confirmLabel}
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <FontAwesomeIcon icon={confirmIcon} />
              </button>
            </div>
            {errorConfirmPassword && (
              <span className="auth-error">{errorConfirmPassword}</span>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="register-profileimage">Profile image</label>
            <input
              id="register-profileimage"
              className={`auth-input${errorProfileImage ? " auth-input--error" : ""}`}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setProfileImage(file);
                setPreviewSrc((prev) => {
                  if (prev) URL.revokeObjectURL(prev)
                  return file ? URL.createObjectURL(file) : null
                })
                if (touched.profileImage)
                  setErrorProfileImage(validateProfileImage(file));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, profileImage: true }));
                setErrorProfileImage(validateProfileImage(profileImage));
              }}
            />
            {errorProfileImage && (
              <span className="auth-error">{errorProfileImage}</span>
            )}
          </div>
          {previewSrc && (
            <div className="auth-field">
              <span className="text-left">Preview:</span>
              <img
                src={previewSrc}
                alt="Profile-image-review"
                className="profile-preview"
              />
            </div>
          )}
          <button type="submit" className="auth-submit" disabled={!isFormValid}>
            Create account
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
};

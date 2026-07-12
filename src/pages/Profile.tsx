import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendar,
  faVideo,
  faCamera,
  faLock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import VideoCard from "../components/VideoCard";
import { PasswordInput } from "../components/PasswordInput";
import "./Profile.css";
import "./AuthForm.css";
import { Global } from "../helpers/Global";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword, validateConfirmPassword } from "../utils/validators";

type User = {
  id: string;
  username: string;
  email: string;
  image: string;
  createdAt: string;
};

type Video = {
  id: string;
  user: { _id: string; username: string; email: string };
  title: string;
  url: string;
  category: { name: string; description: string };
  platform: string;
  image: string;
  createdAt: string;
};

type FeedbackMessage = { text: string; isError: boolean };

// Can display, logged in profile or other profile
export const Profile = () => {
  const token = localStorage.getItem("token");
  const params = useParams();
  const { user: authUser, login } = useAuth();
  const [user, setUser] = useState<Partial<User>>({});
  const [videos, setVideos] = useState<Video[]>([]);

  const isOwnProfile = !!authUser && authUser.id === params.id;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [imageMessage, setImageMessage] = useState<FeedbackMessage | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<FeedbackMessage | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      const url = `${Global.url}user/profile/${params.id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
          },
        });
        const data = await response.json();
        console.log(data);
        setUser({
          username: data.user.username,
          email: data.user.email,
          image: data.user.image,
          createdAt: data.user.createdAt,
        });
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    };
    getUserData();

    const getUsersVideo = async () => {
      const url = `${Global.url}video/user/${params.id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
          },
        });
        const data = await response.json();

        const sortedVideos = [...data.videos].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

        if (response.ok) setVideos(sortedVideos ?? []);
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    };
    getUsersVideo();
  }, [token, params.id]);


  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUpdatingImage(true);
    setImageMessage(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${Global.url}user/profile`, {
        method: "PUT",
        headers: { Authorization: token ?? "" },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setImageMessage({ text: data.message ?? "Could not update the profile picture", isError: true });
        return;
      }

      setUser((prev) => ({ ...prev, image: data.user.image }));
      if (authUser) login({ ...authUser, image: data.user.image }, token ?? "");
      setImageMessage({ text: "Profile picture updated", isError: false });
    } catch {
      setImageMessage({ text: "Something went wrong, please try again", isError: true });
    } finally {
      setIsUpdatingImage(false);
      event.target.value = "";
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordMessage(null);
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentPasswordError = passwordForm.currentPassword ? "" : "Current password is required";
    const newPasswordError = validatePassword(passwordForm.newPassword);
    const confirmPasswordError = validateConfirmPassword(passwordForm.confirmPassword, passwordForm.newPassword);

    setPasswordErrors({
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });

    if (currentPasswordError || newPasswordError || confirmPasswordError) return;

    setIsSubmittingPassword(true);
    setPasswordMessage(null);
    try {
      const response = await fetch(`${Global.url}user/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ?? "" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          password: passwordForm.newPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({ text: data.message ?? "Could not update the password", isError: true });
        return;
      }

      setPasswordMessage({ text: "Password updated correctly", isError: false });
      setTimeout(closePasswordModal, 1500);
    } catch {
      setPasswordMessage({ text: "Something went wrong, please try again", isError: true });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-layout">
        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="profile-hero">
            <div className="profile-avatar-wrap">
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile_picture"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
            </div>
            <h1 className="profile-hero__name">@{user.username ?? "—"}</h1>
            <p className="profile-hero__email">{user.email ?? "—"}</p>
            <span className="profile-hero__since">
              <FontAwesomeIcon icon={faCalendar} />
              Member since {formatDate(user.createdAt)}
            </span>
          </div>

          <div className="profile-stat">
            <FontAwesomeIcon icon={faVideo} className="profile-stat__icon" />
            <span className="profile-stat__value">{videos.length}</span>
            <span className="profile-stat__label">Videos</span>
          </div>

          {isOwnProfile && (
            <div className="profile-actions">
              <p className="profile-info__title">Edit profile</p>

              <button
                type="button"
                className="profile-action-btn"
                onClick={handleChangePictureClick}
                disabled={isUpdatingImage}
              >
                <FontAwesomeIcon icon={faCamera} />
                {isUpdatingImage ? "Uploading..." : "Change profile picture"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
              {imageMessage && (
                <span className={imageMessage.isError ? "auth-error" : "auth-success"}>
                  {imageMessage.text}
                </span>
              )}

              <button
                type="button"
                className="profile-action-btn profile-action-btn--secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                <FontAwesomeIcon icon={faLock} />
                Change password
              </button>
            </div>
          )}
        </aside>

        {/* ── Main: video grid ── */}
        <main className="profile-main">
          <div className="profile-main__header">
            <h2 className="profile-main__title">Videos</h2>
            <span className="profile-main__count">
              {videos.length} videos found
            </span>
          </div>

          <div className="profile__grid">
            {videos.length === 0 ? (
              <div className="profile__empty">
                <FontAwesomeIcon
                  icon={faVideo}
                  className="profile__empty-icon"
                />
                <p className="profile__empty-text">No videos yet</p>
              </div>
            ) : (
              videos.map((video) => (
                <VideoCard
                  key={video.id}
                  user={video.user}
                  title={video.title}
                  url={video.url}
                  category={video.category}
                  platform={video.platform}
                  image={video.image}
                  createdAt={video.createdAt}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => !isSubmittingPassword && closePasswordModal()}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={closePasswordModal}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3 className="modal-title">Change password</h3>
            {passwordMessage && (
              <span className={passwordMessage.isError ? "auth-error" : "auth-success"}>
                {passwordMessage.text}
              </span>
            )}
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <div className="auth-field">
                <label htmlFor="current-password">Current password</label>
                <PasswordInput
                  id="current-password"
                  hasError={!!passwordErrors.currentPassword}
                  ariaLabel={passwordErrors.currentPassword ? "Hide password" : "Show password"}
                  onChange={(value) => {
                    setPasswordForm((prev) => ({ ...prev, currentPassword: value }))
                    setPasswordErrors((prev) => ({ ...prev, currentPassword: value ? "" : prev.currentPassword }))
                  }}
                  onBlur={(value) =>
                    setPasswordErrors((prev) => ({
                      ...prev,
                      currentPassword: value ? "" : "Current password is required",
                    }))
                  }
                />
                {passwordErrors.currentPassword && (
                  <span className="auth-error">{passwordErrors.currentPassword}</span>
                )}
              </div>
              <div className="auth-field">
                <label htmlFor="new-password">New password</label>
                <PasswordInput
                  id="new-password"
                  hasError={!!passwordErrors.newPassword}
                  ariaLabel={passwordErrors.newPassword ? "Hide password" : "Show password"}
                  onChange={(value) => {
                    setPasswordForm((prev) => ({ ...prev, newPassword: value }))
                    setPasswordErrors((prev) => ({ ...prev, newPassword: validatePassword(value) }))
                  }}
                  onBlur={(value) =>
                    setPasswordErrors((prev) => ({ ...prev, newPassword: validatePassword(value) }))
                  }
                />
                {passwordErrors.newPassword && (
                  <span className="auth-error">{passwordErrors.newPassword}</span>
                )}
              </div>
              <div className="auth-field">
                <label htmlFor="confirm-new-password">Confirm new password</label>
                <PasswordInput
                  id="confirm-new-password"
                  hasError={!!passwordErrors.confirmPassword}
                  ariaLabel={passwordErrors.confirmPassword ? "Hide password" : "Show password"}
                  onChange={(value) => {
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: value }))
                    setPasswordErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(value, passwordForm.newPassword),
                    }))
                  }}
                  onBlur={(value) =>
                    setPasswordErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(value, passwordForm.newPassword),
                    }))
                  }
                />
                {passwordErrors.confirmPassword && (
                  <span className="auth-error">{passwordErrors.confirmPassword}</span>
                )}
              </div>
              <button type="submit" className="auth-submit" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

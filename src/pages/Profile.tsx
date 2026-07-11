import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendar,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import VideoCard from "../components/VideoCard";
import "./Profile.css";
import { Global } from "../helpers/Global";
import { useParams } from "react-router-dom";

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

// Can display, logged in profile or other profile
export const Profile = () => {
  const token = localStorage.getItem("token");
  const params = useParams();
  const [user, setUser] = useState<Partial<User>>({});
  const [videos, setVideos] = useState<Video[]>([]);

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

          <div className="profile-info">
            <p className="profile-info__title">Account information</p>

            <div className="profile-info-row">
              <span className="profile-info-row__label">
                <FontAwesomeIcon icon={faUser} />
                Username
              </span>
              <span className="profile-info-row__value">
                @{user.username ?? "—"}
              </span>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-row__label">
                <FontAwesomeIcon icon={faEnvelope} />
                Email
              </span>
              <span className="profile-info-row__value">
                {user.email ?? "—"}
              </span>
            </div>
          </div>
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
    </div>
  );
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTag,
  faCalendar,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Global } from "../helpers/Global";
import VideoCard from "../components/VideoCard";
import "./VideoDetail.css";

type Video = {
  _id: string;
  user: { _id: string; username: string; email: string };
  title: string;
  description: string;
  url: string;
  category: { name: string; description: string };
  platform: string;
  image: string;
  createdAt: string;
};

const formatDateEnglish = (dateProp: string) => {
  const date = new Date(dateProp);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const VideoDetail = () => {
  const { id } = useParams(); // Guardamos el id de la url
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // TODO (paso 6): sustituir por un fetch a GET /video/user/:id
  const related: Video[] = [];

  useEffect(() => {
    getVideo();
  }, [id]);

  const getVideo = async () => {
    const token = localStorage.getItem("token");
    const url = `${Global.url}video/${id}`;
    try {
      if (!token) {
        throw new Error("No token available");
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) throw new Error("Error getting the video");
      const data = await response.json();
      setVideo(data.video);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      setError(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !video) return <p>{error || "Video not found"}</p>;

  return (
    <div className="video-detail-page">
      <Link to="/" className="video-detail__back">
        <FontAwesomeIcon icon={faChevronLeft} />
        Back to feed
      </Link>

      <div className="video-detail__player">
        <img
          src={video.image}
          alt="video thumbnail"
          className="video-detail__player-image"
        />
        <span className="video-detail__platform-badge">{video.platform}</span>
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="video-detail__play-btn"
          aria-label={`Watch on ${video.platform}`}
        >
          <FontAwesomeIcon icon={faPlay} />
        </a>
      </div>

      <div className="video-detail__content">
        <h1 className="video-detail__title">{video.title}</h1>

        <div className="video-detail__meta">
          <Link
            to={`/profile/${video.user._id}`}
            className="video-detail__author"
          >
            <FontAwesomeIcon icon={faUser} className="video-detail__icon" />
            @{video.user.username}
          </Link>
          <span className="video-detail__meta-divider" />
          <span className="video-detail__date">
            <FontAwesomeIcon icon={faCalendar} className="video-detail__icon" />
            {formatDateEnglish(video.createdAt)}
          </span>
          <span className="video-detail__tag">
            <FontAwesomeIcon icon={faTag} className="video-detail__icon" />
            {video.category.name}
          </span>
        </div>

        <p className="video-detail__description">{video.description}</p>

        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="video-detail__external-btn"
        >
          Watch on {video.platform}
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </div>

      {related.length > 0 && (
        <div className="video-detail__related">
          <h2 className="video-detail__related-title">
            More from @{video.user.username}
          </h2>
          <div className="video-detail__related-grid">
            {related.map((item) => (
              <VideoCard
                key={item._id}
                _id={item._id}
                user={item.user}
                title={item.title}
                url={item.url}
                category={item.category}
                platform={item.platform}
                image={item.image}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

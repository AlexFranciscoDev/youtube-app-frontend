import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTag,
  faCalendar,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faPlay,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Global } from "../helpers/Global";
import VideoCard from "../components/VideoCard";
import { EditVideoModal } from "../components/EditVideoModal";
import { DeleteVideoModal } from "../components/DeleteVideoModal";
import "./VideoDetail.css";

type Video = {
  _id: string;
  user: { _id: string; username: string; email: string };
  title: string;
  description: string;
  url: string;
  category: { _id: string; name: string; description: string };
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
  const [related, setRelated] = useState<Video[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); //Used to know if we are deleting the post.
  const [deleteError, setDeleteError] = useState(""); // Used to display an error if there's any
  const navigate = useNavigate();

  useEffect(() => {
    getVideo();
  }, [id]);

  useEffect(() => {
    if (!video) return;
    getRelatedVideos(video.category._id, video._id);
  }, [video]);

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

  const getRelatedVideos = async (
    categoryId: string,
    currentVideoId: string,
  ) => {
    const token = localStorage.getItem("token");
    const url = `${Global.url}video/category/${categoryId}`;
    try {
      if (!token) return;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      const videosFound = (data.videosFound as Video[]) ?? [];
      setRelated(videosFound.filter((v) => v._id !== currentVideoId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteVideo = async () => {
    setDeleteError("");
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    const url = `${Global.url}video/${id}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? "",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setDeleteError(data.message ?? "Could not delete the video");
        setIsDeleting(false);
        return;
      }
      // Keep isDeleting true for these 3s so the modal keeps showing "Deleting..."
      // right up until we navigate away — no need to reset it on success.
      setTimeout(() => {
        navigate("/"); // We've just deleted the video, so we navigate to the homepage
      }, 3000);
    } catch (error: unknown) {
      console.log(error);
      setDeleteError("Something went wrong, please try again");
      setIsDeleting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !video) return <p>{error || "Video not found"}</p>;

  return (
    <div className="video-detail-page">
      <div className="video-detail__top-bar">
        <Link to="/" className="video-detail__back">
          <FontAwesomeIcon icon={faChevronLeft} />
          Back to feed
        </Link>

        <div className="video-detail-buttons">
          <button
            type="button"
            className="video-detail__edit-btn"
            onClick={() => setShowEditModal(true)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit video
          </button>
          <button
            type="button"
            className="video-detail__edit-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete video
          </button>
        </div>
      </div>

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
            <FontAwesomeIcon icon={faUser} className="video-detail__icon" />@
            {video.user.username}
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
          <h2 className="video-detail__related-title">Related videos</h2>
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

      {showEditModal && (
        <EditVideoModal
          video={video}
          onClose={() => setShowEditModal(false)}
          onSaved={() => getVideo()}
        />
      )}

      {showDeleteModal && (
        <DeleteVideoModal
          video={video}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteVideo}
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  );
};

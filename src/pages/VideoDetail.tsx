import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTag,
  faCalendar,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import "./VideoDetail.css";

// Placeholder data so the design can be reviewed before the real
// fetch/routing logic is wired up.
const mockVideo = {
  title: "How to communicate like an adult (rare skill)",
  description:
    "A short breakdown of the communication habits that actually make conversations easier: how to disagree without escalating, how to ask for what you need directly, and why most 'conflicts' are really just two people who never said the quiet part out loud.",
  url: "https://www.youtube.com/watch?v=uldljvvm3017wwkgf",
  platform: "Youtube",
  image:
    "https://res.cloudinary.com/demo/image/upload/v1783894749/youtube-thumbnails/uldljvvm3017wwkgf.jpg",
  category: { name: "Gym", description: "" },
  user: { _id: "1", username: "pruebaaa", email: "prueba@prueba.com" },
  createdAt: "2026-07-12T00:00:00.000Z",
};

const mockRelated = [
  {
    id: "2",
    user: mockVideo.user,
    title: "asdasd",
    url: "https://www.youtube.com/watch?v=abc123",
    category: { name: "Gym", description: "" },
    platform: "Youtube",
    image: mockVideo.image,
    createdAt: "2026-07-13T00:00:00.000Z",
  },
  {
    id: "3",
    user: mockVideo.user,
    title: "5 minute mobility routine for desk workers",
    url: "https://www.youtube.com/watch?v=def456",
    category: { name: "Gym", description: "" },
    platform: "Youtube",
    image: mockVideo.image,
    createdAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "4",
    user: mockVideo.user,
    title: "Why most people quit the gym in February",
    url: "https://www.youtube.com/watch?v=ghi789",
    category: { name: "Gym", description: "" },
    platform: "Youtube",
    image: mockVideo.image,
    createdAt: "2026-07-08T00:00:00.000Z",
  },
];

const formatDateEnglish = (dateProp: string) => {
  const date = new Date(dateProp);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const VideoDetail = () => {
  const video = mockVideo;
  const related = mockRelated;

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
                key={item.id}
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

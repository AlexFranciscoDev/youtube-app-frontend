import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter, faTableCells, faBars } from '@fortawesome/free-solid-svg-icons'
import VideoCard from '../components/VideoCard';
import './Home.css'

type Video = {
  id: string,
  user: { username: string; email: string },
  title: string,
  url: string,
  category: { name: string, description: string },
  platform: string,
  image: string,
  createdAt: string
}

export const Home = () => {
  const token = localStorage.getItem("token");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getVideos();
  }, [])

  const getVideos = async () => {
    const url = "http://localhost:3000/api/video/";
    try {
      if (!token) {
        throw new Error("No token available");
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      });
      if (!response.ok) throw new Error("Error getting the videos");
      const data = await response.json();
      setVideos(data.videos);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      setError(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="home">

      {/* Top bar */}
      <div className="home__topbar">
        <div className="home__search-wrapper">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="home__search-icon" />
          <input
            type="text"
            className="home__search"
            placeholder="Search videos..."
          />
        </div>

        <div className="home__controls">
          <button className="home__filter-btn">
            <FontAwesomeIcon icon={faFilter} />
            All platforms
          </button>
          <button className="home__filter-btn">
            <FontAwesomeIcon icon={faFilter} />
            All categories
          </button>
          <div className="home__view-toggle">
            <button className="home__view-btn home__view-btn--active" aria-label="Grid view">
              <FontAwesomeIcon icon={faTableCells} />
            </button>
            <button className="home__view-btn" aria-label="List view">
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="home__statusbar">
        <label className="home__select-all">
          <input type="checkbox" />
          Select all
        </label>
        <span className="home__count">{videos.length} videos found</span>
      </div>


      {isLoading ?
        (<p>Loading...</p>)
        : error ?
          (<p>{error}</p>)
          :
          (<div className="home__grid">
            {videos.map((video) =>
              <VideoCard
                key={video._id}
                user={video.user}
                title={video.title}
                url={video.url}
                category={video.category}
                platform={video.platform}
                image={video.image}
                createdAt={video.createdAt}
              />)
            }
          </div>)
      }

    </div>
  )
}

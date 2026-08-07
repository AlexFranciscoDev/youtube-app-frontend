import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Global } from "../helpers/Global";
import "./Category.css";

/**
 * Página que muestra los vídeos de una categoría concreta (ruta /category/:id).
 *
 * TODO (lógica pendiente, a implementar por el usuario):
 * - Usar el `id` de useParams() para pedir al backend los vídeos de esa categoría
 *   (ver getVideosByCategory en el backend, similar a getVideosByUser en Profile.tsx).
 * - Guardar en estado: la categoría (nombre/descripción) y la lista de vídeos.
 * - Manejar isLoading / error, mismo patrón que Home.tsx / Categories.tsx.
 * - Sustituir el placeholder del título y el grid de abajo por los datos reales,
 *   mapeando cada vídeo a un <VideoCard key={video._id} {...video} />
 *   (mismo componente que ya usan Home.tsx y VideoDetail.tsx).
 */
type Video = {
  _id: string;
  user: { _id: string; username: string; email: string };
  title: string;
  url: string;
  category: { name: string; description: string } | null;
  platform: string;
  image: string;
  createdAt: string;
};

export const Category = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getVideosByCategory();
  }, [])
  
  const getVideosByCategory = async () => {
    const url = Global.url + 'video/category/' + id;
    try {
      // Check if the token is available
      if (!token) {
        throw new Error('No token available');
      }
      // Fetching response
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'applicastion/json',
          Authorization: token
        }
      })
      // If ders no videos available return
      if (response.status === 404) {
        setVideos([]);
        return;
      }
      // If ders an error, throw an error
      if (!response.ok) throw new Error("Error getting the videos");

      // Otherwise, set data
      const data = await response.json();
      setVideos(data.videosFound);
      // TODO: VINCULAR INFORMACIÓN EN EL HTML
    } catch(error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      setError(message);
      console.error(message)
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="category-page">
      <Link to="/category" className="category-page__back">
        <FontAwesomeIcon icon={faChevronLeft} />
        Back to categories
      </Link>

      <div className="category-page__header">
        <h1 className="category-page__title">Category {id}</h1>
        <span className="category-page__count">{videos.length} videos found</span>
      </div>

      {/* Loading state, igual que en Home.tsx: {isLoading ? <p>Loading...</p> : ...} */}

      {/* Error state, igual que en Home.tsx: {error ? <p>{error}</p> : ...} */}

      <div className="category-page__grid">
        {/* videos.map((video) => (
          <VideoCard
            key={video._id}
            _id={video._id}
            user={video.user}
            title={video.title}
            url={video.url}
            category={video.category}
            platform={video.platform}
            image={video.image}
            createdAt={video.createdAt}
          />
        )) */}
      </div>
    </div>
  );
};

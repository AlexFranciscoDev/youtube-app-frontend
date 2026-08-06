import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
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
export const Category = () => {
  const { id } = useParams();

  return (
    <div className="category-page">
      <Link to="/category" className="category-page__back">
        <FontAwesomeIcon icon={faChevronLeft} />
        Back to categories
      </Link>

      <div className="category-page__header">
        <h1 className="category-page__title">Category {id}</h1>
        <span className="category-page__count">0 videos found</span>
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

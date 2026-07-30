import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./EditVideoModal.css"; // reutilizamos .modal-overlay/.modal-card/.modal-close de aquí
import "./DeleteVideoModal.css"; // estilos propios de este modal (icono, textos, botones)

type Video = {
  _id: string;
  title: string;
};

interface DeleteVideoModalProps {
  video: Video; // el vídeo a borrar, solo necesitamos su título para el mensaje
  onClose: () => void; // "cancelar": cierra el modal sin hacer nada
  onConfirm: () => void; // "confirmar": aquí es donde el padre disparará el DELETE
  isDeleting?: boolean; // true mientras la petición DELETE está en curso (lo controla el padre)
  error?: string; // mensaje de error si el DELETE falla (lo controla el padre)
}

export const DeleteVideoModal = ({
  video,
  onClose,
  onConfirm,
  isDeleting = false, // valor por defecto si el padre no lo pasa
  error = "",
}: DeleteVideoModalProps) => {
  return (
    // Capa que cubre toda la pantalla (fondo oscuro semitransparente).
    // Si el usuario hace click en esta capa (fuera de la tarjeta) y no estamos borrando, cerramos el modal.
    <div className="modal-overlay" onClick={() => !isDeleting && onClose()}>
      {/* La tarjeta blanca del modal. stopPropagation evita que un click DENTRO
          de la tarjeta "burbujee" hasta el overlay y cierre el modal sin querer. */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Botón "X" arriba a la derecha, misma acción que Cancel */}
        <button
          type="button"
          className="modal-close"
          aria-label="Close" // texto para lectores de pantalla, no se ve visualmente
          onClick={onClose}
          disabled={isDeleting} // no se puede cerrar a media petición
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Círculo rojo con el icono de aviso (⚠), puramente decorativo */}
        <div className="delete-video__icon-wrapper">
          <FontAwesomeIcon icon={faTriangleExclamation} className="delete-video__icon" />
        </div>

        <h2 className="delete-video__title">Delete video</h2>
        <p className="delete-video__message">
          {/* Interpolamos el título del vídeo dentro del texto de confirmación */}
          Are you sure you want to delete <strong>“{video.title}”</strong>? This action
          cannot be undone.
        </p>

        {/* Solo se renderiza si `error` tiene contenido (string vacío = falsy en JS) */}
        {error && <span className="edit-video-error">{error}</span>}

        <div className="delete-video__actions">
          <button
            type="button"
            className="delete-video__cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-video__confirm-btn"
            onClick={onConfirm} // aquí el padre engancha su lógica de borrado
            disabled={isDeleting}
          >
            {/* Texto dinámico: cambia mientras se está borrando */}
            {isDeleting ? "Deleting..." : "Delete video"}
          </button>
        </div>
      </div>
    </div>
  );
};

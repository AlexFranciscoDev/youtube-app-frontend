import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Global, resolveUploadUrl } from "../helpers/Global";
import { useUploadForm } from "../hooks/useUploadForm";
import "../pages/Upload.css";
import "./EditVideoModal.css";

type Video = {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: { _id: string; name: string };
  platform: string;
  image: string;
};

interface EditVideoModalProps {
  video: Video;
  onClose: () => void;
  onSaved: (video: unknown) => void;
}

export const EditVideoModal = ({ video, onClose, onSaved }: EditVideoModalProps) => {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [submitError, setSubmitError] = useState("");

  const {
    values,
    errors,
    previewSrc,
    isSubmitting,
    isThumbnailLoading,
    isInstagramUrl,
    isUnsupportedPlatform,
    setIsSubmitting,
    handleTextChange,
    handleImageChange,
    handleBlur,
    handleUrlBlur,
    validateForm,
  } = useUploadForm({
    seedValues: {
      title: video.title,
      description: video.description,
      url: video.url,
      platform: video.platform,
      category: video.category._id,
    },
    seedPreviewSrc: resolveUploadUrl(video.image, "videos"),
    requireImage: false,
  });

  useEffect(() => {
    const getCategories = async () => {
      const url = `${Global.url}category`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ?? "",
          },
        });
        const result = await response.json();
        const names = result.categories.map((category: { _id: string; name: string }) => ({
          _id: category._id,
          name: category.name,
        }));
        setCategories(names);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const isValid = validateForm();
    if (!isValid) return;

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("url", values.url);
    formData.append("category", values.category);
    formData.append("platform", values.platform);
    if (values.image) formData.append("image", values.image);

    try {
      setIsSubmitting(true);
      const response = await fetch(`${Global.url}video/${video._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: token ?? "",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.message ?? "Could not update the video");
        return;
      }
      onSaved(data.video);
      onClose();
    } catch (error) {
      console.log(error);
      setSubmitError("Something went wrong, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => !isSubmitting && onClose()}>
      <div className="modal-card modal-card--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="upload-header">
          <h1 className="upload-title">Edit video</h1>
          <p className="upload-description">Update your video's details</p>
        </div>

        {submitError && <span className="edit-video-error">{submitError}</span>}

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="upload-grid">
            <div className="upload-col">
              <div className="upload-field">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  name="title"
                  className={`upload-input${errors.title ? " upload-input--error" : ""}`}
                  type="text"
                  placeholder="Video title"
                  value={values.title}
                  onChange={handleTextChange}
                  onBlur={() => handleBlur("title")}
                />
                {errors.title && <span className="upload-error">{errors.title}</span>}
              </div>

              <div className="upload-field">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  className={`upload-textarea${errors.description ? " upload-textarea--error" : ""}`}
                  placeholder="What is this video about?"
                  rows={4}
                  value={values.description}
                  onChange={handleTextChange}
                  onBlur={() => handleBlur("description")}
                />
                {errors.description && <span className="upload-error">{errors.description}</span>}
              </div>

              <div className="upload-field">
                <label htmlFor="edit-url">Video URL</label>
                <input
                  id="edit-url"
                  name="url"
                  className={`upload-input${errors.url ? " upload-input--error" : ""}`}
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={values.url}
                  onChange={handleTextChange}
                  onBlur={handleUrlBlur}
                />
                {errors.url && <span className="upload-error">{errors.url}</span>}
                {isUnsupportedPlatform && !errors.url && (
                  <span className="upload-error">
                    Sorry, we only support YouTube, TikTok and Instagram.
                  </span>
                )}
              </div>

              <div className="upload-field">
                <label htmlFor="edit-platform">Platform</label>
                <select
                  id="edit-platform"
                  name="platform"
                  className={`upload-select${errors.platform ? " upload-select--error" : ""}`}
                  value={values.platform}
                  onChange={handleTextChange}
                  onBlur={() => handleBlur("platform")}
                >
                  <option value="">Select a platform</option>
                  <option value="Youtube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                </select>
                {errors.platform && <span className="upload-error">{errors.platform}</span>}
              </div>

              <div className="upload-field">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  name="category"
                  className={`upload-select${errors.category ? " upload-select--error" : ""}`}
                  value={values.category}
                  onChange={handleTextChange}
                  onBlur={() => handleBlur("category")}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="upload-error">{errors.category}</span>}
              </div>
            </div>

            <div className="upload-col">
              <div className="upload-field">
                <label>Thumbnail</label>
                <label
                  htmlFor="edit-image"
                  className={`upload-dropzone${errors.image ? " upload-dropzone--error" : ""}`}
                >
                  {isThumbnailLoading ? (
                    <div className="upload-dropzone__placeholder">
                      <span className="upload-dropzone__text">Fetching thumbnail…</span>
                    </div>
                  ) : isInstagramUrl && !previewSrc ? (
                    <div className="upload-dropzone__placeholder">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="upload-dropzone__icon" />
                      <span className="upload-dropzone__text">Upload manually</span>
                      <span className="upload-dropzone__hint">Instagram doesn't allow auto-thumbnails</span>
                    </div>
                  ) : previewSrc ? (
                    <img src={previewSrc} alt="Thumbnail preview" className="upload-preview" />
                  ) : (
                    <div className="upload-dropzone__placeholder">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="upload-dropzone__icon" />
                      <span className="upload-dropzone__text">Click to upload</span>
                      <span className="upload-dropzone__hint">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </label>
                <input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  className="upload-file-input"
                  onChange={handleImageChange}
                  onBlur={() => handleBlur("image")}
                />
                {errors.image && <span className="upload-error">{errors.image}</span>}
              </div>
            </div>
          </div>

          <button type="submit" className="upload-submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving changes..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

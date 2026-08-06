import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTag, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Global } from "../helpers/Global";
import {
  validateCategoryName,
  validateCategoryDescription,
  validateUploadImage,
} from "../utils/validators";
import "./Upload.css";

export const NewCategory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");

  const [errors, setErrors] = useState({ name: "", description: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (!createSuccess) return;
    const timer = setTimeout(() => navigate("/category"), 1500);
    return () => clearTimeout(timer);
  }, [createSuccess, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setPreviewSrc(file ? URL.createObjectURL(file) : "");
  };

  const handleBlur = (field: "name" | "description" | "image") => {
    if (field === "name") setErrors((prev) => ({ ...prev, name: validateCategoryName(name) }));
    if (field === "description")
      setErrors((prev) => ({ ...prev, description: validateCategoryDescription(description) }));
    if (field === "image") setErrors((prev) => ({ ...prev, image: validateUploadImage(image) }));
  };

  const validateForm = () => {
    const nameError = validateCategoryName(name);
    const descriptionError = validateCategoryDescription(description);
    const imageError = validateUploadImage(image);
    setErrors({ name: nameError, description: descriptionError, image: imageError });
    return !nameError && !descriptionError && !imageError;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const isValid = validateForm();
    if (!isValid) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      setIsSubmitting(true);
      const response = await fetch(`${Global.url}category/new`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token ?? "",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.message ?? "Could not create the category");
        return;
      }
      setCreateSuccess(true);
    } catch (error) {
      console.log(error);
      setSubmitError("Something went wrong, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="upload-card">
        <div className="upload-header">
          <div className="upload-icon">
            <FontAwesomeIcon icon={faTag} />
          </div>
          <h1 className="upload-title">New category</h1>
          <p className="upload-description">Create a category to organize your videos</p>
        </div>

        {createSuccess && (
          <div className="upload-success">
            <FontAwesomeIcon icon={faCircleCheck} className="upload-success__icon" />
            <p className="upload-success__message">Category created successfully!</p>
          </div>
        )}

        {submitError && <span className="upload-error">{submitError}</span>}

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="upload-grid">
            <div className="upload-col">
              <div className="upload-field">
                <label htmlFor="category-name">Name</label>
                <input
                  id="category-name"
                  name="name"
                  className={`upload-input${errors.name ? " upload-input--error" : ""}`}
                  type="text"
                  placeholder="e.g. Gym, Gaming, Cooking..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                />
                {errors.name && <span className="upload-error">{errors.name}</span>}
              </div>

              <div className="upload-field">
                <label htmlFor="category-description">Description</label>
                <textarea
                  id="category-description"
                  name="description"
                  className={`upload-textarea${errors.description ? " upload-textarea--error" : ""}`}
                  placeholder="What kind of videos go here?"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleBlur("description")}
                />
                {errors.description && <span className="upload-error">{errors.description}</span>}
              </div>
            </div>

            <div className="upload-col">
              <div className="upload-field">
                <label>Cover image</label>
                <label
                  htmlFor="category-image"
                  className={`upload-dropzone${errors.image ? " upload-dropzone--error" : ""}`}
                >
                  {previewSrc ? (
                    <img src={previewSrc} alt="Category cover preview" className="upload-preview" />
                  ) : (
                    <div className="upload-dropzone__placeholder">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="upload-dropzone__icon" />
                      <span className="upload-dropzone__text">Click to upload</span>
                      <span className="upload-dropzone__hint">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </label>
                <input
                  id="category-image"
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
            {isSubmitting ? "Creating category..." : "Create category"}
          </button>
        </form>
      </section>
    </div>
  );
};

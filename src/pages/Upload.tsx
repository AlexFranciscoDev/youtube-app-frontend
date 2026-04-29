import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faVideo } from '@fortawesome/free-solid-svg-icons'
import './Upload.css'

export const Upload = () => {
  return (
    <div className="auth-page">
      <section className="upload-card">

        {/* Header de la card */}
        <div className="upload-header">
          <div className="upload-icon">
            <FontAwesomeIcon icon={faVideo} />
          </div>
          <h1 className="upload-title">Add a new video</h1>
          <p className="upload-description">Save and organize your favorite videos</p>
        </div>

        {/* Mensaje éxito/error — conectar con estado */}
        {/* {submitMessage && (
          <span className={submitMessage.isError ? 'auth-error' : 'auth-success'}>
            {submitMessage.text}
          </span>
        )} */}

        <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
          <div className="upload-grid">

            {/* ── Columna izquierda ── */}
            <div className="upload-col">

              <div className="upload-field">
                <label htmlFor="upload-title">Title</label>
                <input
                  id="upload-title"
                  className="upload-input"
                  type="text"
                  placeholder="Video title"
                />
              </div>

              <div className="upload-field">
                <label htmlFor="upload-description">Description</label>
                <textarea
                  id="upload-description"
                  className="upload-textarea"
                  placeholder="What is this video about?"
                  rows={4}
                />
              </div>

              <div className="upload-field">
                <label htmlFor="upload-url">Video URL</label>
                <input
                  id="upload-url"
                  className="upload-input"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="upload-field">
                <label htmlFor="upload-platform">Platform</label>
                <select id="upload-platform" className="upload-select">
                  <option value="">Select a platform</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </div>

              <div className="upload-field">
                <label htmlFor="upload-category">Category</label>
                <select id="upload-category" className="upload-select">
                  <option value="">Select a category</option>
                  {/* Conectar con fetch de /api/category */}
                  {/* {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))} */}
                </select>
              </div>

            </div>

            {/* ── Columna derecha — imagen ── */}
            <div className="upload-col">
              <div className="upload-field">
                <label>Thumbnail</label>
                <label htmlFor="upload-image" className="upload-dropzone">
                  {/* Mostrar preview si hay imagen — conectar con estado */}
                  {/* {previewSrc ? (
                    <img src={previewSrc} alt="Thumbnail preview" className="upload-preview" />
                  ) : ( */}
                    <div className="upload-dropzone__placeholder">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="upload-dropzone__icon" />
                      <span className="upload-dropzone__text">Click to upload</span>
                      <span className="upload-dropzone__hint">PNG, JPG up to 5MB</span>
                    </div>
                  {/* )} */}
                </label>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  className="upload-file-input"
                />
              </div>
            </div>

          </div>

          <button type="submit" className="upload-submit">
            Save video
          </button>
        </form>

      </section>
    </div>
  )
}

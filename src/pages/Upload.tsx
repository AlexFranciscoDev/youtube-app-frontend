import { useState, useEffect } from 'react';
import {useAuth} from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faVideo, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router';
import './Upload.css'
import { Global } from '../helpers/Global';
import { useUploadForm } from '../hooks/useUploadForm';


export const Upload = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState<{_id:string, name:string}[]>([]);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const {
        values,
        errors,
        previewSrc,
        isSubmitting,
        isThumbnailLoading,
        setIsSubmitting,
        handleTextChange,
        handleImageChange,
        handleBlur,
        handleUrlBlur,
        validateForm,
    } = useUploadForm()

    useEffect(() => {
        getCategories();
    }, [])

    /* Redirect to home after successful upload */
    useEffect(() => {
        if (uploadSuccess) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [uploadSuccess, navigate])

    /**
     * getCategories
     */
    const getCategories = async () => {
        const url = `${Global.url}category`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ?? ''
                }
            });
            const result = await response.json();
            const names = result.categories.map((category: {_id: string, name: string}) => ({
                _id: category._id,
                name: category.name
            }))
            setCategories(names);
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * handleSubmit
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        /* Check that there is as logged user */
        if (!user) return
        /* Check if the form is valid */
        const isValid = validateForm()
        if (!isValid) return
        /* Create the form data with the values*/
        const formData = new FormData();
        formData.append('user', user.id);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('url', values.url);
        formData.append('category', values.category);
        formData.append('platform', values.platform);
        if (values.image) formData.append('image', values.image);
        
        try {
            setIsSubmitting(true)
            const response = await fetch(Global.url + 'video', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: token ?? ''
                }
            });
            const data = await response.json();
            setUploadSuccess(true);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }


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

                {uploadSuccess && (
                    <div className="upload-success">
                        <FontAwesomeIcon icon={faCircleCheck} className="upload-success__icon" />
                        <p className="upload-success__message">Video uploaded successfully!</p>
                    </div>
                )}

                <form className="upload-form" onSubmit={handleSubmit}>
                    <div className="upload-grid">

                        {/* ── Columna izquierda ── */}
                        <div className="upload-col">

                            <div className="upload-field">
                                <label htmlFor="upload-title">Title</label>
                                <input
                                    id="upload-title"
                                    name="title"
                                    className={`upload-input${errors.title ? ' upload-input--error' : ''}`}
                                    type="text"
                                    placeholder="Video title"
                                    value={values.title}
                                    onChange={handleTextChange}
                                    onBlur={() => handleBlur('title')}
                                />
                                {errors.title && <span className="upload-error">{errors.title}</span>}
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-description">Description</label>
                                <textarea
                                    id="upload-description"
                                    name="description"
                                    className={`upload-textarea${errors.description ? ' upload-textarea--error' : ''}`}
                                    placeholder="What is this video about?"
                                    rows={4}
                                    value={values.description}
                                    onChange={handleTextChange}
                                    onBlur={() => handleBlur('description')}
                                />
                                {errors.description && <span className="upload-error">{errors.description}</span>}
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-url">Video URL</label>
                                <input
                                    id="upload-url"
                                    name="url"
                                    className={`upload-input${errors.url ? ' upload-input--error' : ''}`}
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={values.url}
                                    onChange={handleTextChange}
                                    onBlur={handleUrlBlur}
                                />
                                {errors.url && <span className="upload-error">{errors.url}</span>}
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-platform">Platform</label>
                                <select
                                    id="upload-platform"
                                    name="platform"
                                    className={`upload-select${errors.platform ? ' upload-select--error' : ''}`}
                                    value={values.platform}
                                    onChange={handleTextChange}
                                    onBlur={() => handleBlur('platform')}
                                >
                                    <option value="">Select a platform</option>
                                    <option value="Youtube">YouTube</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Instagram">Instagram</option>
                                </select>
                                {errors.platform && <span className="upload-error">{errors.platform}</span>}
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-category">Category</label>
                                <select
                                    id="upload-category"
                                    name="category"
                                    className={`upload-select${errors.category ? ' upload-select--error' : ''}`}
                                    value={values.category}
                                    onChange={handleTextChange}
                                    onBlur={() => handleBlur('category')}
                                >
                                    <option value="">Select a category</option>
                                    {/* Conectar con fetch de /api/category */}
                                    {
                                        categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                                {errors.category && <span className="upload-error">{errors.category}</span>}
                            </div>

                        </div>

                        {/* ── Columna derecha — imagen ── */}
                        <div className="upload-col">
                            <div className="upload-field">
                                <label>Thumbnail</label>
                                <label
                                    htmlFor="upload-image"
                                    className={`upload-dropzone${errors.image ? ' upload-dropzone--error' : ''}`}
                                >
                                    {isThumbnailLoading ? (
                                        <div className="upload-dropzone__placeholder">
                                            <span className="upload-dropzone__text">Fetching thumbnail…</span>
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
                                    id="upload-image"
                                    type="file"
                                    accept="image/*"
                                    className="upload-file-input"
                                    onChange={handleImageChange}
                                    onBlur={() => handleBlur('image')}
                                />
                                {errors.image && <span className="upload-error">{errors.image}</span>}
                            </div>
                        </div>

                    </div>

                    <button type="submit" className="upload-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving video...' : 'Save video'}
                    </button>
                </form>

            </section>
        </div>
    )
}

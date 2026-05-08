import { useState, useEffect } from 'react';
import {useAuth} from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faVideo } from '@fortawesome/free-solid-svg-icons'
import './Upload.css'
import { Global } from '../helpers/Global';

export const Upload = () => {
    const {user} = useAuth();
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState<{_id:string, name:string}[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [platform, setPlatform] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [previewSrc, setPreviewSrc] = useState<File>(null);
    const [isLoading, setIsLoading] = useState<string>('');

    useEffect(() => {
        getCategories();
    }, [])

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
        const formData = new FormData();
        formData.append('user', user!.id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('url', url);
        formData.append('category', category);
        formData.append('platform', platform);
        formData.append('image', image);
        
        try {
            const response = await fetch(Global.url + 'video', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: token ?? ''
                }
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
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

                {/* Mensaje éxito/error — conectar con estado */}
                {/* {submitMessage && (
          <span className={submitMessage.isError ? 'auth-error' : 'auth-success'}>
            {submitMessage.text}
          </span>
        )} */}

                <form className="upload-form" onSubmit={handleSubmit}>
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
                                    onChange={(e)=> {setTitle(e.target.value);}}
                                />
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-description">Description</label>
                                <textarea
                                    id="upload-description"
                                    className="upload-textarea"
                                    placeholder="What is this video about?"
                                    rows={4}
                                    onChange={(e) => {setDescription(e.target.value);}}
                                />
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-url">Video URL</label>
                                <input
                                    id="upload-url"
                                    className="upload-input"
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    onChange={(e) => {setUrl(e.target.value);}}
                                />
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-platform">Platform</label>
                                <select id="upload-platform" className="upload-select" onChange={(e) => {setPlatform(e.target.value)}}>
                                    <option value="">Select a platform</option>
                                    <option value="Youtube">YouTube</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Instagram">Instagram</option>
                                </select>
                            </div>

                            <div className="upload-field">
                                <label htmlFor="upload-category">Category</label>
                                <select id="upload-category" className="upload-select" onChange={(e) => {setCategory(e.target.value)}}>
                                    <option value="">Select a category</option>
                                    {/* Conectar con fetch de /api/category */}
                                    {
                                        categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                        </div>

                        {/* ── Columna derecha — imagen ── */}
                        <div className="upload-col">
                            <div className="upload-field">
                                <label>Thumbnail</label>
                                <label htmlFor="upload-image" className="upload-dropzone">
                                    {previewSrc ? (
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
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setImage(file);
                                        setPreviewSrc((prev) => {
                                            if (prev) URL.revokeObjectURL(prev)
                                            return URL.createObjectURL(file)
                                        });
                                    }}
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

import { useState } from 'react';

// Import validations
import {
    validateUploadTitle,
    validateUploadDescription,
    validateUploadUrl,
    validateUploadPlatform,
    validateUploadCategory,
    validateUploadImage
} from '../utils/validators'
import { fetchYouTubeThumbnail, fetchTikTokThumbnail, fetchInstagramThumbnail } from '../helpers/thumbnailFetcher'
import { Global } from '../helpers/Global'

// Type interfaces
type UploadValues = {
    title: string,
    description: string,
    url: string,
    platform: string,
    category: string,
    image: File | null
}

type UploadErrors = {
    title: string,
    description: string,
    url: string,
    platform: string,
    category: string,
    image: string
}

type UploadTouched = {
  title: boolean
  description: boolean
  url: boolean
  platform: boolean
  category: boolean
  image: boolean
}

// Declare initial values
const initialValues: UploadValues = {
    title: '',
    description: '',
    url: '',
    platform: '',
    category: '',
    image: null
}

const initialErrors: UploadErrors = {
  title: '',
  description: '',
  url: '',
  platform: '',
  category: '',
  image: '',
}

const initialTouched: UploadTouched = {
  title: false,
  description: false,
  url: false,
  platform: false,
  category: false,
  image: false,
}

export const useUploadForm = () => {
    // Initialize values
    const [values, setValues] = useState<UploadValues>(initialValues);
    // Initialize errors
    const [errors, setErrors] = useState<UploadErrors>(initialErrors);
    const [touched, setTouched] = useState<UploadTouched>(initialTouched);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false) /* Check that the video is submitting, like loading */
    const [isThumbnailLoading, setIsThumbnailLoading] = useState(false)
    const [isImageManual, setIsImageManual] = useState(false)
    const [isInstagramUrl, setIsInstagramUrl] = useState(false)

    // Validate each field of the form
    // It returns the message in case there's an error
    const validateField = (name: keyof UploadValues, value: string | File | null) => {
        switch (name) {
      case 'title':
        return validateUploadTitle(value as string)
      case 'description':
        return validateUploadDescription(value as string)
      case 'url':
        return validateUploadUrl(value as string)
      case 'platform':
        return validateUploadPlatform(value as string)
      case 'category':
        return validateUploadCategory(value as string)
      case 'image':
        return validateUploadImage(value as File | null)
      default:
        return ''
    }
    }

    /**
     * handleTextChange
     * 
     * Change the value of the input
     * If user leaves field, validates value and change value of Errors
     */
    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setValues((prev) => ({...prev, [name]: value}))
        
        if (touched[name as keyof UploadTouched]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name as keyof UploadValues, value)
            }))
        }
    }

    /**
     * handleImageChange
     * Change value of image
     * If it's touched, show error
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        // Change image value
        setValues((prev) => ({...prev, image: file}));
        // Set preview image
        setPreviewSrc((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return file ? URL.createObjectURL(file) : null
        })
        if (touched.image) {
            setErrors((prev) => ({
                ...prev,
                image: validateUploadImage(file)
            }))
        }
        setIsImageManual(true)
    }

    const applyAutoThumbnail = (file: File) => {
        setValues((prev) => ({ ...prev, image: file }))
        setPreviewSrc((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return URL.createObjectURL(file)
        })
        setErrors((prev) => ({ ...prev, image: '' }))
    }

    /**
     * handleUrlBlur
     * Validates URL field and auto-fetches thumbnail from YouTube/TikTok
     */
    const handleUrlBlur = async () => {
        handleBlur('url')
        if (isImageManual) return
        if (validateUploadUrl(values.url) !== '') return

        const url = values.url;
        if (/instagram\.com/.test(url)) {
            setIsInstagramUrl(true)
            return
        }
        setIsInstagramUrl(false)

        setIsThumbnailLoading(true)
        try {
            let file: File | null = null;
            if (/youtube\.com|youtu\.be/.test(url)) {
                file = await fetchYouTubeThumbnail(url)
            } else if (/tiktok\.com/.test(url)) {
                file = await fetchTikTokThumbnail(url)
            }
            if (file) applyAutoThumbnail(file)
        } finally {
            setIsThumbnailLoading(false)
        }
    }

    /**
     * handleBlur
     */
    const handleBlur = (name: keyof UploadValues) => {
        setTouched((prev) => ({...prev, [name]: true}))
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, values[name])
        }))
    }

    /**
     * validateForm
     * @returns 
     */
    const validateForm = () => {
        /* Validate all the fields */
        const newErrors: UploadErrors = {
            title: validateUploadTitle(values.title),
            description: validateUploadDescription(values.description),
            url: validateUploadUrl(values.url),
            platform: validateUploadPlatform(values.platform),
            category: validateUploadCategory(values.category),
            image: validateUploadImage(values.image)
        }
        /* Set all errors to the variable */
        setErrors(newErrors)

        /* Change state to all the variables, so it shows all the errors if needed */
        setTouched({
        title: true,
        description: true,
        url: true,
        platform: true,
        category: true,
        image: true,
        })

        /* Returns true if there's no errors, false if there's at least one */
        /* Object.values(newErrors) gets all the messages, some(Boolean) checks if any has content */
        return !Object.values(newErrors).some(Boolean)
    }

    return {
    values,
    errors,
    touched,
    previewSrc,
    isSubmitting,
    isThumbnailLoading,
    isInstagramUrl,
    setIsSubmitting,
    handleTextChange,
    handleImageChange,
    handleBlur,
    handleUrlBlur,
    validateForm,
  }
}

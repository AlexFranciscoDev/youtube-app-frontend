export const Global = { url: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/' } as const;
export const GlobalUploads = { url: import.meta.env.VITE_UPLOADS_URL ?? 'http://localhost:3000/uploads/' } as const;
export type GlobalConfig = typeof Global;

export const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

// Cloudinary already returns a full URL; local/disk uploads only store the filename
// and need the uploads base URL + folder prefixed on (folder mirrors upload.js's folderFor).
export const resolveUploadUrl = (path: string, folder: string) =>
    isAbsoluteUrl(path) ? path : `${GlobalUploads.url}${folder}/${path}`;

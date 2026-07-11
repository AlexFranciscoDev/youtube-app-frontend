export const Global = { url: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/' } as const;
export const GlobalUploads = { url: import.meta.env.VITE_UPLOADS_URL ?? 'http://localhost:3000/uploads/' } as const;
export type GlobalConfig = typeof Global;

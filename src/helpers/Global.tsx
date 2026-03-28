export const Global = { url: 'http://localhost:3000/api/' } as const;
export const GlobalUploads = { url: 'http://localhost:3000/uploads/' } as const;
export type GlobalConfig = typeof Global;

export async function fetchYouTubeThumbnail(url: string): Promise<File | null> {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!match) return null;
    const id = match[1];
    for (const quality of ['maxresdefault', 'hqdefault']) {
        try {
            const res = await fetch(`https://img.youtube.com/vi/${id}/${quality}.jpg`);
            if (!res.ok) continue;
            const blob = await res.blob();
            if (blob.size < 3000) continue; // YouTube serves a ~1.3 KB grey placeholder instead of 404
            return new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
        } catch { continue; }
    }
    return null;
}

export async function fetchTikTokThumbnail(url: string): Promise<File | null> {
    try {
        const oembed = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (!oembed.ok) return null;
        const data = await oembed.json();
        if (!data.thumbnail_url) return null;
        const imgRes = await fetch(data.thumbnail_url);
        if (!imgRes.ok) return null;
        const blob = await imgRes.blob();
        return new File([blob], 'thumbnail.jpg', { type: blob.type });
    } catch { return null; }
}

export async function fetchInstagramThumbnail(url: string, apiBase: string): Promise<File | null> {
    try {
        const res = await fetch(`${apiBase}thumbnail?url=${encodeURIComponent(url)}`);
        if (!res.ok) return null;
        const blob = await res.blob();
        if (!blob.type.startsWith('image/')) return null;
        return new File([blob], 'thumbnail.jpg', { type: blob.type });
    } catch { return null; }
}

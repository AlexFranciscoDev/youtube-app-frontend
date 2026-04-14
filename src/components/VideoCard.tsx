import React from "react";

interface VideoCardProps {
    user: string,
    title: string,
    description: string,
    url: string,
    category: string,
    platform: string,
    image: string,
    createdAt: string
}

const VideoCard = (video: VideoCardProps) => {
    return (
        <>
        <h1>{video.title}</h1>
        <p>{video.description}</p>
        </>
    )
}

export default VideoCard;
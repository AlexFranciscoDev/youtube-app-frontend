import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTag, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { GlobalUploads } from '../helpers/Global'
import './VideoCard.css'

interface VideoCardProps {
    user: {username: string; email: string;},
    title: string,
    url: string,
    category: {name: string; description: string;},
    platform: string,
    image: string,
    createdAt: string
}

const formatDateEnglish = (dateProp: string) => {
    const date = new Date(dateProp);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'long'});
    return `${day} ${month} ${year}`
}

const VideoCard = (video: VideoCardProps) => {
    const videoDate = formatDateEnglish(video.createdAt);
    return (
        <article className="vcard">
            {/* Thumbnail */}
            <div className="vcard__thumbnail-wrapper">
                <img
                    src={`${GlobalUploads.url}videos/${video.image}`}
                    alt="video thumbnail"
                    className="vcard__thumbnail"
                />
                <div className="vcard__tags">
                    <span className="vcard__tag">
                        <FontAwesomeIcon icon={faTag} className="vcard__icon" />
                        {video.category.name}
                    </span>
                </div>
                <span className="vcard__platform-badge">{video.platform}</span>
            </div>

            {/* Body */}
            <div className="vcard__body">
                <h3 className="vcard__title">{video.title}</h3>

                <p className="vcard__author">
                    <FontAwesomeIcon icon={faUser} className="vcard__icon" />
                    {`@${video.user.username}`}
                </p>


                <div className="vcard__footer">
                    <span className="vcard__date">{videoDate}</span>
                    <a href="#" className="vcard__link" target="_blank" rel="noreferrer">
                        Ver
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="vcard__link-icon" />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default VideoCard;

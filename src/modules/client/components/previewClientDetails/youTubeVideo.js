import { useEffect, useState } from "react";

function YouTubeVideo({videoLink}) {
    const [videoId, setVideoId] = useState('');

    const extractVideoId = link => {
        const match = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match) {
        return match[1];
        } else {
        return null;
        }
    };

    useEffect(() => {
        const id = extractVideoId(videoLink);
        if (id) {
        setVideoId(id);
        }
    }, [videoLink]);

    if (!videoId) {
        return <div>No valid YouTube video link provided</div>;
    }

    return(
        <div className="video-wrapper">
        <iframe
            title="YouTube Video"
            width="330"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            style={{margin:"5px"}}
        ></iframe>
    </div>
    )   
}

export default YouTubeVideo;
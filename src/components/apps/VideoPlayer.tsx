import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    return (
        <div className="flex flex-col h-full bg-black">
            <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="flex-1"
            />
        </div>
    );
};

export default VideoPlayer;

import React from 'react';

interface ImageViewerProps {
    src: string;
    alt: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt }) => {
    return (
        <div className="flex items-center justify-center h-full bg-black overflow-hidden">
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
            />
        </div>
    );
};

export default ImageViewer;

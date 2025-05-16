import React, { useState } from 'react';

type ImageGalleryProps = {
  images: { id: string; url: string; position: number }[];
  alt: string;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [activeImage, setActiveImage] = useState(0);
  
  // If no images, use a placeholder
  const displayImages = images.length > 0 
    ? images.sort((a, b) => a.position - b.position) 
    : [{ id: 'placeholder', url: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', position: 0 }];

  return (
    <div className="space-y-4">
      <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg">
        <img
          src={displayImages[activeImage]?.url}
          alt={`${alt} - Image ${activeImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveImage(index)}
              className={`relative overflow-hidden rounded-md aspect-w-1 aspect-h-1 ${
                activeImage === index
                  ? 'ring-2 ring-purple-500'
                  : 'ring-1 ring-gray-200'
              }`}
            >
              <img
                src={image.url}
                alt={`${alt} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
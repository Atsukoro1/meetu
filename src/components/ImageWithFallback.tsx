import { Image } from '@mantine/core';
import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, ...props }) => {
  const [error, setError] = useState<boolean>(false);

  const handleError = () => {
    setError(true);
  }

  if(error) {
    return <Image {...props} src={null} withPlaceholder />
  } else {
    return <img src={src} onError={handleError} alt={alt} {...props} />
  }
}

export default ImageWithFallback;

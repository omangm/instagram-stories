import React, { JSX, useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  ...rest
}: OptimizedImageProps): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Function to add image optimization parameters to URL
  const getOptimizedSrc = (): string => {
    try {
      const url = new URL(src);

      if (url.hostname.includes('picsum.photos')) {
        if (width && height) {
          return `${url.origin}/${url.pathname.split('/').slice(0, 3).join('/')}/${width}/${height}${url.search}`;
        }
      }

      if (width) {
        url.searchParams.append('w', width.toString());
      }
      if (height) {
        url.searchParams.append('h', height.toString());
      }
      if (priority) {
        url.searchParams.append('priority', 'true');
      }

      return url.toString();
    } catch (e) {
      console.error(e);
      return src;
    }
  };

  // Placeholder while loading
  const placeholderSrc = `/api/placeholder/${width || 400}/${height || 400}`;

  return (
    <>
      {!isLoaded && !error && (
        <div
          className={`${className} bg-gray-200 animate-pulse`}
          style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
          data-testid="image-placeholder"
        />
      )}
      <img
        src={error ? placeholderSrc : getOptimizedSrc()}
        alt={alt}
        className={`${className} ${!isLoaded ? 'hidden' : ''}`}
        width={width}
        height={height}
        onLoad={(e) => {
          setIsLoaded(true);
          if (onLoad) onLoad(e);
        }}
        onError={(e) => {
          setError(true);
          setIsLoaded(true);
          if (onError) onError(e);
        }}
        loading={priority ? 'eager' : 'lazy'}
        data-testid="optimized-image"
        {...rest}
      />
    </>
  );
}

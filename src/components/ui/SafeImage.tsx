'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackIconSize?: number;
}

export default function SafeImage({ 
  src, 
  alt, 
  fallbackIconSize = 24,
  className = '',
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-surface border border-border/50 ${className}`}>
        <ImageIcon size={fallbackIconSize} className="text-foreground/20" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

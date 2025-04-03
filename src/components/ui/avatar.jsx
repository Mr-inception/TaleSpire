import React from 'react';

export function Avatar({ 
  src, 
  alt, 
  size = 'md',
  className = '',
  fallback,
  ...props 
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        rounded-full overflow-hidden
        bg-gray-100
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '';
            e.target.parentElement.classList.add('bg-gray-200');
          }}
        />
      ) : fallback ? (
        <span
          className={`
            font-medium text-gray-600
            ${textSizes[size]}
          `}
        >
          {fallback}
        </span>
      ) : (
        <svg
          className={`${sizes[size]} text-gray-400`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </div>
  );
} 
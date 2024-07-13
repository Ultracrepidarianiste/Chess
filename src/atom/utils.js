// src/utils.js

import React from 'react';

const createPieceImage = (src, alt, primaryColor, secondaryColor) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <filter id={`colorize-${alt}`}>
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${hexToRgb(primaryColor).r / 255}
                     0 0 0 0 ${hexToRgb(primaryColor).g / 255}
                     0 0 0 0 ${hexToRgb(primaryColor).b / 255}
                     0 0 0 1 0`}
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="5"
            floodColor={secondaryColor}
            floodOpacity="0.8"
          />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        style={{
          filter: `url(#colorize-${alt})`,
          zIndex: 0,
          position: 'relative',
        }}
      />
    </div>
  );
};

// Fonction utilitaire pour convertir une couleur hexadécimale en RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

export { createPieceImage };

import React, { memo } from 'react';

export const AnimatedBackground = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transform-gpu" aria-hidden="true">
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 dark:opacity-30" />

      {/* Floating Gradient Blob 1 (Violet) */}
      <div
        className="absolute -top-32 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-500/15 to-transparent blur-[80px] sm:blur-[120px] will-change-transform animate-blob-1"
      />

      {/* Floating Gradient Blob 2 (Orange/Pink) */}
      <div
        className="absolute top-1/3 -right-32 w-[380px] sm:w-[550px] h-[380px] sm:h-[550px] rounded-full bg-gradient-to-tl from-orange-500/20 via-pink-500/15 to-transparent blur-[90px] sm:blur-[130px] will-change-transform animate-blob-2"
      />

      {/* Floating Gradient Blob 3 (Cyan/Indigo) */}
      <div
        className="absolute -bottom-32 left-1/3 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-transparent blur-[100px] sm:blur-[140px] will-change-transform animate-blob-3"
      />
    </div>
  );
});

export default AnimatedBackground;

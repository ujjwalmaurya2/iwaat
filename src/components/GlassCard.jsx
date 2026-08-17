import React, { memo } from 'react';
import { motion } from 'framer-motion';

export const GlassCard = memo(({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClick}
      className={`glass-panel rounded-3xl p-6 md:p-8 transition-shadow duration-300 relative overflow-hidden ${
        glow ? 'glow-card' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});

export default GlassCard;

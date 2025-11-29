import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white bg-opacity-10 
      backdrop-filter backdrop-blur-xl 
      border border-white border-opacity-20 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
      rounded-3xl
      ${noPadding ? '' : 'p-6'} 
      ${className}
    `}>
      {children}
    </div>
  );
};
import React from 'react';

interface SkillBadgeProps {
  skill: string;
  onClick?: () => void;
  selected?: boolean;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, onClick, selected = false }) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
      } ${
        selected 
          ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-lg shadow-brand-purple/20 border border-brand-purple/30' 
          : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/80'
      }`}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;

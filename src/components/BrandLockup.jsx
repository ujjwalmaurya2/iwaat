import React from 'react';
import { Sparkles } from 'lucide-react';

export const BrandLockup = ({ 
  layout = 'row', // 'row' | 'col' | 'stacked'
  showMotto = true,
  className = '',
  logoSize = 'w-10 h-10 rounded-2xl',
  iconSize = 'w-5 h-5',
  wordmarkSize = 'text-2xl',
  mottoSize = 'text-[11px] sm:text-[12px]',
  icon: Icon = Sparkles,
}) => {
  const isRow = layout === 'row';
  const isStacked = layout === 'stacked';
  const alignClass = className.includes('items-') ? '' : 'items-center';
  const textClass = className.includes('text-') ? '' : 'text-center';

  if (isStacked) {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        {/* Top: Logo + Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className={`${logoSize} shrink-0 bg-gradient-to-tr from-violet-600 via-purple-600 to-orange-500 p-0.5 shadow-md shadow-violet-500/20`}>
            <div className="w-full h-full bg-[#0B1020] rounded-[14px] flex items-center justify-center text-violet-400 group-hover:text-orange-400 transition-colors">
              <Icon className={`${iconSize} fill-violet-400/20`} />
            </div>
          </div>
          <span className={`font-brand font-semibold ${wordmarkSize} tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5`}>
            iWAAT<span className="text-violet-500">.</span>
          </span>
        </div>

        {/* Bottom: Motto */}
        {showMotto && (
          <span className={`font-brand font-medium ${mottoSize} tracking-[0.16em] text-slate-500 dark:text-slate-400 mt-0.5`}>
            <span className="text-slate-700 dark:text-slate-200">I</span>nformation <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">W</span>ebsite <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">A</span>pps <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">A</span>ds <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">T</span>ransparency
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex ${isRow ? 'flex-row items-center gap-3' : `flex-col gap-3 ${alignClass} ${textClass}`} ${className}`}>
      {/* Brand Logo / Mark */}
      <div className={`${logoSize} shrink-0 bg-gradient-to-tr from-violet-600 via-purple-600 to-orange-500 p-0.5 shadow-md shadow-violet-500/20`}>
        <div className="w-full h-full bg-[#0B1020] rounded-[14px] flex items-center justify-center text-violet-400 group-hover:text-orange-400 transition-colors">
          <Icon className={`${iconSize} fill-violet-400/20`} />
        </div>
      </div>

      {/* Brand Text Content */}
      <div className={`flex flex-col ${isRow ? 'justify-center' : alignClass}`}>
        {/* Wordmark */}
        <span className={`font-brand font-semibold ${wordmarkSize} tracking-tight text-slate-900 dark:text-white flex items-center ${isRow ? '' : 'justify-center'} gap-0.5`}>
          iWAAT<span className="text-violet-500">.</span>
        </span>
        
        {/* Motto / Full Form */}
        {showMotto && (
          <span className={`font-brand font-medium ${mottoSize} tracking-[0.15em] text-slate-500 dark:text-slate-400 mt-0.5 ${isRow ? 'hidden sm:block' : 'block'}`}>
            <span className="text-slate-700 dark:text-slate-200">I</span>nformation <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">W</span>ebsite <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">A</span>pps <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">A</span>ds <span className="opacity-50">·</span> <span className="text-slate-700 dark:text-slate-200">T</span>ransparency
          </span>
        )}
      </div>
    </div>
  );
};

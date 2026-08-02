import React, { useState } from 'react';
import { ExplorationLayer } from '../types';

interface ExplorationPathStripProps {
  layers: ExplorationLayer[];
  currentDepthIndex: number;
  totalLayers: number;
  onSelectLayer: (depthIndex: number) => void;
  onDrillDeeper: () => void;
}

export const ExplorationPathStrip: React.FC<ExplorationPathStripProps> = ({
  layers,
  currentDepthIndex,
  totalLayers,
  onSelectLayer,
  onDrillDeeper,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full mt-6 sm:mt-8">
      {/* Header bar for strip */}
      <div className="flex items-center justify-between mb-3 border-b border-[#d8d0c8]/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl sm:text-2xl text-[#3a302a] font-medium">
            Lộ Trình Khám Phá
          </span>
          <span className="font-label text-xs uppercase text-[#605850] bg-[#eae2da] px-2 py-0.5 rounded">
            Đã khám phá {layers.length} / {totalLayers >= 100 ? '∞' : totalLayers} lớp
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#605850] hover:text-[#3a302a] transition-colors p-1 rounded hover:bg-[#ece6dc] cursor-pointer"
          aria-label={isExpanded ? "Thu gọn lộ trình" : "Mở rộng lộ trình"}
        >
          <span className="material-symbols-outlined text-xl">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 custom-scrollbar items-center">
          {layers.map((layer) => {
            const isCurrent = layer.depthIndex === currentDepthIndex;
            return (
              <div
                key={layer.depthIndex}
                onClick={() => onSelectLayer(layer.depthIndex)}
                className={`flex-shrink-0 w-36 sm:w-44 aspect-video rounded-md cursor-pointer relative transition-all duration-200 overflow-hidden bg-[#e6ded2] ${
                  isCurrent
                    ? 'border-2 border-[#c2652a] shadow-md scale-102'
                    : 'border border-[#d8d0c8] opacity-70 hover:opacity-100 hover:border-[#3a302a]'
                }`}
              >
                <img
                  src={layer.imageUrl}
                  alt={layer.title}
                  onError={(e) => {
                    // Replace broken thumbnail with canvas background
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className={`w-full h-full object-cover rounded-[3px] ${
                    !isCurrent ? 'grayscale group-hover:grayscale-0' : ''
                  }`}
                />
                
                {/* Title overlay at bottom of thumbnail */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3a302a]/90 via-[#3a302a]/60 to-transparent p-1.5 rounded-b-[3px]">
                  <p className="font-label text-[10px] text-white font-semibold truncate">
                    {layer.depthLabel.replace('DEPTH: ', '')}
                  </p>
                </div>

                {/* Active Indicator Dot */}
                {isCurrent && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#c2652a] shadow-xs" />
                )}
              </div>
            );
          })}

          {/* Next Placeholder / Drill Deeper Button (Always available for infinite exploration) */}
          {(layers.length < totalLayers || totalLayers >= 100) && (
            <div
              onClick={onDrillDeeper}
              className="flex-shrink-0 w-36 sm:w-44 aspect-video border-2 border-dashed border-[#d8d0c8] rounded-md cursor-pointer flex flex-col items-center justify-center hover:bg-[#ece6dc] hover:border-[#c2652a] transition-all duration-200 text-[#605850] hover:text-[#c2652a] p-2 text-center group bg-[#faf5ee]"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                add
              </span>
              <span className="font-label text-xs uppercase tracking-wider font-semibold mt-1">
                Khoan Sâu Hơn
              </span>
              <span className="font-body text-[10px] text-[#605850]/80">
                Lớp {layers.length + 1}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

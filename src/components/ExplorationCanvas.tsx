import React, { useState, useRef } from 'react';
import { ExplorationLayer, Hotspot } from '../types';

interface ExplorationCanvasProps {
  layer: ExplorationLayer;
  onDrillDown: (hotspot?: Hotspot) => void;
}

interface RippleState {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const ExplorationCanvas: React.FC<ExplorationCanvasProps> = ({
  layer,
  onDrillDown,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const [imgError, setImgError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset image error state when layer changes
  React.useEffect(() => {
    setImgError(false);
  }, [layer.imageUrl]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If user clicked a hotspot button directly, don't trigger background ripple twice
    if ((e.target as HTMLElement).closest('.hotspot-marker')) {
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const diameter = Math.max(rect.width, rect.height) * 0.15;
    const newRipple: RippleState = {
      id: Date.now(),
      x: clickX - diameter / 2,
      y: clickY - diameter / 2,
      size: diameter,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleHotspotClick = (e: React.MouseEvent, hotspot: Hotspot) => {
    e.stopPropagation();
    if (activeHotspot?.id === hotspot.id) {
      setActiveHotspot(null);
    } else {
      setActiveHotspot(hotspot);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 16:9 Illustration Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        id="image-canvas"
        className="relative w-full aspect-video border border-[#d8d0c8] bg-[#f2ebd9] rounded-xl overflow-hidden cursor-crosshair group shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Scientific Target Image or Aesthetic Vector Diagram Fallback */}
        {!imgError ? (
          <img
            src={layer.imageUrl}
            alt={layer.imageAlt}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#ede4d3] p-6 flex flex-col justify-between select-none">
            {/* Scientific Grid & Concentric Rings Background */}
            <svg className="absolute inset-0 w-full h-full opacity-25 stroke-[#605850]" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="50%" cy="50%" r="35%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="20%" fill="none" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>

            <div className="relative z-10 flex justify-between items-start">
              <span className="font-label text-xs uppercase tracking-widest text-[#c2652a] font-bold bg-[#faf5ee] px-2 py-1 rounded border border-[#d8d0c8]">
                {layer.depthLabel}
              </span>
              <span className="font-label text-[10px] text-[#605850] uppercase tracking-widest">
                Sơ Đồ Minh Họa Khoa Học
              </span>
            </div>

            <div className="relative z-10 text-center max-w-lg mx-auto my-auto">
              <h4 className="font-display text-2xl font-semibold text-[#3a302a] mb-1">
                {layer.title}
              </h4>
              <p className="font-body text-xs text-[#605850]">
                {layer.subtitle}
              </p>
            </div>

            <div className="relative z-10 flex justify-between text-[10px] font-label text-[#605850] uppercase">
              <span>Tỉ Lệ Sâu: 1 : 10^{layer.depthIndex}</span>
              <span>Trục Tọa Độ: X-Y-Z</span>
            </div>
          </div>
        )}

        {/* Dynamic Click Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{
              width: `${r.size}px`,
              height: `${r.size}px`,
              left: `${r.x}px`,
              top: `${r.y}px`,
            }}
          />
        ))}

        {/* Simulated Ripple / Center Ping Indicator */}
        <div
          className="absolute w-10 h-10 rounded-full bg-[#c2652a]/20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping pointer-events-none"
          style={{ animationDuration: '2.5s', animationIterationCount: 'infinite' }}
        />

        {/* Interactive Hotspot Markers */}
        {layer.hotspots.map((hotspot) => {
          const isActive = activeHotspot?.id === hotspot.id;
          return (
            <div
              key={hotspot.id}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hotspot-marker"
            >
              <button
                onClick={(e) => handleHotspotClick(e, hotspot)}
                className={`relative group/pin flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-200 cursor-pointer shadow-md ${
                  isActive
                    ? 'bg-[#c2652a] border-white scale-125 text-white'
                    : 'bg-[#faf5ee]/90 border-[#c2652a] text-[#c2652a] hover:scale-110 hover:bg-[#c2652a] hover:text-white'
                }`}
                aria-label={hotspot.label}
              >
                <span className="font-label text-xs font-bold">
                  {layer.hotspots.indexOf(hotspot) + 1}
                </span>

                {/* Pulse Ring */}
                <span className="absolute inset-0 rounded-full border border-[#c2652a] animate-ping opacity-40 pointer-events-none" />
              </button>

              {/* Hotspot Tooltip Popover */}
              {isActive && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-[#faf5ee]/95 border border-[#d8d0c8] rounded-lg shadow-lg backdrop-blur-sm z-30 text-left animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center justify-between pb-1 border-b border-[#d8d0c8]/40 mb-1.5">
                    <span className="font-display font-semibold text-sm text-[#3a302a]">
                      {hotspot.label}
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-[#605850] hover:text-[#3a302a] text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="font-body text-xs text-[#605850] leading-relaxed mb-2.5">
                    {hotspot.description}
                  </p>
                  <button
                    onClick={() => {
                      setActiveHotspot(null);
                      onDrillDown(hotspot);
                    }}
                    className="w-full text-center py-1.5 px-3 rounded bg-[#c2652a] text-white font-label text-xs font-semibold uppercase tracking-wider hover:bg-[#a5521f] transition-colors cursor-pointer"
                  >
                    Khoan Vào {hotspot.label} →
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Floating Overlay Depth Badge */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#faf5ee]/95 px-4 py-2 sm:py-3 border border-[#d8d0c8] backdrop-blur-sm shadow-sm rounded-md">
          <span className="font-label text-xs sm:text-sm font-semibold tracking-wider text-[#3a302a] uppercase">
            {layer.depthLabel}
          </span>
        </div>

        {/* Floating Tip overlay on top right */}
        <div className="absolute top-4 right-4 bg-[#faf5ee]/80 px-3 py-1.5 border border-[#d8d0c8]/60 backdrop-blur-xs rounded-full hidden sm:flex items-center gap-1.5 text-xs text-[#605850] pointer-events-none">
          <span className="material-symbols-outlined text-sm text-[#c2652a]">touch_app</span>
          <span>Nhấp vào hình hoặc điểm ghim để khám phá sâu hơn</span>
        </div>
      </div>
    </div>
  );
};

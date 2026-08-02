import React from 'react';
import { ExplorationSession } from '../types';

interface TopHeaderProps {
  session: ExplorationSession | null;
  currentDepthIndex: number;
  totalLayers: number;
  onBack: () => void;
  onReset: () => void;
  onToggleBookmark: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  session,
  currentDepthIndex,
  totalLayers,
  onBack,
  onReset,
  onToggleBookmark
}) => {
  const isBookmarked = session?.bookmarked ?? false;

  return (
    <header className="bg-[#faf5ee] border-b border-[#d8d0c8]/60 flex justify-between items-center px-4 sm:px-8 py-4 w-full sticky top-0 z-20 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          aria-label="Quay lại"
          className="flex items-center justify-center p-2 rounded-full hover:bg-[#ece6dc] text-[#3a302a] transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        {session && (
          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? "Bỏ lưu khỏi Thư viện" : "Lưu vào Thư viện"}
            className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-[#ece6dc] text-[#3a302a] transition-colors duration-200 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-xl ${isBookmarked ? "text-[#c2652a]" : "text-[#605850]"}`}>
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        )}
      </div>

      <div className="text-center flex flex-col items-center">
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#3a302a] tracking-tight leading-tight">
          {session ? session.topic : 'Sổ Tay Kiến Thức'}
        </h1>
        {session && (
          <span className="font-label text-xs tracking-[0.2em] text-[#605850] mt-1 uppercase block font-medium">
            LỚP {currentDepthIndex} / {totalLayers >= 100 ? '∞' : totalLayers}
          </span>
        )}
      </div>

      <button
        onClick={onReset}
        className="font-label text-xs tracking-widest text-[#3a302a] px-4 py-2 border border-[#d8d0c8] rounded hover:bg-[#ece6dc] hover:border-[#c2652a] hover:text-[#c2652a] transition-all duration-200 active:scale-95 uppercase font-semibold cursor-pointer"
      >
        Đặt Lại
      </button>
    </header>
  );
};

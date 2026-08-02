import React, { useState } from 'react';
import { LANDING_LOGO_URL, FEATURED_PRESETS } from '../data/presetTopics';

interface LandingViewProps {
  onExploreTopic: (topic: string) => void;
  onSelectPreset: (presetId: string) => void;
  isLoading?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onExploreTopic,
  onSelectPreset,
  isLoading = false
}) => {
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onExploreTopic(topicInput.trim());
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-12 sm:py-20 text-center font-body min-h-[calc(100vh-80px)]">
      {/* Hero Illustration */}
      <div className="mb-10 sm:mb-14 w-full max-w-2xl mx-auto">
        <div className="relative group overflow-hidden rounded-xl border border-[#d8d0c8]/50 shadow-sm bg-[#f2ece4] p-3 transition-transform duration-300 hover:scale-[1.01]">
          <img
            src={LANDING_LOGO_URL}
            alt="Sổ Tay Kiến Thức Hero"
            className="w-full aspect-[16/9] object-cover rounded-lg mx-auto bg-[#faf5ee]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a302a]/10 to-transparent pointer-events-none rounded-lg" />
        </div>
      </div>

      {/* Headline */}
      <h1 className="font-display text-4xl sm:text-6xl text-[#3a302a] mb-4 font-semibold tracking-tight">
        Sổ Tay Kiến Thức
      </h1>
      <p className="font-body text-lg sm:text-xl text-[#605850] mb-12 max-w-lg mx-auto font-light leading-relaxed">
        Khám phá mọi chủ đề. Từng lớp một.
      </p>

      {/* Search / Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto flex flex-col items-center gap-8 mb-16">
        <div className="relative w-full group">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            aria-label="Chủ đề muốn khám phá"
            placeholder="Nhập chủ đề bạn muốn khám phá..."
            className="topic-input w-full font-display text-2xl sm:text-3xl text-center text-[#3a302a] placeholder:text-[#605850]/40 placeholder:font-body placeholder:text-xl"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!topicInput.trim() || isLoading}
          className="ghost-button px-10 py-4 rounded-full font-label text-sm font-semibold text-[#3a302a] uppercase tracking-widest flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-[#c2652a] border-t-transparent rounded-full animate-spin" />
              Đang Khởi Tạo Các Lớp...
            </>
          ) : (
            <>
              Khám Phá
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Featured Explorations Section */}
      <div className="w-full max-w-3xl pt-8 border-t border-[#d8d0c8]/60 text-left">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-semibold text-[#3a302a]">
            Hành Trình Khám Phá Nổi Bật
          </h2>
          <span className="font-label text-xs uppercase tracking-wider text-[#605850]">
            Chọn Một Chủ Đề
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="flex flex-col text-left p-5 rounded-xl border border-[#d8d0c8]/60 bg-[#f6f0e8] hover:bg-[#ece6dc] hover:border-[#c2652a] transition-all duration-200 group cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-[#faf5ee] text-[#c2652a] group-hover:bg-[#c2652a] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">{preset.icon}</span>
                </span>
                <span className="font-label text-[11px] uppercase tracking-wider text-[#605850] bg-[#eae2da] px-2 py-0.5 rounded font-medium">
                  {preset.category.split(' ')[0]}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[#3a302a] group-hover:text-[#c2652a] transition-colors mb-1">
                {preset.title}
              </h3>
              <p className="font-body text-xs text-[#605850] line-clamp-2 leading-relaxed mb-3">
                {preset.subtitle}
              </p>
              <div className="mt-auto pt-2 border-t border-[#d8d0c8]/40 flex items-center justify-between font-label text-[11px] text-[#605850]">
                <span>{preset.sampleDepth}</span>
                <span className="group-hover:translate-x-1 transition-transform text-[#c2652a] font-semibold">
                  Khám Phá →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

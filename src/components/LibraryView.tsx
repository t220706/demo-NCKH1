import React, { useState } from 'react';
import { ExplorationSession } from '../types';
import { FEATURED_PRESETS } from '../data/presetTopics';

interface LibraryViewProps {
  bookmarks: ExplorationSession[];
  onOpenSession: (session: ExplorationSession) => void;
  onSelectPreset: (presetId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  bookmarks,
  onOpenSession,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', 'Địa chất', 'Thần kinh học', 'Vật lý thiên văn', 'Vật lý lượng tử', 'Lịch sử'];

  const categoryMap: Record<string, string> = {
    'Địa chất': 'Geology',
    'Thần kinh học': 'Neuroscience',
    'Vật lý thiên văn': 'Astrophysics',
    'Vật lý lượng tử': 'Quantum',
    'Lịch sử': 'History'
  };

  const filteredPresets = selectedCategory === 'Tất cả'
    ? FEATURED_PRESETS
    : FEATURED_PRESETS.filter(p => p.category.includes(categoryMap[selectedCategory] || selectedCategory));

  return (
    <main className="w-full max-w-4xl mx-auto px-6 py-10 font-body min-h-[calc(100vh-140px)] text-left">
      <div className="border-b border-[#d8d0c8]/60 pb-5 mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#3a302a]">
          Thư Viện Kiến Thức
        </h1>
        <p className="font-body text-sm text-[#605850] mt-1">
          Khám phá bộ tài liệu hướng dẫn và sơ đồ khoa học đã lưu
        </p>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-label uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#c2652a] text-white shadow-2xs'
                  : 'bg-[#f6f0e8] text-[#3a302a] border border-[#d8d0c8] hover:border-[#c2652a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarked User Sessions */}
      {bookmarks.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-[#3a302a] mb-4">
            Mục Đã Lưu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarks.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenSession(item)}
                className="p-5 rounded-xl border-2 border-[#c2652a]/40 bg-[#faf5ee] hover:bg-[#f2ece4] transition-all cursor-pointer flex gap-4 shadow-2xs group"
              >
                {item.layers[0] && (
                  <img
                    src={item.layers[0].imageUrl}
                    alt={item.topic}
                    className="w-20 h-20 object-cover rounded-lg border border-[#d8d0c8]"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-label text-[10px] uppercase text-[#c2652a] font-bold">
                    Tài Liệu Hướng Dẫn Đã Lưu
                  </span>
                  <h3 className="font-display text-lg font-semibold text-[#3a302a] group-hover:text-[#c2652a] truncate">
                    {item.topic}
                  </h3>
                  <p className="font-body text-xs text-[#605850] line-clamp-2 mt-1">
                    Đã khám phá {item.layers.length} lớp
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curated Library Reference Plates */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-[#3a302a] mb-4">
          Bộ Sơ Đồ Khoa Học Tham Khảo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="p-5 rounded-xl border border-[#d8d0c8]/60 bg-[#f6f0e8] hover:bg-[#ece6dc] hover:border-[#c2652a] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-lg bg-[#faf5ee] text-[#c2652a]">
                    <span className="material-symbols-outlined text-2xl">{preset.icon}</span>
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-wider text-[#605850] bg-[#eae2da] px-2 py-0.5 rounded font-medium">
                    {preset.category}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#3a302a] group-hover:text-[#c2652a] mb-1">
                  {preset.title}
                </h3>
                <p className="font-body text-xs text-[#605850] leading-relaxed mb-4">
                  {preset.subtitle}
                </p>
              </div>
              <div className="pt-3 border-t border-[#d8d0c8]/40 flex items-center justify-between font-label text-xs font-semibold text-[#c2652a]">
                <span>Mở Sơ Đồ Khoa Học</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

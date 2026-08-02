import React from 'react';
import { ExplorationSession } from '../types';

interface HistoryViewProps {
  history: ExplorationSession[];
  onOpenSession: (session: ExplorationSession) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onOpenSession,
  onClearHistory,
}) => {
  return (
    <main className="w-full max-w-4xl mx-auto px-6 py-10 font-body min-h-[calc(100vh-140px)] text-left">
      <div className="flex items-center justify-between mb-8 border-b border-[#d8d0c8]/60 pb-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#3a302a]">
            Lịch Sử Khám Phá
          </h1>
          <p className="font-body text-sm text-[#605850] mt-1">
            Xem lại các hành trình khám phá chuyên sâu và phát hiện khoa học của bạn
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-label uppercase tracking-wider text-[#605850] hover:text-rose-700 px-3 py-1.5 border border-[#d8d0c8] rounded hover:border-rose-300 transition-colors cursor-pointer"
          >
            Xóa Lịch Sử
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-[#f6f0e8] rounded-xl border border-[#d8d0c8]/60 p-8">
          <span className="material-symbols-outlined text-5xl text-[#605850]/40 mb-3">history</span>
          <h3 className="font-display text-2xl font-semibold text-[#3a302a] mb-2">Chưa Có Hành Trình Nào</h3>
          <p className="font-body text-sm text-[#605850] max-w-md mx-auto">
            Các chủ đề và lộ trình khoa học bạn đã khám phá sẽ tự động xuất hiện ở đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenSession(item)}
              className="p-5 rounded-xl border border-[#d8d0c8]/60 bg-[#faf5ee] hover:bg-[#f2ece4] hover:border-[#c2652a] transition-all duration-200 cursor-pointer shadow-2xs group flex gap-4"
            >
              {item.layers[0] && (
                <img
                  src={item.layers[0].imageUrl}
                  alt={item.topic}
                  className="w-24 h-24 object-cover rounded-lg border border-[#d8d0c8]"
                />
              )}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label text-[11px] uppercase tracking-wider text-[#c2652a] font-semibold">
                      {item.layers.length} Lớp
                    </span>
                    <span className="font-body text-[11px] text-[#605850]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#3a302a] group-hover:text-[#c2652a] transition-colors truncate">
                    {item.topic}
                  </h3>
                  <p className="font-body text-xs text-[#605850] line-clamp-2 mt-1">
                    {item.layers[item.layers.length - 1]?.title || 'Nghiên cứu đa lớp'}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-label text-[#c2652a] font-semibold uppercase tracking-wider">
                  <span>Tiếp Tục Khám Phá</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

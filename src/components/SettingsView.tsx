import React from 'react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onClearAllData,
}) => {
  const levelLabels: Record<string, string> = {
    simplified: 'Đơn giản',
    standard: 'Tiêu chuẩn',
    expert: 'Chuyên gia'
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-6 py-10 font-body min-h-[calc(100vh-140px)] text-left">
      <div className="border-b border-[#d8d0c8]/60 pb-5 mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#3a302a]">
          Cài Đặt & Tùy Chỉnh
        </h1>
        <p className="font-body text-sm text-[#605850] mt-1">
          Cấu hình số lớp tối đa, mức độ chi tiết của AI và giọng đọc thuyết minh
        </p>
      </div>

      <div className="space-y-6">
        {/* Maximum Drill-Down Depth */}
        <div className="p-6 rounded-xl border border-[#d8d0c8]/60 bg-[#f6f0e8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#3a302a]">
              Số Lớp Khám Phá Tối Đa
            </h3>
            <p className="font-body text-xs text-[#605850] mt-1">
              Chọn độ sâu khám phá của mỗi chủ đề (số lượng tầng sơ đồ khoa học)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 20, 99999].map((depth) => (
              <button
                key={depth}
                onClick={() => onUpdateSettings({ maxDepth: depth })}
                className={`px-3 h-10 rounded-lg font-label text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  settings.maxDepth === depth
                    ? 'bg-[#c2652a] text-white shadow-2xs'
                    : 'bg-[#faf5ee] border border-[#d8d0c8] text-[#3a302a] hover:border-[#c2652a]'
                }`}
              >
                {depth >= 99999 ? 'Vô hạn (∞)' : depth}
              </button>
            ))}
          </div>
        </div>

        {/* AI Detail Level */}
        <div className="p-6 rounded-xl border border-[#d8d0c8]/60 bg-[#f6f0e8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#3a302a]">
              Mức Độ Chi Tiết Của AI
            </h3>
            <p className="font-body text-xs text-[#605850] mt-1">
              Tùy chỉnh độ phức tạp và thuật ngữ chuyên ngành trong phần giải thích
            </p>
          </div>
          <div className="flex gap-2">
            {(['simplified', 'standard', 'expert'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onUpdateSettings({ aiDetailLevel: level })}
                className={`px-3 py-2 rounded-lg font-label text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  settings.aiDetailLevel === level
                    ? 'bg-[#c2652a] text-white shadow-2xs'
                    : 'bg-[#faf5ee] border border-[#d8d0c8] text-[#3a302a] hover:border-[#c2652a]'
                }`}
              >
                {levelLabels[level] || level}
              </button>
            ))}
          </div>
        </div>

        {/* Speech Narration Toggle */}
        <div className="p-6 rounded-xl border border-[#d8d0c8]/60 bg-[#f6f0e8] flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#3a302a]">
              Tự Động Phát Thuyết Minh
            </h3>
            <p className="font-body text-xs text-[#605850] mt-1">
              Tự động đọc bản tóm tắt khi bạn mở một lớp độ sâu mới
            </p>
          </div>
          <button
            onClick={() => onUpdateSettings({ autoPlaySpeech: !settings.autoPlaySpeech })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              settings.autoPlaySpeech ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                settings.autoPlaySpeech ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Clear Data */}
        <div className="p-6 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-rose-900">
              Xóa Toàn Bộ Dữ Liệu Khám Phá
            </h3>
            <p className="font-body text-xs text-rose-700 mt-1">
              Xóa lịch sử tìm kiếm, bộ tài liệu đã lưu và dữ liệu đã lưu tạm
            </p>
          </div>
          <button
            onClick={onClearAllData}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white font-label text-xs uppercase tracking-wider font-semibold hover:bg-rose-700 transition-colors cursor-pointer self-start sm:self-center"
          >
            Xóa Dữ Liệu
          </button>
        </div>
      </div>
    </main>
  );
};

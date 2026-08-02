import React, { useState, useEffect } from 'react';
import { ExplorationLayer } from '../types';

interface LayerDetailPanelProps {
  layer: ExplorationLayer;
  totalLayers: number;
  onDrillDeeper: (suggestedTopic?: string) => void;
  autoPlaySpeech?: boolean;
}

export const LayerDetailPanel: React.FC<LayerDetailPanelProps> = ({
  layer,
  totalLayers,
  onDrillDeeper,
  autoPlaySpeech = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});

  // Stop speech when changing layer
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setQuizAnswers({});
    setShowQuizResults({});

    if (autoPlaySpeech && 'speechSynthesis' in window && layer.audioScript) {
      const utterance = new SpeechSynthesisUtterance(layer.audioScript);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  }, [layer, autoPlaySpeech]);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = layer.audioScript || `${layer.title}. ${layer.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleSelectQuizOption = (qId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setShowQuizResults((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-8 text-left font-body">
      {/* Title & Speech Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d8d0c8]/60 pb-5">
        <div>
          <span className="font-label text-xs uppercase tracking-widest text-[#c2652a] font-semibold">
            {layer.depthLabel}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#3a302a] mt-1 leading-tight">
            {layer.title}
          </h2>
          <p className="font-body text-sm text-[#605850] mt-1 font-light">
            {layer.subtitle}
          </p>
        </div>

        {/* Audio Narrator Control */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer self-start sm:self-center font-label text-xs font-semibold uppercase tracking-wider ${
            isPlayingAudio
              ? 'bg-[#c2652a] text-white border-[#c2652a] shadow-sm'
              : 'border-[#d8d0c8] text-[#3a302a] hover:border-[#c2652a] hover:text-[#c2652a] hover:bg-[#ece6dc]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {isPlayingAudio ? 'volume_up' : 'volume_off'}
          </span>
          <span>{isPlayingAudio ? 'Đang phát...' : 'Nghe Thuyết Minh'}</span>
        </button>
      </div>

      {/* Scientific Summary */}
      <div className="bg-[#f6f0e8] p-6 rounded-xl border border-[#d8d0c8]/60 shadow-2xs">
        <h3 className="font-display text-xl font-semibold text-[#3a302a] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c2652a] text-xl">menu_book</span>
          Tổng Quan Khoa Học Về Lớp
        </h3>
        <p className="font-body text-base text-[#3a302a]/90 leading-relaxed whitespace-pre-line">
          {layer.summary}
        </p>
      </div>

      {/* Key Metrics Grid */}
      {layer.keyMetrics && layer.keyMetrics.length > 0 && (
        <div>
          <h3 className="font-display text-xl font-semibold text-[#3a302a] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c2652a] text-xl">analytics</span>
            Chỉ Số Khoa Học Quan Trọng
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {layer.keyMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#d8d0c8]/60 bg-[#faf5ee] shadow-2xs flex flex-col"
              >
                <span className="font-label text-xs uppercase tracking-wider text-[#605850]">
                  {metric.label}
                </span>
                <span className="font-display text-2xl font-bold text-[#c2652a] mt-1">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Quiz Section */}
      {layer.quiz && layer.quiz.length > 0 && (
        <div className="p-6 rounded-xl border border-[#d8d0c8]/60 bg-[#f2ece4] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-[#3a302a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c2652a] text-xl">quiz</span>
              Kiểm Tra Kiến Thức: Lớp {layer.depthIndex}
            </h3>
            <span className="font-label text-xs text-[#605850] uppercase tracking-wider font-semibold">
              Câu Hỏi Trắc Nghiệm
            </span>
          </div>

          {layer.quiz.map((q) => {
            const selectedIdx = quizAnswers[q.id];
            const isAnswered = showQuizResults[q.id];
            const isCorrect = selectedIdx === q.correctAnswerIndex;

            return (
              <div key={q.id} className="p-4 rounded-lg bg-[#faf5ee] border border-[#d8d0c8]/60 space-y-3">
                <p className="font-display text-base font-semibold text-[#3a302a]">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((option, optIdx) => {
                    let optionBtnClass = "border-[#d8d0c8] bg-[#faf5ee] text-[#3a302a] hover:border-[#c2652a]";

                    if (isAnswered) {
                      if (optIdx === q.correctAnswerIndex) {
                        optionBtnClass = "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold";
                      } else if (optIdx === selectedIdx) {
                        optionBtnClass = "border-rose-500 bg-rose-50 text-rose-900";
                      } else {
                        optionBtnClass = "border-[#d8d0c8]/40 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(q.id, optIdx)}
                        className={`text-left p-3 rounded-lg border text-sm transition-all duration-150 cursor-pointer font-body ${optionBtnClass}`}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${isCorrect ? 'bg-emerald-100/80 text-emerald-900' : 'bg-amber-100/80 text-amber-900'}`}>
                    <span className="font-bold mr-1">
                      {isCorrect ? '✓ Chính xác!' : 'ℹ Giải thích:'}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Suggested Next Drill-Down Prompts */}
      <div className="pt-4 border-t border-[#d8d0c8]/60">
        <h3 className="font-display text-xl font-semibold text-[#3a302a] mb-3">
          Khám Phá Các Lộ Trình Sâu Hơn
        </h3>
        <div className="flex flex-wrap gap-3">
          {layer.suggestedNextTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onDrillDeeper(topic)}
              className="ghost-button px-5 py-3 rounded-full font-label text-xs font-semibold text-[#3a302a] uppercase tracking-wider flex items-center gap-2 hover:border-[#c2652a] hover:text-[#c2652a] cursor-pointer"
            >
              <span>{topic}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ))}
          {(layer.depthIndex < totalLayers || totalLayers >= 100) && (
            <button
              onClick={() => onDrillDeeper()}
              className="px-6 py-3 rounded-full bg-[#c2652a] text-white font-label text-xs font-semibold uppercase tracking-wider hover:bg-[#a5521f] transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>Khoan Vào Lớp {layer.depthIndex + 1} →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

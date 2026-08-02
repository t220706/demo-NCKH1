/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ExplorationSession, ExplorationLayer, AppSettings, TabType, Hotspot } from './types';
import { PRESET_VOLCANO, FEATURED_PRESETS } from './data/presetTopics';
import { TopHeader } from './components/TopHeader';
import { LandingView } from './components/LandingView';
import { ExplorationCanvas } from './components/ExplorationCanvas';
import { ExplorationPathStrip } from './components/ExplorationPathStrip';
import { LayerDetailPanel } from './components/LayerDetailPanel';
import { HistoryView } from './components/HistoryView';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';

const STORAGE_KEY_HISTORY = 'drilldown_history_v1';
const STORAGE_KEY_SETTINGS = 'drilldown_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  maxDepth: 99999,
  aiDetailLevel: 'standard',
  autoPlaySpeech: false,
  speechVoice: 'default',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('explore');
  const [currentSession, setCurrentSession] = useState<ExplorationSession | null>(null);
  const [history, setHistory] = useState<ExplorationSession[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load persistent history & settings on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.warn("Could not parse saved storage data:", e);
    }
  }, []);

  // Save history updates to localStorage
  const saveHistoryToStorage = (updatedHistory: ExplorationSession[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn("Failed to write history to localStorage:", e);
    }
  };

  // Save settings updates
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save settings:", e);
    }
  };

  // Start exploration for a given topic string
  const handleExploreTopic = async (topicName: string) => {
    setErrorMsg(null);
    const cleanTopic = topicName.trim();
    if (!cleanTopic) return;

    // Check if topic matches preset
    if (cleanTopic.toLowerCase().includes('volcano') || cleanTopic.toLowerCase().includes('magma')) {
      setCurrentSession(PRESET_VOLCANO);
      setCurrentTab('explore');
      saveHistoryToStorage([PRESET_VOLCANO, ...history.filter(h => h.id !== PRESET_VOLCANO.id)]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cleanTopic,
          depthIndex: 1,
          totalLayers: settings.maxDepth
        })
      });

      const data = await res.json();
      if (data.layer) {
        const newSession: ExplorationSession = {
          id: `session_${Date.now()}`,
          topic: cleanTopic,
          currentDepthIndex: 1,
          totalLayers: settings.maxDepth,
          createdAt: new Date().toISOString(),
          layers: [data.layer]
        };

        setCurrentSession(newSession);
        setCurrentTab('explore');
        saveHistoryToStorage([newSession, ...history.filter(h => h.id !== newSession.id)]);
      } else {
        throw new Error("Failed to generate layer");
      }
    } catch (err: any) {
      console.error("Error exploring topic:", err);
      // Fallback local layer creation
      const fallbackLayer: ExplorationLayer = {
        depthIndex: 1,
        depthLabel: "ĐỘ SÂU: 0KM (BỀ MẶT)",
        title: `Hình 1: Tổng Quan Về ${cleanTopic}`,
        subtitle: `Góc nhìn bề mặt ban đầu và động lực học vĩ mô của ${cleanTopic}`,
        imageUrl: PRESET_VOLCANO.layers[0].imageUrl,
        imageAlt: `Sơ đồ minh họa cho ${cleanTopic}`,
        summary: `Khám phá các thuộc tính cơ bản của ${cleanTopic}. Qua nhiều lớp độ sâu, chúng ta sẽ phân tích động lực bên trong, sự chuyển giao năng lượng và các thành phần vi mô.`,
        keyMetrics: [
          { label: "Mức Độ Sâu", value: "1 / " + settings.maxDepth },
          { label: "Quy Mô", value: "Vĩ mô" },
          { label: "Trạng Thái", value: "Đang khám phá" }
        ],
        hotspots: [
          { id: "h1", x: 45, y: 35, label: "Lõi Trọng Tâm", description: `Vùng trọng tâm chính của ${cleanTopic}.` },
          { id: "h2", x: 70, y: 60, label: "Lớp Ranh Giới", description: "Mặt phân cách giữa các đặc tính vĩ mô và vi mô." }
        ],
        quiz: [
          {
            id: "q1",
            question: `Trọng tâm chính của Lớp 1 khi khám phá ${cleanTopic} là gì?`,
            options: ["Địa hình bề mặt và cấu trúc vĩ mô", "Chỉ là các hạt dưới nguyên tử", "Mô hình thời tiết bên ngoài", "Vật lý chân không thuần túy"],
            correctAnswerIndex: 0,
            explanation: "Lớp 1 cung cấp cái nhìn tổng quan vĩ mô trước khi khoan sâu vào các tầng bên dưới."
          }
        ],
        suggestedNextTopics: [
          `Khoan sâu vào Lớp 2 của ${cleanTopic}`,
          `Khám phá dòng năng lượng bên trong`,
          `Phân tích các thành phần cấu trúc cốt lõi`
        ],
        audioScript: `Lớp 1: Tổng quan về ${cleanTopic}. Bắt đầu hành trình khám phá đa lớp.`
      };

      const newSession: ExplorationSession = {
        id: `session_${Date.now()}`,
        topic: cleanTopic,
        currentDepthIndex: 1,
        totalLayers: settings.maxDepth,
        createdAt: new Date().toISOString(),
        layers: [fallbackLayer]
      };

      setCurrentSession(newSession);
      setCurrentTab('explore');
      saveHistoryToStorage([newSession, ...history.filter(h => h.id !== newSession.id)]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const found = FEATURED_PRESETS.find(p => p.id === presetId);
    if (found && found.session) {
      setCurrentSession(found.session);
      setCurrentTab('explore');
      saveHistoryToStorage([found.session, ...history.filter(h => h.id !== found.session.id)]);
    } else {
      handleExploreTopic(found ? found.title : presetId);
    }
  };

  // Drill down deeper into next layer
  const handleDrillDeeper = async (suggestedTopicOrHotspot?: string | Hotspot) => {
    if (!currentSession) return;

    const currentIdx = currentSession.currentDepthIndex;
    const nextIdx = currentIdx + 1;

    // Check if next layer is already in session.layers
    const existingLayer = currentSession.layers.find(l => l.depthIndex === nextIdx);
    if (existingLayer) {
      setCurrentSession({
        ...currentSession,
        currentDepthIndex: nextIdx
      });
      return;
    }

    setIsLoading(true);

    try {
      const focusText = typeof suggestedTopicOrHotspot === 'string'
        ? suggestedTopicOrHotspot
        : suggestedTopicOrHotspot?.label;

      const newTotalLayers = Math.max(currentSession.totalLayers, nextIdx);

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentSession.topic,
          depthIndex: nextIdx,
          totalLayers: newTotalLayers,
          focusArea: focusText
        })
      });

      const data = await res.json();
      if (data.layer) {
        const updatedLayers = [...currentSession.layers, data.layer];
        const updatedSession: ExplorationSession = {
          ...currentSession,
          currentDepthIndex: nextIdx,
          totalLayers: newTotalLayers,
          layers: updatedLayers
        };
        setCurrentSession(updatedSession);
        saveHistoryToStorage([updatedSession, ...history.filter(h => h.id !== updatedSession.id)]);
      }
    } catch (err) {
      console.error("Error drilling deeper:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLayer = (depthIdx: number) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        currentDepthIndex: depthIdx
      });
    }
  };

  const handleResetSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        currentDepthIndex: 1
      });
    } else {
      setCurrentTab('explore');
    }
  };

  const handleToggleBookmark = () => {
    if (!currentSession) return;
    const updated = {
      ...currentSession,
      bookmarked: !currentSession.bookmarked
    };
    setCurrentSession(updated);
    saveHistoryToStorage(history.map(h => h.id === updated.id ? updated : h));
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn(e);
    }
  };

  const currentLayer = currentSession
    ? currentSession.layers.find(l => l.depthIndex === currentSession.currentDepthIndex) || currentSession.layers[0]
    : null;

  return (
    <div className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-body flex flex-col pb-24">
      {/* Top Header Bar */}
      <TopHeader
        session={currentSession}
        currentDepthIndex={currentSession?.currentDepthIndex || 1}
        totalLayers={currentSession?.totalLayers || settings.maxDepth}
        onBack={() => {
          if (currentSession) {
            setCurrentSession(null);
          } else {
            setCurrentTab('explore');
          }
        }}
        onReset={handleResetSession}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Main Content Area based on active tab and state */}
      {currentTab === 'history' ? (
        <HistoryView
          history={history}
          onOpenSession={(sess) => {
            setCurrentSession(sess);
            setCurrentTab('explore');
          }}
          onClearHistory={handleClearHistory}
        />
      ) : currentTab === 'library' ? (
        <LibraryView
          bookmarks={history.filter(h => h.bookmarked)}
          onOpenSession={(sess) => {
            setCurrentSession(sess);
            setCurrentTab('explore');
          }}
          onSelectPreset={handleSelectPreset}
        />
      ) : currentTab === 'settings' ? (
        <SettingsView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClearAllData={handleClearHistory}
        />
      ) : (
        /* Explore Tab */
        !currentSession ? (
          <LandingView
            onExploreTopic={handleExploreTopic}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />
        ) : (
          <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-4xl mx-auto space-y-6 text-center">
            {isLoading && (
              <div className="w-full p-4 rounded-xl bg-[#c2652a]/10 border border-[#c2652a]/30 text-[#c2652a] font-label text-xs uppercase tracking-wider flex items-center justify-center gap-3 animate-pulse">
                <span className="w-4 h-4 border-2 border-[#c2652a] border-t-transparent rounded-full animate-spin" />
                Đang Khoan Vào Lớp {currentSession.currentDepthIndex}...
              </div>
            )}

            {currentLayer && (
              <>
                {/* 16:9 Scientific Illustration Canvas */}
                <ExplorationCanvas
                  layer={currentLayer}
                  onDrillDown={handleDrillDeeper}
                />

                {/* Collapsible Thumbnail Path Strip */}
                <ExplorationPathStrip
                  layers={currentSession.layers}
                  currentDepthIndex={currentSession.currentDepthIndex}
                  totalLayers={currentSession.totalLayers}
                  onSelectLayer={handleSelectLayer}
                  onDrillDeeper={() => handleDrillDeeper()}
                />

                {/* Layer Detail Overview, Metrics, Audio & Quiz */}
                <LayerDetailPanel
                  layer={currentLayer}
                  totalLayers={currentSession.totalLayers}
                  onDrillDeeper={handleDrillDeeper}
                  autoPlaySpeech={settings.autoPlaySpeech}
                />
              </>
            )}
          </main>
        )
      )}

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}

import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'history', label: 'Lịch Sử', icon: 'history' },
    { id: 'explore', label: 'Khám Phá', icon: 'search' },
    { id: 'library', label: 'Thư Viện', icon: 'auto_stories' },
    { id: 'settings', label: 'Cài Đặt', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 bg-[#faf5ee] border-t border-[#d8d0c8]/80 shadow-[0_-4px_12px_rgba(58,48,42,0.05)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 cursor-pointer ${
              isActive
                ? 'text-[#c2652a] border-t-2 border-[#c2652a] -mt-[2px] font-semibold'
                : 'text-[#605850] opacity-70 hover:opacity-100 hover:text-[#3a302a]'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {tab.icon}
            </span>
            <span className="font-label text-[11px] tracking-widest uppercase mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Music } from 'lucide-react';
import { Mode, Settings, Task } from '../types';
import { GlassCard } from './GlassCard';

interface TimerViewProps {
  mode: Mode;
  timeLeft: number;
  isActive: boolean;
  activeTaskId: string | null;
  tasks: Task[];
  settings: Settings;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onModeChange: (mode: Mode) => void;
  onSkip: () => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  mode,
  timeLeft,
  isActive,
  activeTaskId,
  tasks,
  settings,
  onToggleTimer,
  onResetTimer,
  onModeChange,
  onSkip,
}) => {
  const totalTime = settings.durations[mode] * 60;
  const percentage = ((totalTime - timeLeft) / totalTime) * 100;
  
  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      
      {/* Mode Selector */}
      <GlassCard className="flex p-1 gap-2 rounded-full" noPadding>
        {Object.values(Mode).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${mode === m 
                ? 'bg-white text-indigo-900 shadow-md' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'}
            `}
          >
            {m === Mode.FOCUS ? 'Focus' : m === Mode.SHORT_BREAK ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </GlassCard>

      {/* Main Timer Ring */}
      <div className="relative w-72 h-72 md:w-96 md:h-96">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={283 * (window.innerWidth > 768 ? 3.5 : 2.6)} /* Approximate circ calc for responsive */
            strokeDashoffset={(283 * (window.innerWidth > 768 ? 3.5 : 2.6)) * (1 - percentage / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{ 
              strokeDasharray: `${2 * Math.PI * 45}%`, 
              strokeDashoffset: `${2 * Math.PI * 45 * (percentage / 100)}%` 
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-7xl md:text-8xl font-bold tracking-tighter drop-shadow-lg">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-4 text-lg font-light tracking-widest uppercase opacity-80">
            {isActive ? 'Running' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Active Task Indicator */}
      {activeTaskId && activeTask && (
        <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-center backdrop-blur-md">
          <span className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Working On</span>
          <span className="text-white font-medium text-lg">{activeTask.title}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleTimer}
          className="w-20 h-20 bg-white text-indigo-600 rounded-3xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-indigo-500/30"
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <div className="flex gap-4">
          <button 
            onClick={onResetTimer}
            className="w-14 h-14 bg-white/10 border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <RotateCcw size={24} />
          </button>
          <button 
            onClick={onSkip}
            className="w-14 h-14 bg-white/10 border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
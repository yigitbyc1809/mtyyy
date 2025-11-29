import React from 'react';
import { Settings, Mode } from '../types';
import { GlassCard } from './GlassCard';
import { Volume2, VolumeX, Moon, Sun, Globe, Clock, RefreshCcw } from 'lucide-react';
import { PRESETS, AMBIENT_SOUNDS } from '../constants';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onResetData: () => void;
  applyPreset: (preset: { focus: number; short: number; long: number }) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  settings, 
  onUpdateSettings, 
  onResetData,
  applyPreset
}) => {
  
  const handleDurationChange = (mode: Mode, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      onUpdateSettings({
        ...settings,
        durations: {
          ...settings.durations,
          [mode]: num
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-white pb-20 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">Settings</h2>

      {/* Timer Settings */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-indigo-300" />
          <h3 className="text-xl font-semibold">Timer Duration (minutes)</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Focus</label>
            <input 
              type="number" 
              value={settings.durations[Mode.FOCUS]}
              onChange={(e) => handleDurationChange(Mode.FOCUS, e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded p-2 text-white focus:outline-none focus:ring-2 ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Short Break</label>
            <input 
              type="number" 
              value={settings.durations[Mode.SHORT_BREAK]}
              onChange={(e) => handleDurationChange(Mode.SHORT_BREAK, e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded p-2 text-white focus:outline-none focus:ring-2 ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Long Break</label>
            <input 
              type="number" 
              value={settings.durations[Mode.LONG_BREAK]}
              onChange={(e) => handleDurationChange(Mode.LONG_BREAK, e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded p-2 text-white focus:outline-none focus:ring-2 ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm text-gray-300 mb-2">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset)}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs transition-colors border border-white/10"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Sound & Ambience */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="text-pink-300" />
          <h3 className="text-xl font-semibold">Sound & Ambience</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span>Notification Sounds</span>
          <button 
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-full transition-colors ${settings.soundEnabled ? 'bg-green-500/50' : 'bg-red-500/50'}`}
          >
            {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Background Ambience</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(AMBIENT_SOUNDS).map((soundKey) => (
              <button
                key={soundKey}
                onClick={() => onUpdateSettings({ ...settings, ambientSound: soundKey as any })}
                className={`
                  py-3 px-2 rounded-xl text-sm font-medium transition-all capitalize
                  ${settings.ambientSound === soundKey 
                    ? 'bg-indigo-500 text-white shadow-lg scale-105' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'}
                `}
              >
                {soundKey.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* General */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-emerald-300" />
          <h3 className="text-xl font-semibold">General</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span>Language</span>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button 
              onClick={() => onUpdateSettings({ ...settings, language: 'en' })}
              className={`px-3 py-1 rounded ${settings.language === 'en' ? 'bg-white text-black' : ''}`}
            >
              EN
            </button>
            <button 
              onClick={() => onUpdateSettings({ ...settings, language: 'tr' })}
              className={`px-3 py-1 rounded ${settings.language === 'tr' ? 'bg-white text-black' : ''}`}
            >
              TR
            </button>
          </div>
        </div>

        <button 
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 py-3 rounded-xl transition-colors border border-red-500/30 mt-4"
        >
          <RefreshCcw size={18} />
          Reset All App Data
        </button>
      </GlassCard>
    </div>
  );
};
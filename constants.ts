import { Mode, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  durations: {
    [Mode.FOCUS]: 25,
    [Mode.SHORT_BREAK]: 5,
    [Mode.LONG_BREAK]: 15,
  },
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  ambientSound: 'none',
  theme: 'dark',
  language: 'en',
};

export const PRESETS = [
  { focus: 25, short: 5, long: 15, label: 'Classic (25/5)' },
  { focus: 40, short: 10, long: 20, label: 'Deep Work (40/10)' },
  { focus: 50, short: 10, long: 30, label: 'Extended (50/10)' },
  { focus: 60, short: 15, long: 30, label: 'Hourly (60/15)' },
];

export const CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Coding'];

// Placeholder sounds (using short base64 or public URLs would be ideal, 
// here we simulate URLs for the Ambient Player)
export const AMBIENT_SOUNDS = {
  none: null,
  rain: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3',
  cafe: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-443.mp3',
  white_noise: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-1279.mp3',
};

export const NOTIFICATION_SOUND = 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3';
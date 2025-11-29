export enum Mode {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: string;
  pomodoros: number; // Number of sessions spent
  dueDate?: string;
  subtasks: { id: string; title: string; completed: boolean }[];
}

export interface Settings {
  durations: {
    [Mode.FOCUS]: number;
    [Mode.SHORT_BREAK]: number;
    [Mode.LONG_BREAK]: number;
  };
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'cafe' | 'white_noise';
  theme: 'dark' | 'light';
  language: 'en' | 'tr';
}

export interface DailyStats {
  date: string;
  focusMinutes: number;
  completedSessions: number;
  tasksCompleted: number;
}

export interface AppState {
  tasks: Task[];
  history: DailyStats[];
  settings: Settings;
}
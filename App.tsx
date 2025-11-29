import React, { useState, useEffect, useRef } from 'react';
import { Mode, Task, Settings, DailyStats, AppState } from './types';
import { DEFAULT_SETTINGS, AMBIENT_SOUNDS, NOTIFICATION_SOUND } from './constants';
import { TimerView } from './components/TimerView';
import { TodoView } from './components/TodoView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { Layout, CheckSquare, BarChart2, Settings as SettingsIcon, Clock } from 'lucide-react';

// Key for LocalStorage
const STORAGE_KEY = 'glassfocus_app_data';

const App: React.FC = () => {
  // --- State Initialization ---
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'stats' | 'settings'>('timer');
  
  // App Data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<DailyStats[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Timer State
  const [mode, setMode] = useState<Mode>(Mode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.durations[Mode.FOCUS] * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Refs for audio
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // --- Load/Save Data ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setTasks(parsed.tasks || []);
        setHistory(parsed.history || []);
        // Merge default settings with saved to ensure new keys exist
        setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  useEffect(() => {
    const data: AppState = { tasks, history, settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [tasks, history, settings]);

  // --- Audio Effect ---
  useEffect(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio();
      ambientAudioRef.current.loop = true;
    }

    const audio = ambientAudioRef.current;
    const soundUrl = AMBIENT_SOUNDS[settings.ambientSound];

    if (soundUrl && settings.soundEnabled) {
      if (audio.src !== soundUrl) {
        audio.src = soundUrl;
      }
      // Play only if active (or always if user wants background)
      // Usually ambient sound plays when timer runs or user toggles it manually.
      // For this app, let's play it when timer is running.
      if (isActive) {
        audio.play().catch(e => console.log("Audio play failed interaction required", e));
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [settings.ambientSound, settings.soundEnabled, isActive]);

  // --- Timer Logic ---
  useEffect(() => {
    // Reset timer when mode changes or settings duration changes
    if (!isActive) {
      setTimeLeft(settings.durations[mode] * 60);
    }
  }, [mode, settings.durations]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, timeLeft]);

  const playNotification = () => {
    if (settings.soundEnabled) {
      const audio = new Audio(NOTIFICATION_SOUND);
      audio.volume = 0.5;
      audio.play().catch(e => console.log(e));
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotification();

    // Update Stats
    if (mode === Mode.FOCUS) {
      const today = new Date().toISOString().split('T')[0];
      setHistory(prev => {
        const existing = prev.find(h => h.date === today);
        const minutesToAdd = settings.durations[Mode.FOCUS];
        
        if (existing) {
          return prev.map(h => h.date === today ? {
            ...h,
            focusMinutes: h.focusMinutes + minutesToAdd,
            completedSessions: h.completedSessions + 1
          } : h);
        } else {
          return [...prev, { date: today, focusMinutes: minutesToAdd, completedSessions: 1, tasksCompleted: 0 }];
        }
      });

      // Update Task Progress
      if (activeTaskId) {
        setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, pomodoros: t.pomodoros + 1 } : t));
      }

      // Auto switch
      if (settings.autoStartBreaks) {
        setMode(Mode.SHORT_BREAK);
        setIsActive(true);
      }
    } else {
      // Break finished
      if (settings.autoStartPomodoros) {
        setMode(Mode.FOCUS);
        setIsActive(true);
      }
    }
  };

  // --- Handlers ---
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings.durations[mode] * 60);
  };
  const skipTimer = () => {
    setIsActive(false);
    setTimeLeft(0); // This will trigger effect to complete immediately? No, effect depends on tick.
    // Better just complete manual
    handleTimerComplete();
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'pomodoros' | 'subtasks'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      pomodoros: 0,
      subtasks: []
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    const wasCompleted = tasks.find(t => t.id === id)?.completed;
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    
    // Update stats if marking complete
    if (!wasCompleted) {
      const today = new Date().toISOString().split('T')[0];
      setHistory(prev => {
        const existing = prev.find(h => h.date === today);
        if (existing) {
          return prev.map(h => h.date === today ? { ...h, tasksCompleted: h.tasksCompleted + 1 } : h);
        }
        return [...prev, { date: today, focusMinutes: 0, completedSessions: 0, tasksCompleted: 1 }];
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure? This will wipe all tasks and stats.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- Background Styles based on Mode ---
  const getBackgroundGradient = () => {
    switch (mode) {
      case Mode.FOCUS: return 'from-indigo-600 via-purple-600 to-pink-600';
      case Mode.SHORT_BREAK: return 'from-teal-500 via-emerald-500 to-green-500';
      case Mode.LONG_BREAK: return 'from-blue-600 via-cyan-600 to-sky-600';
      default: return 'from-indigo-600 via-purple-600 to-pink-600';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 flex flex-col`}>
      
      {/* Header / Top Bar */}
      <header className="p-6 flex justify-between items-center text-white z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Layout size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-wide">GlassFocus</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 md:pb-6 max-w-5xl mx-auto w-full">
        {activeTab === 'timer' && (
          <TimerView 
            mode={mode}
            timeLeft={timeLeft}
            isActive={isActive}
            activeTaskId={activeTaskId}
            tasks={tasks}
            settings={settings}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            onModeChange={(m) => { setIsActive(false); setMode(m); }}
            onSkip={skipTimer}
          />
        )}
        
        {activeTab === 'tasks' && (
          <TodoView 
            tasks={tasks}
            activeTaskId={activeTaskId}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSelectActive={(id) => {
              setActiveTaskId(id);
              setActiveTab('timer');
              setMode(Mode.FOCUS);
            }}
          />
        )}

        {activeTab === 'stats' && <StatsView history={history} />}

        {activeTab === 'settings' && (
          <SettingsView 
            settings={settings}
            onUpdateSettings={setSettings}
            onResetData={handleResetData}
            applyPreset={(preset) => {
              setSettings(s => ({
                ...s,
                durations: {
                  [Mode.FOCUS]: preset.focus,
                  [Mode.SHORT_BREAK]: preset.short,
                  [Mode.LONG_BREAK]: preset.long
                }
              }));
              alert(`Applied preset: ${preset.focus} / ${preset.short} / ${preset.long}`);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center md:static md:bg-transparent">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex gap-2 shadow-2xl">
          <NavButton 
            active={activeTab === 'timer'} 
            onClick={() => setActiveTab('timer')} 
            icon={<Clock size={20} />} 
            label="Timer" 
          />
          <NavButton 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            icon={<CheckSquare size={20} />} 
            label="Tasks" 
          />
          <NavButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<BarChart2 size={20} />} 
            label="Stats" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300
      ${active ? 'bg-white text-indigo-900 shadow-lg translate-y-[-4px]' : 'text-white/60 hover:text-white hover:bg-white/10'}
    `}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export default App;
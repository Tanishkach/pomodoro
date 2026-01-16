'use client'
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

//pixel fontttt
const GlobalStyles = () => (
  <style jsx global>{`
    @font-face {
      font-family: 'DePixelBreit';
      src: url('/fonts/depixelbreit.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    
    body, * {
      font-family: 'DePixelBreit', monospace !important;
    }
  `}</style>
);

// Theme Configuration
const THEMES = {
  snoopy: {
    name: 'Snoopy',
    bgImage: '/snoopy_theme.jpg',
    textColor: '#2d1810',
    textOutline: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
    emoji: ''
  },
  minecraft: {
    name: 'Minecraft',
    bgImage: '/minecraft_theme.jpg',
    textColor: '#1a1a4d',
    textOutline: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
    emoji: ''
  },
  green: {
    name: 'Green',
    bgImage: '/green_theme.jpg',
    textColor: '#1a3d1a',
    textOutline: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
    emoji: ''
  },
  flowers: {
    name: 'Flowers',
    bgImage: '/flowers_theme.jpg',
    textColor: '#e075b4',
    textOutline: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
    emoji: ''
  },
  cozy: {
    name: 'Cozy',
    bgImage: '/cozy_theme.png',
    textColor: '#57352f',
    textOutline: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
    emoji: ''
  },
  blue: {
    name: 'Blue',
    bgImage: '/blue_theme.jpg',
    textColor: '#cccce6',
    textOutline: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
    emoji: ''
  }
};

// Theme Context
interface ThemeContextType {
  currentTheme: string;
  changeTheme: (themeName: string) => void;
  theme: typeof THEMES[keyof typeof THEMES];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState('cozy');

  useEffect(() => {
    const saved = localStorage.getItem('pomodoroTheme');
    if (saved && THEMES[saved as keyof typeof THEMES]) setCurrentTheme(saved);
  }, []);

  const changeTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem('pomodoroTheme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, theme: THEMES[currentTheme as keyof typeof THEMES] }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Selector Component
const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6">
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => changeTheme(key)}
          className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
            currentTheme === key
              ? 'bg-white/90 shadow-lg scale-110'
              : 'bg-white/60 hover:bg-white/75 hover:scale-105'
          }`}
          style={{
            color: '#000000'
            
          }}
        >
          {theme.emoji} {theme.name}
        </button>
      ))}
    </div>
  );
};

// Settings Component
const SettingsInputs = ({ focusTime, breakTime, onFocusChange, onBreakChange, disabled }: { focusTime: number; breakTime: number; onFocusChange: (value: number) => void; onBreakChange: (value: number) => void; disabled: boolean }) => {
  const { theme } = useTheme();

  return (
    <div className="flex gap-4 justify-center items-center flex-wrap mb-6">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <label className="block text-xs font-semibold mb-2" style={{ color: theme.textColor, textShadow: theme.textOutline }}>
          Focus Time (min)
        </label>
        <input
          type="number"
          min="1"
          max="120"
          value={focusTime}
          onChange={(e) => onFocusChange(Number(e.target.value))}
          disabled={disabled}
          className="w-24 px-3 py-2 rounded-lg text-center text-base font-bold border-2 border-white focus:border-gray-700 focus:outline-none disabled:opacity-50"
          style={{ color: theme.textColor }}
        />
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <label className="block text-xs font-semibold mb-2" style={{ color: theme.textColor, textShadow: theme.textOutline }}>
          Break Time (min)
        </label>
        <input
          type="number"
          min="1"
          max="60"
          value={breakTime}
          onChange={(e) => onBreakChange(Number(e.target.value))}
          disabled={disabled}
          className="w-24 px-3 py-2 rounded-lg text-center text-base font-bold border-2 border-white focus:border-gray-700 focus:outline-none disabled:opacity-50"
          style={{ color: theme.textColor }}
        />
      </div>
    </div>
  );
};

// Timer Display Component
const TimerDisplay = ({ minutes, seconds, mode }: { minutes: number; seconds: number; mode: string }) => {
  const { theme } = useTheme();

  return (
    <div className="text-center mb-8">
      <div
        className="text-xl font-bold mb-4 tracking-wider"
        style={{ color: theme.textColor, textShadow: theme.textOutline }}
      >
        {mode === 'focus' ? 'FOCUS TIME' : 'BREAK TIME'}
      </div>
      <div
        className="text-6xl font-bold tracking-tight"
        style={{ color: theme.textColor, textShadow: theme.textOutline }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

// Timer Controls Component
const TimerControls = ({ isRunning, onStart, onPause, onReset }: { isRunning: boolean; onStart: () => void; onPause: () => void; onReset: () => void }) => {
  const { theme } = useTheme();

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={isRunning ? onPause : onStart}
        className="bg-white/90 hover:bg-white hover:scale-110 rounded-full p-6 shadow-xl transition-all duration-300"
        style={{ color: theme.textColor }}
      >
        {isRunning ? <Pause size={32} /> : <Play size={32} />}
      </button>
      <button
        onClick={onReset}
        className="bg-white/90 hover:bg-white hover:scale-110 rounded-full p-6 shadow-xl transition-all duration-300"
        style={{ color: theme.textColor }}
      >
        <RotateCcw size={32} />
      </button>
    </div>
  );
};

// Main Pomodoro Timer Component
const PomodoroTimer = () => {
  const { theme } = useTheme();
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
      const { focus, break: breakTime } = JSON.parse(saved);
      setFocusMinutes(focus);
      setBreakMinutes(breakTime);
      setTimeLeft(focus * 60);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      focus: focusMinutes,
      break: breakMinutes
    }));
  }, [focusMinutes, breakMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {

      const newMode = mode === 'focus' ? 'break' : 'focus';
      setMode(newMode);
      setTimeLeft(newMode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, focusMinutes, breakMinutes]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
  };

  const handleFocusChange = (value: number) => {
    setFocusMinutes(value);
    if (mode === 'focus' && !isRunning) {
      setTimeLeft(value * 60);
    }
  };

  const handleBreakChange = (value: number) => {
    setBreakMinutes(value);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(value * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="min-h-screen transition-all duration-700 ease-in-out flex items-center justify-end p-4 pr-8"
      style={{
        backgroundImage: `url(${theme.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-xl">
        <div className="bg-white/10 backdrop-blur-xs rounded-3xl shadow-2xl border border-white p-8">
          {/* <h1
            className="text-5xl font-bold text-center mb-8 tracking-tight"
            style={{ color: theme.textColor, textShadow: theme.textOutline }}
          >
            🍅 Pomodoro Timer
          </h1> */}
          
          <ThemeSelector />
          
          <SettingsInputs
            focusTime={focusMinutes}
            breakTime={breakMinutes}
            onFocusChange={handleFocusChange}
            onBreakChange={handleBreakChange}
            disabled={isRunning}
          />

          <TimerDisplay minutes={minutes} seconds={seconds} mode={mode} />
          
          <TimerControls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />

          <div
            className="text-center text-sm mt-6"
            style={{ color: '#FFFFFF' }}
          >
            Motivation didn’t disappear — you just opened Instagram, again
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <PomodoroTimer />
    </ThemeProvider>
  );
}
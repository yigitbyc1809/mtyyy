import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlassCard } from './GlassCard';
import { DailyStats } from '../types';
import { Trophy, Flame, Target } from 'lucide-react';

interface StatsViewProps {
  history: DailyStats[];
}

export const StatsView: React.FC<StatsViewProps> = ({ history }) => {
  // Calculate totals
  const totalMinutes = history.reduce((acc, day) => acc + day.focusMinutes, 0);
  const totalSessions = history.reduce((acc, day) => acc + day.completedSessions, 0);
  const totalTasks = history.reduce((acc, day) => acc + day.tasksCompleted, 0);
  
  // Prepare data for chart (last 7 entries)
  const chartData = history.slice(-7);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
        Productivity Insights
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-pink-500/30 rounded-full">
            <Target className="w-6 h-6 text-pink-200" />
          </div>
          <div>
            <p className="text-sm text-gray-300">Total Focus</p>
            <p className="text-2xl font-bold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/30 rounded-full">
            <Flame className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <p className="text-sm text-gray-300">Sessions</p>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/30 rounded-full">
            <Trophy className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <p className="text-sm text-gray-300">Tasks Done</p>
            <p className="text-2xl font-bold">{totalTasks}</p>
          </div>
        </GlassCard>
      </div>

      {/* Chart */}
      <GlassCard className="h-80 w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">Daily Focus Minutes</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.1)'}}
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
            />
            <Bar dataKey="focusMinutes" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#colorGradient)`} />
              ))}
            </Bar>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};
import React, { useState } from 'react';
import { Task, Priority, Mode } from '../types';
import { GlassCard } from './GlassCard';
import { CATEGORIES } from '../constants';
import { Plus, Trash2, Calendar, PlayCircle, CheckCircle, Circle, GripVertical } from 'lucide-react';

interface TodoViewProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (task: Omit<Task, 'id' | 'pomodoros' | 'subtasks'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSelectActive: (id: string) => void;
}

export const TodoView: React.FC<TodoViewProps> = ({ 
  tasks, 
  activeTaskId, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onSelectActive 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState(CATEGORIES[0]);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    onAddTask({
      title: newTaskTitle,
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
    });
    
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.HIGH: return 'bg-red-500 text-white';
      case Priority.MEDIUM: return 'bg-yellow-500 text-white';
      case Priority.LOW: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
          My Tasks
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <GlassCard className="animate-slide-down">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              className="w-full bg-transparent border-b border-white/30 py-2 px-1 text-lg text-white placeholder-white/50 focus:outline-none focus:border-white"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
            <div className="flex gap-4 flex-wrap">
              <select 
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
              </select>
              <select 
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                {Object.values(Priority).map(p => <option key={p} value={p} className="text-black">{p}</option>)}
              </select>
              <button 
                type="submit" 
                className="ml-auto bg-white text-indigo-900 px-6 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 && !isAdding && (
          <div className="text-center py-10 text-white/50">
            <p>No tasks yet. Stay productive!</p>
          </div>
        )}
        
        {tasks.map((task) => (
          <GlassCard 
            key={task.id} 
            noPadding 
            className={`
              group flex items-center p-4 transition-all duration-200
              ${task.completed ? 'opacity-60 grayscale' : ''}
              ${activeTaskId === task.id ? 'ring-2 ring-indigo-400 bg-white/15' : 'hover:bg-white/15'}
            `}
          >
            {/* Drag Handle (Visual only for now) */}
            <div className="mr-3 text-white/30 cursor-grab">
              <GripVertical size={20} />
            </div>

            {/* Checkbox */}
            <button 
              onClick={() => onToggleTask(task.id)}
              className="mr-4 text-white hover:text-green-400 transition-colors"
            >
              {task.completed ? <CheckCircle size={24} className="text-green-400" /> : <Circle size={24} />}
            </button>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-white/50' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-xs text-indigo-200 bg-indigo-500/20 px-2 py-0.5 rounded">
                  {task.category}
                </span>
                {task.pomodoros > 0 && (
                  <span className="text-xs text-pink-200 bg-pink-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle size={10} /> {task.pomodoros} sessions
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!task.completed && (
                <button 
                  onClick={() => onSelectActive(task.id)}
                  title="Focus on this task"
                  className={`p-2 rounded-full transition-colors ${activeTaskId === task.id ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-indigo-500 hover:text-white'}`}
                >
                  <PlayCircle size={20} />
                </button>
              )}
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="p-2 bg-white/10 rounded-full hover:bg-red-500/80 hover:text-white transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
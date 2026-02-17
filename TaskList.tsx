
import React from 'react';
import { Task, TaskStatus, LeadPriority, UserRole } from '../types';
import { IconCheckCircle, IconClock, IconAlert } from './Icons';

interface Props {
  tasks: Task[];
  role: UserRole;
  onCompleteTask: (id: string) => void;
}

const TaskList: React.FC<Props> = ({ tasks, role, onCompleteTask }) => {
  const getPriorityColor = (priority: LeadPriority) => {
    switch (priority) {
      case LeadPriority.URGENT: return 'text-red-400 bg-red-400/10';
      case LeadPriority.HIGH: return 'text-orange-400 bg-orange-400/10';
      case LeadPriority.MEDIUM: return 'text-[#9BEC00] bg-[#9BEC00]/10';
      case LeadPriority.LOW: return 'text-slate-400 bg-slate-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return <IconCheckCircle className="text-emerald-400" />;
      case TaskStatus.OVERDUE: return <IconAlert className="text-rose-400" />;
      default: return <IconClock className="text-[#06D001]" />;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center border-white/10">
          <p className="text-slate-500">No tasks assigned. The team is caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className={`glass p-5 rounded-2xl flex items-center justify-between border-l-4 ${
              task.status === TaskStatus.COMPLETED ? 'border-emerald-500/50 opacity-60' : 
              task.status === TaskStatus.OVERDUE ? 'border-rose-500/50' : 'border-[#06D001]/50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="mt-1">{getStatusIcon(task.status)}</div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className={`font-bold ${task.status === TaskStatus.COMPLETED ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    {task.leadName && (
                      <span className="text-[10px] text-[#9BEC00] bg-[#9BEC00]/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                        Lead: {task.leadName}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                      Assigned to: {task.assignedTo}
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest ${task.status === TaskStatus.OVERDUE ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {task.status !== TaskStatus.COMPLETED && (
                <button 
                  onClick={() => onCompleteTask(task.id)}
                  className="px-4 py-2 bg-[#06D001]/10 text-[#06D001] text-xs font-bold rounded-xl hover:bg-[#06D001] hover:text-white transition-all border border-[#06D001]/20"
                >
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

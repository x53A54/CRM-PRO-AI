
import React, { useState } from 'react';
import { Lead, LeadPriority, TaskStatus, Task } from '../types';

interface Props {
  leads: Lead[];
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  preselectedLeadId?: string;
}

const CreateTaskModal: React.FC<Props> = ({ leads, onClose, onSave, preselectedLeadId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Alex Rivera');
  const [priority, setPriority] = useState<LeadPriority>(LeadPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [leadId, setLeadId] = useState(preselectedLeadId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === leadId);
    onSave({
      title,
      description,
      assignedTo,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      leadId: leadId || undefined,
      leadName: lead?.name,
      status: TaskStatus.PENDING
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass w-full max-w-lg p-8 rounded-[2rem] border border-white/10 relative z-10 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-white text-gradient-green">Assign New Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
              placeholder="e.g. Follow up on quote"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all h-24 text-white"
              placeholder="Details about the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Assign To</label>
              <select 
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all appearance-none text-white"
              >
                <option value="Alex Rivera">Alex Rivera</option>
                <option value="Jordan Smith">Jordan Smith</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Due Date</label>
              <input 
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Associate Lead (Optional)</label>
            <select 
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all appearance-none text-white"
            >
              <option value="">None</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 rounded-xl primary-gradient text-sm font-bold btn-hover-glow transition-all text-white shadow-lg"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

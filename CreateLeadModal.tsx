
import React, { useState } from 'react';
import { Lead, LeadStatus, LeadPriority } from '../types';

interface Props {
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
}

const CreateLeadModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState<LeadPriority>(LeadPriority.MEDIUM);
  const [owner, setOwner] = useState('Alex Rivera');
  const [value, setValue] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      phone,
      priority,
      owner,
      value: Number(value),
      status: LeadStatus.NEW,
      source: 'Manual Entry',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      activities: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'status_change',
        content: 'Lead manually created',
        timestamp: new Date().toISOString(),
        user: 'Manager'
      }]
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass w-full max-w-lg p-8 rounded-[2rem] border border-white/10 relative z-10 shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-white text-gradient-green">Create New Lead</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Customer Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Phone</label>
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
                placeholder="+1..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Assign Owner</label>
              <select 
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all appearance-none text-white"
              >
                <option value="Alex Rivera">Alex Rivera</option>
                <option value="Jordan Smith">Jordan Smith</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Lead Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as LeadPriority)}
                className="w-full bg-[#12141a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all appearance-none text-white"
              >
                <option value={LeadPriority.LOW}>Low</option>
                <option value={LeadPriority.MEDIUM}>Medium</option>
                <option value={LeadPriority.HIGH}>High</option>
                <option value={LeadPriority.URGENT}>Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1">Estimated Value ($)</label>
            <input 
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
            />
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
              className="px-8 py-3 rounded-xl accent-gradient text-sm font-bold btn-hover-glow transition-all text-white shadow-lg"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;

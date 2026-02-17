
import React from 'react';
import { Lead, LeadStatus, LeadPriority } from '../types';
import { IconClock, IconSparkles, IconAlert } from './Icons';
import { getApproachSuggestions } from '../intelligenceService';

interface Props {
  lead: Lead;
  onClose: () => void;
}

const LeadDetailPanel: React.FC<Props> = ({ lead, onClose }) => {
  const suggestions = getApproachSuggestions(lead);

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'text-[#06D001] bg-[#06D001]/10';
      case LeadStatus.IN_PROGRESS: return 'text-[#9BEC00] bg-[#9BEC00]/10';
      case LeadStatus.CLOSED: return 'text-emerald-400 bg-emerald-400/10';
      case LeadStatus.LOST: return 'text-rose-400 bg-rose-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== LeadStatus.CLOSED;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] glass border-l border-white/10 z-50 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div>
          <h3 className="text-xl font-bold text-white">{lead.name}</h3>
          <p className="text-sm text-slate-500">{lead.email}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors text-2xl leading-none">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-transparent to-[#0a0c10]/50">
        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Status</p>
            <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider ${getStatusColor(lead.status)}`}>{lead.status}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Priority</p>
            <span className={`text-[10px] font-bold uppercase ${lead.priority === LeadPriority.URGENT ? 'text-rose-400' : 'text-slate-200'}`}>{lead.priority}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Owner</p>
            <p className="text-sm text-slate-200">{lead.owner}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Lead Value</p>
            <p className="text-sm font-bold text-[#06D001]">${lead.value.toLocaleString()}</p>
          </div>
        </div>

        {/* Accountability Alert */}
        {isOverdue && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start space-x-3">
            <IconAlert className="w-5 h-5 text-rose-400 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-400">Accountability Breach</p>
              <p className="text-xs text-rose-400/80">This lead has exceeded its follow-up window. Immediate engagement required.</p>
            </div>
          </div>
        )}

        {/* Intelligence Engine */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
            <IconSparkles className="w-4 h-4 text-[#9BEC00]" />
            <span>Approach Intelligence</span>
          </h4>
          <div className="grid gap-3">
            {suggestions.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F3FF90]/5 border border-[#F3FF90]/10 hover:border-[#F3FF90]/20 transition-all">
                <p className="text-sm font-bold text-[#F3FF90] mb-1">{s.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
            <IconClock className="w-4 h-4 text-[#06D001]" />
            <span>Activity Logs</span>
          </h4>
          <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
            {lead.activities.map((activity) => (
              <div key={activity.id} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-[#12141a] border-2 border-[#06D001] flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#06D001]"></div>
                </div>
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-slate-300 capitalize">{activity.type.replace('_', ' ')}</p>
                  <p className="text-[10px] text-slate-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{activity.content}</p>
                <p className="text-[10px] text-slate-600 mt-1 italic">— {activity.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPanel;

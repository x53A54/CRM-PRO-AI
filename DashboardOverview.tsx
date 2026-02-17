
import React from 'react';
import { Lead, LeadStatus, UserRole } from '../types';
import { IconUsers, IconTrendingUp, IconClock, IconSparkles } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  leads: Lead[];
  role: UserRole;
}

const DashboardOverview: React.FC<Props> = ({ leads, role }) => {
  const stats = {
    total: leads.length,
    attended: leads.filter(l => l.status !== LeadStatus.NEW).length,
    overdue: leads.filter(l => l.followUpDate && new Date(l.followUpDate) < new Date()).length,
    lost: leads.filter(l => l.status === LeadStatus.LOST).length,
    success: (leads.filter(l => l.status === LeadStatus.CLOSED).length / (leads.length || 1) * 100).toFixed(0)
  };

  const statusData = [
    { name: 'New', value: leads.filter(l => l.status === LeadStatus.NEW).length, color: '#059212' },
    { name: 'In Progress', value: leads.filter(l => l.status === LeadStatus.IN_PROGRESS).length, color: '#06D001' },
    { name: 'Closed', value: leads.filter(l => l.status === LeadStatus.CLOSED).length, color: '#9BEC00' },
    { name: 'Lost', value: leads.filter(l => l.status === LeadStatus.LOST).length, color: '#334155' }, // Darker for lost
  ];

  const leadVelocityData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 3 },
    { name: 'Sun', value: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl glow-green border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#06D001]/5 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-[#06D001]/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Pipeline</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{stats.total}</h3>
            </div>
            <div className="p-3 bg-[#059212]/10 rounded-xl text-[#06D001]">
              <IconUsers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-[#06D001] mt-4 font-bold">+12% from last cycle</p>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Success Rate</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{stats.success}%</h3>
            </div>
            <div className="p-3 bg-[#9BEC00]/10 rounded-xl text-[#9BEC00]">
              <IconTrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-5">
             <div className="accent-gradient h-full rounded-full" style={{ width: `${stats.success}%` }}></div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Avg Response</p>
              <h3 className="text-3xl font-bold mt-1 text-white">1.2h</h3>
            </div>
            <div className="p-3 bg-[#06D001]/10 rounded-xl text-[#06D001]">
              <IconClock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-[#9BEC00] mt-4 font-bold">-24m optimization</p>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5 relative overflow-hidden group border-l-4 border-rose-500/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Overdue Action</p>
              <h3 className="text-3xl font-bold mt-1 text-rose-400">{stats.overdue}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
              <IconSparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-rose-400/60 mt-4 uppercase font-bold tracking-tighter">Requires immediate focus</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-2xl border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-200">Lead Acquisition Velocity</h4>
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#06D001]"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Weekly View</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadVelocityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff'}}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#greenGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06D001" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059212" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-white/5">
          <h4 className="font-bold text-slate-200 mb-6 text-center">Pipeline Distribution</h4>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-black text-white">{stats.total}</span>
               <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Leads</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {statusData.map((item, idx) => (
               <div key={idx} className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                 <span className="text-[10px] text-slate-400 font-medium">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

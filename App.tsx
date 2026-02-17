
import React, { useState } from 'react';
import { UserRole, Lead, LeadStatus, LeadPriority, Task, TaskStatus } from './types';
import { MOCK_LEADS, MOCK_TASKS } from './mockData';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import LeadDetailPanel from './components/LeadDetailPanel';
import AuthScreen from './components/AuthScreen';
import TaskList from './components/TaskList';
import CreateTaskModal from './components/CreateTaskModal';
import CreateLeadModal from './components/CreateLeadModal';
import { IconSparkles, IconAlert, IconUsers, IconTrendingUp, IconClipboardList } from './components/Icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setActiveTab('dashboard');
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      assignedTo: taskData.assignedTo || 'Unassigned',
      dueDate: taskData.dueDate || new Date().toISOString(),
      status: taskData.status || TaskStatus.PENDING,
      priority: taskData.priority || LeadPriority.MEDIUM,
      leadId: taskData.leadId,
      leadName: taskData.leadName
    };
    setTasks([newTask, ...tasks]);
    setIsCreateTaskModalOpen(false);
  };

  const handleSaveLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: leadData.name || 'Unknown',
      email: leadData.email || '',
      phone: leadData.phone || '',
      status: LeadStatus.NEW,
      priority: leadData.priority || LeadPriority.MEDIUM,
      owner: leadData.owner || 'Alex Rivera',
      source: 'Manual Entry',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      value: leadData.value || 0,
      activities: leadData.activities || []
    };
    setLeads([newLead, ...leads]);
    setIsCreateLeadModalOpen(false);
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: TaskStatus.COMPLETED } : t));
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const userRole = role as UserRole;
  const filteredLeads = userRole === UserRole.SALES ? leads.filter(l => l.owner === 'Alex Rivera') : leads;
  const filteredTasks = userRole === UserRole.SALES ? tasks.filter(t => t.assignedTo === 'Alex Rivera') : tasks;

  return (
    <Layout 
      role={userRole} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {activeTab === 'dashboard' ? 'Business Intelligence' : 
               activeTab === 'leads' ? 'Lead Pipeline' : 
               activeTab === 'tasks' ? 'Accountability Hub' : 'Market Analytics'}
            </h2>
            <p className="text-slate-400 mt-1">
              Welcome back, {userRole === UserRole.OWNER ? 'Director' : 'Alex'}.
            </p>
          </div>
          <div className="flex space-x-3">
             <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all text-slate-300">
               Export Data
             </button>
             <button 
                onClick={() => setIsCreateLeadModalOpen(true)}
                className="px-6 py-2 rounded-xl primary-gradient text-sm font-bold hover:shadow-[0_0_20px_rgba(6,208,1,0.3)] transition-all text-white"
              >
               + Create Lead
             </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <DashboardOverview leads={filteredLeads} role={userRole} />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center space-x-2 text-white">
                  <IconClipboardList className="w-5 h-5 text-[#9BEC00]" />
                  <span>Pending Accountability</span>
                </h3>
              </div>
              <TaskList 
                tasks={filteredTasks.filter(t => t.status !== TaskStatus.COMPLETED).slice(0, 3)} 
                role={userRole} 
                onCompleteTask={handleCompleteTask} 
              />
            </div>
          </>
        )}

        {activeTab === 'leads' && (
          <section className="glass rounded-2xl overflow-hidden border-white/10">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center space-x-2 text-white">
                <IconUsers className="w-5 h-5 text-slate-400" />
                <span>{userRole === UserRole.OWNER ? 'Global Pipeline' : 'My Portfolio'}</span>
              </h3>
              <div className="flex items-center space-x-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#06D001] animate-pulse"></span>
                <span>Live updates active</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Accountability</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Last Activity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map((lead) => {
                    const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date() && lead.status !== LeadStatus.CLOSED;
                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200">{lead.name}</span>
                            <span className="text-xs text-slate-500">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider ${
                            lead.status === LeadStatus.NEW ? 'bg-[#06D001]/10 text-[#06D001]' :
                            lead.status === LeadStatus.IN_PROGRESS ? 'bg-[#9BEC00]/10 text-[#9BEC00]' :
                            lead.status === LeadStatus.CLOSED ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-400">{lead.owner}</span>
                            {isOverdue && (
                              <span className="text-[10px] text-rose-400 flex items-center space-x-1 mt-0.5">
                                <IconAlert className="w-3 h-3" />
                                <span>OVERDUE</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(lead.lastActivity).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium ${
                            lead.priority === LeadPriority.URGENT ? 'text-red-400' :
                            lead.priority === LeadPriority.HIGH ? 'text-orange-400' :
                            'text-slate-400'
                          }`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="px-3 py-1.5 bg-[#06D001]/10 text-[#06D001] rounded-lg text-xs font-bold hover:bg-[#06D001] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Action Items</h3>
              {userRole === UserRole.OWNER && (
                <button 
                  onClick={() => setIsCreateTaskModalOpen(true)}
                  className="px-4 py-2 rounded-xl primary-gradient text-sm font-bold hover:shadow-[0_0_20px_rgba(6,208,1,0.3)] transition-all text-white"
                >
                  Assign New Task
                </button>
              )}
            </div>
            <TaskList 
              tasks={filteredTasks} 
              role={userRole} 
              onCompleteTask={handleCompleteTask} 
            />
          </div>
        )}

        {activeTab === 'analytics' && userRole === UserRole.OWNER && (
           <div className="glass p-12 rounded-3xl text-center border-white/10">
             <div className="w-20 h-20 bg-[#06D001]/10 text-[#06D001] rounded-full flex items-center justify-center mx-auto mb-6">
                <IconTrendingUp className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold mb-2 text-white">Deep Analytics Engine</h2>
             <p className="text-slate-500 max-w-md mx-auto">This module provides year-over-year cohort analysis and lead velocity tracking in the production version.</p>
           </div>
        )}
      </div>

      {/* Modals & Panels */}
      {selectedLead && (
        <LeadDetailPanel 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}

      {isCreateLeadModalOpen && (
        <CreateLeadModal 
          onClose={() => setIsCreateLeadModalOpen(false)}
          onSave={handleSaveLead}
        />
      )}

      {isCreateTaskModalOpen && (
        <CreateTaskModal 
          leads={leads}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </Layout>
  );
};

export default App;
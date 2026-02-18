
import React from 'react';
import { UserRole } from '../types';
import { IconDashboard, IconUsers, IconTrendingUp, IconArrowLeft, IconClipboardList } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, roles: [UserRole.OWNER, UserRole.SALES] },
    { id: 'leads', label: 'Leads', icon: <IconUsers />, roles: [UserRole.OWNER, UserRole.SALES] },
    { id: 'tasks', label: 'Tasks', icon: <IconClipboardList />, roles: [UserRole.OWNER, UserRole.SALES] },
    { id: 'analytics', label: 'Analytics', icon: <IconTrendingUp />, roles: [UserRole.OWNER] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-[#0a0c10] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#06D001] to-[#9BEC00] bg-clip-text text-transparent">
            NEXUS CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{role} MODE</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-gradient-to-r from-[#059212]/20 to-[#06D001]/20 text-[#06D001] border border-[#06D001]/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className={activeTab === item.id ? 'text-[#06D001]' : ''}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
          >
            <IconArrowLeft className="w-5 h-5" />
            <span className="font-medium">Switch Role</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0a0c10] via-[#0f1115] to-[#0a0c10]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
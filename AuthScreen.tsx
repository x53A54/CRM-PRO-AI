
import React, { useState } from 'react';
import { UserRole } from '../types';
import { IconSparkles, IconUsers } from './Icons';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role || UserRole.OWNER);
  };

  return (
    <div className="min-h-screen bg-[#12141a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Green Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#059212]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9BEC00]/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black mb-2 bg-gradient-to-r from-[#059212] via-[#06D001] to-[#9BEC00] bg-clip-text text-transparent italic tracking-tighter">
            NEXUS
          </h1>
          <p className="text-slate-500 tracking-[0.3em] uppercase text-[10px] font-bold">Accountability Protocol</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'primary-gradient text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Access
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'primary-gradient text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Enroll
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Identify</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Legal Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white placeholder-slate-600"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Encryption Key (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@nexus.io"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white placeholder-slate-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white placeholder-slate-600"
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Clearance Level</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.OWNER)}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col items-center justify-center space-y-2 ${role === UserRole.OWNER ? 'bg-[#06D001]/10 border-[#06D001] text-[#06D001]' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
                  >
                    <IconSparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Executive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.SALES)}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col items-center justify-center space-y-2 ${role === UserRole.SALES ? 'bg-[#06D001]/10 border-[#06D001] text-[#06D001]' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
                  >
                    <IconUsers className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Operator</span>
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 rounded-2xl primary-gradient text-sm font-bold mt-4 btn-hover-glow transition-all active:scale-[0.98] text-white uppercase tracking-widest"
            >
              {isLogin ? 'Establish Link' : 'Initialize Nexus'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#06D001] transition-colors"
            >
              {isLogin ? "Request Credentials" : "Existing Operator Access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

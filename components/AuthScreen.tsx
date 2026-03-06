import React, { useState } from "react";
import { UserRole } from "../types";
import { loginUser, registerUser } from "../intelligenceService";
import { IconSparkles, IconUsers } from "./Icons";

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("executive");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      if (isLogin) {

        const res = await loginUser(email, password);

        if (!res.token) {
          alert(res.message || "Login failed");
          return;
        }

        localStorage.setItem("token", res.token);
        localStorage.setItem("name", res.name);

        onLogin(res.role);

      } else {

        await registerUser(name, email, password, role);

        alert("Registration successful! You can now log in.");

        setIsLogin(true);

        setName("");
        setEmail("");
        setPassword("");
        setRole("executive");

      }

    } catch (err: any) {

      console.error("Auth Error:", err);

      alert(err.message || "Authentication failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="h-screen overflow-y-hidden bg-[#12141a] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#059212]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9BEC00]/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10">

        {/* logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#059212] via-[#06D001] to-[#9BEC00] bg-clip-text text-transparent italic tracking-tight">
            SMART CRM
          </h1>
          <p className="text-slate-500 uppercase text-xs tracking-widest font-bold">
            Assistant
          </p>
        </div>

        {/* card */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">

          {/* toggle */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isLogin
                  ? "primary-gradient text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isLogin
                  ? "primary-gradient text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Register
            </button>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
                  required
                />
              </div>
            )}

            {/* email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
                required
              />
            </div>

            {/* password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#06D001]/50 transition-all text-white"
                required
              />
            </div>

            {/* role selection */}
            {!isLogin && (
              <div className="space-y-3 pt-2">

                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">
                  Role
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 ${
                      role === "admin"
                        ? "bg-[#06D001]/10 border-[#06D001] text-[#06D001]"
                        : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                    }`}
                  >
                    <IconSparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("executive")}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 ${
                      role === "executive"
                        ? "bg-[#06D001]/10 border-[#06D001] text-[#06D001]"
                        : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                    }`}
                  >
                    <IconUsers className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Executive</span>
                  </button>

                </div>

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl primary-gradient text-sm font-bold mt-4 btn-hover-glow transition-all active:scale-[0.98] text-white uppercase tracking-widest ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>

          </form>

          {/* switch */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#06D001]"
            >
              {isLogin ? "Not registered? Register" : "Already registered? Login"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthScreen;
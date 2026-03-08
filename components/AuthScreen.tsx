import React, { useState } from "react";
import { UserRole } from "../types";
import { loginUser, registerUser } from "../intelligenceService";
import { IconSparkles, IconUsers } from "./Icons";

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

interface RegisterResponse {
  token: string;
  role: UserRole;
  name: string;
  companyCode?: string;
  message?: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("executive");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [adminRegistration, setAdminRegistration] = useState<RegisterResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const resetRegisterForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("executive");
    setCompanyName("");
    setCompanyCode("");
  };

  const persistSession = (response: RegisterResponse) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("role", response.role);

    if (typeof response.name === "string" && response.name.trim()) {
      localStorage.setItem("name", response.name);
    } else {
      localStorage.removeItem("name");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser(email, password);

        if (!res.token) {
          setErrorMessage(res.message || "Login failed");
          return;
        }

        localStorage.setItem("token", res.token);
        if (typeof res.name === "string" && res.name.trim()) {
          localStorage.setItem("name", res.name);
        } else {
          localStorage.removeItem("name");
        }

        onLogin(res.role);
      } else {
        const res = await registerUser(
          name,
          email,
          password,
          role,
          role === "admin" ? companyName : undefined,
          role === "executive" ? companyCode : undefined
        );

        persistSession(res);

        if (res.role === UserRole.ADMIN && res.companyCode) {
          setAdminRegistration(res);
          resetRegisterForm();
        } else {
          resetRegisterForm();
          onLogin(res.role);
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);

      if (err.message === "Invalid company code") {
        setErrorMessage("Invalid company code. Please check with your administrator.");
      } else {
        setErrorMessage(err.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!adminRegistration?.companyCode) return;

    try {
      await navigator.clipboard.writeText(adminRegistration.companyCode);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const handleAdminContinue = () => {
    if (!adminRegistration) return;

    const registeredRole = adminRegistration.role;
    setAdminRegistration(null);
    setIsLogin(true);
    onLogin(registeredRole);
  };

  return (
    <div className="min-h-screen bg-[#12141a] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#059212]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9BEC00]/5 rounded-full blur-[120px]"></div>

      <div className={`w-full z-10 ${isLogin ? "max-w-md" : "max-w-lg"}`}>
        {/* logo */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#059212] via-[#06D001] to-[#9BEC00] bg-clip-text text-transparent italic tracking-tight">
            SMART CRM
          </h1>
          <p className="text-slate-500 uppercase text-xs tracking-widest font-bold">Assistant</p>
        </div>

        {/* card */}
        <div className="glass rounded-[28px] border border-white/5 p-8 shadow-2xl backdrop-blur-xl shadow-[0_0_40px_rgba(6,208,1,0.08)] relative">
          {/* toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                isLogin
                  ? "bg-[#06D001] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-[#06D001] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {!isLogin && (
            <div className="mb-6 space-y-2">
              <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Role
              </label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setRole("admin");
                  }}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                    role === "admin"
                      ? "bg-[#06D001]/10 border-[#06D001] text-[#06D001]"
                      : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center justify-center gap-2 uppercase">
                    <IconSparkles className="w-4 h-4" />
                    Admin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setRole("executive");
                  }}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                    role === "executive"
                      ? "bg-[#06D001]/10 border-[#06D001] text-[#06D001]"
                      : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center justify-center gap-2 uppercase">
                    <IconUsers className="w-4 h-4" />
                    Executive
                  </span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={isLogin ? "space-y-4" : "flex flex-col gap-4"}>
            {isLogin ? (
              <>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                    required
                  />
                </div>

                {!isLogin && role === "admin" && (
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                      required
                    />
                  </div>
                )}

                {!isLogin && role === "executive" && (
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Company Code
                    </label>
                    <input
                      type="text"
                      value={companyCode}
                      onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                      placeholder="Company code"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 uppercase focus:border-[#06D001] focus:ring-1 focus:ring-[#06D001]/30 outline-none transition-all"
                      required
                    />
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 w-full py-3 rounded-xl font-semibold uppercase tracking-widest bg-[#06D001] text-black hover:brightness-110 transition active:scale-[0.98] ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : isLogin ? "Login" : "Register"}
                </button>
              </>
            )}

            {isLogin && errorMessage && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {errorMessage}
              </div>
            )}

            {isLogin && (
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full py-3 rounded-xl font-semibold uppercase tracking-widest bg-[#06D001] text-black hover:brightness-110 transition active:scale-[0.98] ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Register"}
              </button>
            )}
          </form>

          {/* switch */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setErrorMessage("");
                setIsLogin(!isLogin);
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#06D001]"
            >
              {isLogin ? "Not registered? Register" : "Already registered? Login"}
            </button>
          </div>
        </div>
      </div>

      {adminRegistration?.companyCode && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#11141b] p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-3">Company Created Successfully</h2>
            <p className="text-sm text-slate-400 mb-6">Your company code is:</p>
            <div className="mb-6 rounded-2xl border border-[#06D001]/20 bg-[#06D001]/10 px-5 py-4 text-center">
              <span className="text-2xl font-black tracking-[0.25em] text-[#b8f58b]">
                {adminRegistration.companyCode}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Share this code with your executives so they can join your company.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-widest text-slate-200 hover:border-[#06D001]/40 hover:text-white"
              >
                Copy Code
              </button>
              <button
                type="button"
                onClick={handleAdminContinue}
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-widest text-white primary-gradient"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;

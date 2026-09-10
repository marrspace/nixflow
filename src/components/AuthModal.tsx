import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Key, UserPlus, Lock, Mail, Smartphone, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { registerUser } = useApp();
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretResult, setSecretResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi password tidak cocok!');
        return;
      }
      const res = registerUser(username, email, whatsapp);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSecretResult(res.secretKey);
      }
    } else {
      // Login dummy check
      setErrorMsg('Gunakan role switcher di navbar untuk simulasi cepat semua role (User/Admin/Owner)!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#0c1220] border border-white/[0.12] shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-white">
              {secretResult ? 'Secret Key Registrasi Anda' : isRegister ? 'Daftar Akun Nixflow' : 'Login Akun Nixflow'}
            </h3>
            <p className="text-xs text-slate-400">
              {secretResult ? 'Simpan kode 4-digit ini dengan aman' : 'Sistem otentikasi aman terintegrasi'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {secretResult ? (
          <div className="space-y-4 text-center py-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Akun Berhasil Dibuat!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Sesuai spesifikasi PRD, ini adalah <strong>Secret Key 4-digit</strong> Anda untuk login dan reset password:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 font-mono text-3xl font-black text-emerald-300 tracking-widest">
              {secretResult}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              Saya Sudah Simpan • Masuk Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Username Unik:</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="username_kamu"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#141b2c] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Gmail (@gmail.com):</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#141b2c] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nomor WhatsApp Unik:</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="+6281234567890"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full bg-[#141b2c] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#141b2c] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Konfirmasi Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#141b2c] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              {isRegister ? 'Daftar Sekarang & Buat Secret Key' : 'Login ke Akun'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
                className="text-xs text-emerald-400 hover:underline"
              >
                {isRegister ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Daftar gratis'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

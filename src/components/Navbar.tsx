import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  ShieldCheck, 
  Bell, 
  Wallet, 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Crown,
  Key,
  Smartphone
} from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { currentUser, switchRole, notifications, markNotifRead } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read && n.userId === currentUser.id);

  const levelBadgeColors: Record<string, string> = {
    VIP: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30',
    Gold: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
    Silver: 'bg-slate-400/15 text-slate-200 border-slate-400/25',
    Bronze: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
    Member: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#06080e]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <span className="font-black text-slate-950 text-lg tracking-tighter">Nx</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">NIXFLOW</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  Cloud Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Automated Pterodactyl Engine</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'shop'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Katalog Server
            </button>
            <button
              onClick={() => setActiveTab('topup')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'topup'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Isi Saldo NX
            </button>

            {(currentUser.role === 'admin' || currentUser.role === 'owner') && (
              <button
                onClick={() => setActiveTab('admin_panel')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'admin_panel'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Admin Panel (500 NX)
              </button>
            )}

            {currentUser.role === 'owner' && (
              <button
                onClick={() => setActiveTab('owner')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'owner'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Owner Master Control
              </button>
            )}
          </nav>

          {/* User Info & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Balance Pill */}
            <div 
              onClick={() => setActiveTab('topup')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full cursor-pointer hover:border-emerald-400/40 transition active:scale-95"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-emerald-300 tracking-wide">
                {currentUser.balanceNX.toLocaleString()} <span className="text-[10px] text-emerald-400/70 font-sans">NX</span>
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition relative"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0d121d] border border-white/[0.1] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] px-1">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifikasi Akun</span>
                    <span className="text-[10px] text-slate-400">{unreadNotifs.length} pesan baru</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">Tidak ada notifikasi baru</p>
                    ) : (
                      notifications.filter(n => n.userId === currentUser.id).map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => markNotifRead(notif.id)}
                          className={`p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                            notif.read ? 'bg-white/[0.02] border-white/[0.04] text-slate-400' : 'bg-emerald-500/[0.08] border-emerald-500/20 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold text-white mb-1">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{notif.createdAt.slice(11, 16)}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-300">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">{currentUser.username}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold border ${levelBadgeColors[currentUser.level] || 'bg-slate-700 text-slate-300'}`}>
                      {currentUser.level}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize">{currentUser.role} Role</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0d121d] border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="p-2 border-b border-white/[0.06] mb-1">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Ganti Simulasi Role</p>
                    <p className="text-xs text-slate-200 mt-0.5">Uji coba flow tiap role PRD</p>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => { switchRole('user'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition ${
                        currentUser.role === 'user' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>User Biasa (mariodev)</span>
                      </div>
                      {currentUser.role === 'user' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => { switchRole('admin'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition ${
                        currentUser.role === 'admin' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Admin (ren_admin)</span>
                      </div>
                      {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                    <button
                      onClick={() => { switchRole('owner'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition ${
                        currentUser.role === 'owner' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Owner Master (marrspace)</span>
                      </div>
                      {currentUser.role === 'owner' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => { onOpenAuth(); setShowRoleMenu(false); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-cyan-300 hover:bg-cyan-500/10 transition"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Daftar / Login Akun Baru</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

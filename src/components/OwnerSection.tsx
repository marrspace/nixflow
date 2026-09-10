import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Crown, 
  Settings, 
  Layers, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Server, 
  ShieldAlert, 
  Activity,
  Sliders,
  DollarSign
} from 'lucide-react';

export const OwnerSection: React.FC = () => {
  const { 
    currentUser, 
    topups, 
    reviewTopup, 
    packages, 
    togglePackage, 
    users, 
    updateUserStatus, 
    pteroConfig, 
    updatePteroConfig,
    servers,
    ledgers 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'topups' | 'packages' | 'users' | 'ptero' | 'ledgers'>('topups');

  // Ptero Form
  const [panelUrl, setPanelUrl] = useState(pteroConfig.panelUrl);
  const [apiKey, setApiKey] = useState('ptlc_99281a8bc8199201928374910293847291');
  const [pteroResult, setPteroResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Topup Review Modal
  const [selectedTopupId, setSelectedTopupId] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState('Transfer valid dan terverifikasi');

  const pendingTopups = topups.filter(t => t.status === 'pending_review');

  const handlePteroSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updatePteroConfig(panelUrl, apiKey);
    setPteroResult({ success: res.success, msg: res.message });
  };

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!selectedTopupId) return;
    reviewTopup(selectedTopupId, status, decisionNote);
    setSelectedTopupId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-[#15120c] to-[#0d101a] border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Master Owner Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Nixflow Management Core
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Kontrol penuh atas seluruh parameter Pterodactyl, persetujuan top-up finansial, paket harga, dan akun pengguna.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-2xl">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300">Owner: {currentUser.username}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveSubTab('topups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'topups'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Approval Top-up</span>
          {pendingTopups.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
              {pendingTopups.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('ptero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'ptero'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Konfigurasi Pterodactyl</span>
        </button>

        <button
          onClick={() => setActiveSubTab('packages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'packages'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Paket & Pricing</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'users'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Manajemen Pengguna</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledgers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'ledgers'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Log Global</span>
        </button>
      </div>

      {/* TOPUPS SUBTAB */}
      {activeSubTab === 'topups' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Daftar Antrean Top-up Masuk</h3>
          {topups.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-white/[0.08] rounded-2xl">Tidak ada riwayat pengajuan top-up.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topups.map(top => (
                <div key={top.id} className="p-4 sm:p-5 rounded-3xl bg-[#0e1322] border border-white/[0.08] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{top.username}</span>
                      <p className="text-[10px] text-slate-400 font-mono">Ref: {top.referenceCode}</p>
                    </div>
                    <span className="font-mono text-base font-extrabold text-emerald-400">{top.amountNX.toLocaleString()} NX</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl space-y-1 text-[11px] text-slate-300">
                    <p>Metode: <strong className="text-white">{top.paymentMethod}</strong></p>
                    <p>Waktu Pengajuan: <span className="font-mono text-slate-400">{top.createdAt}</span></p>
                    {top.decisionNote && <p className="text-amber-400 italic">Catatan: {top.decisionNote}</p>}
                  </div>

                  {top.status === 'pending_review' ? (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => { setSelectedTopupId(top.id); setDecisionNote('Valid & saldo ditambahkan'); }}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => { setSelectedTopupId(top.id); setDecisionNote('Bukti transfer tidak valid'); }}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${top.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {top.status} by {top.reviewedBy || 'Owner'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PTERO CONFIG SUBTAB */}
      {activeSubTab === 'ptero' && (
        <div className="max-w-2xl rounded-3xl p-5 sm:p-6 bg-[#0e1322] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Konfigurasi API Pterodactyl (Single Panel)</span>
          </h3>

          <form onSubmit={handlePteroSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Panel Application API URL:</label>
              <input
                type="url"
                required
                value={panelUrl}
                onChange={e => setPanelUrl(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Application API Key (Secret):</label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status Node & Egg Checking:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {pteroConfig.isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
                <div className="p-2 rounded-xl bg-white/[0.02]">Nodes: <strong className="text-white">{pteroConfig.nodeCount}</strong></div>
                <div className="p-2 rounded-xl bg-white/[0.02]">Nests: <strong className="text-white">{pteroConfig.nestCount}</strong></div>
                <div className="p-2 rounded-xl bg-white/[0.02]">Active Eggs: <strong className="text-white">{pteroConfig.eggCount}</strong></div>
              </div>
            </div>

            {pteroResult && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                {pteroResult.msg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
            >
              Simpan & Uji Koneksi Pterodactyl
            </button>
          </form>
        </div>
      )}

      {/* PACKAGES SUBTAB */}
      {activeSubTab === 'packages' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Manajemen Paket & Harga Platform</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <div key={pkg.id} className="p-4 rounded-3xl bg-[#0e1322] border border-white/[0.08] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{pkg.name}</span>
                  <button
                    onClick={() => togglePackage(pkg.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pkg.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {pkg.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">{pkg.description}</p>
                <div className="font-mono text-emerald-400 font-bold text-sm">
                  {pkg.price30DaysNX.toLocaleString()} NX / 30 Hari
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS SUBTAB */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Manajemen Semua Akun Pengguna</h3>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="p-3.5 rounded-2xl bg-[#0e1322] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{u.username}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded uppercase font-bold bg-slate-800 text-slate-300 border border-white/10">{u.role}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">Tier {u.level}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email} • WA: {u.whatsapp} • Secret: <strong className="text-cyan-300">{u.secretKey}</strong></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white">{u.balanceNX.toLocaleString()} NX</span>
                  </div>
                  {u.role !== 'owner' && (
                    <div className="flex gap-1">
                      {u.status === 'active' ? (
                        <button
                          onClick={() => updateUserStatus(u.id, 'blocked')}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[10px] hover:bg-red-500/30 transition"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(u.id, 'active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] hover:bg-emerald-500/30 transition"
                        >
                          Unblock
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEDGERS SUBTAB */}
      {activeSubTab === 'ledgers' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Audit Log & Ledger Keuangan Global</h3>
          <div className="space-y-2">
            {ledgers.map(l => (
              <div key={l.id} className="p-3 rounded-2xl bg-[#0e1322] border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{l.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Aktor: {l.actor} • Ref: {l.referenceId} • {l.createdAt}</p>
                </div>
                <div className="text-right font-mono">
                  <span className={`font-bold ${l.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {l.type === 'credit' ? '+' : '-'}{l.amountNX.toLocaleString()} NX
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">{l.balanceBefore} → {l.balanceAfter} NX</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Review Confirmation Modal */}
      {selectedTopupId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#101626] border border-white/[0.1] shadow-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white">Konfirmasi Keputusan Owner</h4>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Catatan Keputusan:</label>
              <input
                type="text"
                value={decisionNote}
                onChange={e => setDecisionNote(e.target.value)}
                className="w-full bg-[#161d31] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleReview('approved')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Setujui (Approve)
              </button>
              <button
                onClick={() => handleReview('rejected')}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs shadow-md"
              >
                Tolak (Reject)
              </button>
            </div>
            <button
              onClick={() => setSelectedTopupId(null)}
              className="w-full py-1 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Batal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

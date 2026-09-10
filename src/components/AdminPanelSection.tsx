import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, UserPlus, Key, Server, CheckCircle2, AlertTriangle, Copy, Check } from 'lucide-react';

export const AdminPanelSection: React.FC = () => {
  const { currentUser, packages, panelAccounts, createAdminPanelUser } = useApp();
  
  const [shopUsername, setShopUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pteroUsername, setPteroUsername] = useState('');
  const [selectedPkgId, setSelectedPkgId] = useState('');
  const [result, setResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter accounts created by this admin
  const myCreatedAccounts = panelAccounts.filter(a => a.adminId === currentUser.id || currentUser.role === 'owner');

  const selectedPkg = packages.find(p => p.id === selectedPkgId);
  const totalCost = 500 + (selectedPkg ? selectedPkg.price30DaysNX : 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createAdminPanelUser(shopUsername, email, whatsapp, pteroUsername, selectedPkgId || undefined);
    setResult({ success: res.success, msg: res.message });
    if (res.success) {
      setShopUsername('');
      setEmail('');
      setWhatsapp('');
      setPteroUsername('');
      setSelectedPkgId('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-cyan-950/50 via-[#0c1424] to-[#070d18] border border-cyan-500/25 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Admin Reseller Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Pembuatan Akun User & Panel Pterodactyl
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Sesuai PRD: Biaya fee pembuatan akun panel dipotong <strong>500 NX / user</strong> dari saldo balance Admin Anda.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-right flex-shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Saldo Admin Anda</span>
          <span className="font-mono text-xl font-extrabold text-cyan-300">{currentUser.balanceNX.toLocaleString()} NX</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Creation Form */}
        <div className="rounded-3xl p-5 sm:p-6 bg-[#0d1322]/90 border border-white/[0.08] shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>Form Buat Akun Klien Baru</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Username Shop Panel Klien:</label>
              <input
                type="text"
                required
                placeholder="Contoh: kien_sawako"
                value={shopUsername}
                onChange={e => setShopUsername(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Gmail Klien (@gmail.com):</label>
              <input
                type="email"
                required
                placeholder="client.pterodactyl@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nomor WhatsApp Klien:</label>
              <input
                type="text"
                required
                placeholder="+628123456789"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Username Pterodactyl Panel:</label>
              <input
                type="text"
                required
                placeholder="sawako_node_user"
                value={pteroUsername}
                onChange={e => setPteroUsername(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sertakan Paket Server Awal (Opsional):</label>
              <select
                value={selectedPkgId}
                onChange={e => setSelectedPkgId(e.target.value)}
                className="w-full bg-[#141b2e] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">Hanya Buat Akun Panel (500 NX)</option>
                {packages.filter(p => p.isActive && !p.isFreeTrial).map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    + Paket {pkg.name} ({pkg.price30DaysNX.toLocaleString()} NX / 30 Hari)
                  </option>
                ))}
              </select>
            </div>

            {/* Price Preview */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Fee Pembuatan Akun Pterodactyl:</span>
                <span className="font-mono text-cyan-300 font-bold">500 NX</span>
              </div>
              {selectedPkg && (
                <div className="flex justify-between text-slate-400">
                  <span>Harga Paket Server ({selectedPkg.name}):</span>
                  <span className="font-mono text-white font-bold">{selectedPkg.price30DaysNX.toLocaleString()} NX</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-white/[0.06] flex justify-between text-slate-300 font-bold">
                <span>Total Pemotongan Saldo:</span>
                <span className="font-mono text-white">{totalCost.toLocaleString()} NX</span>
              </div>
            </div>

            {result && (
              <div
                className={`p-3 rounded-xl text-xs space-y-1 ${
                  result.success
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'bg-red-500/10 text-red-300 border border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{result.success ? 'Berhasil Dibuat!' : 'Gagal'}</span>
                </div>
                <p className="text-[11px] leading-relaxed break-words font-mono">{result.msg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={currentUser.balanceNX < totalCost}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition active:scale-95 ${
                currentUser.balanceNX < totalCost
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {currentUser.balanceNX < totalCost ? 'Saldo Admin Kurang' : `Buat Akun Sekarang (${totalCost.toLocaleString()} NX)`}
            </button>
          </form>
        </div>

        {/* History / Created Panel Accounts by Admin */}
        <div className="rounded-3xl p-5 sm:p-6 bg-[#0d1322]/90 border border-white/[0.08] shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Akun Panel Kelolaan Anda ({myCreatedAccounts.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Admin hanya dapat melihat akun yang dibuat di bawah manajemennya sendiri.
            </p>

            <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {myCreatedAccounts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/[0.08] rounded-2xl text-xs text-slate-400">
                  Belum ada akun panel yang Anda buat.
                </div>
              ) : (
                myCreatedAccounts.map(acc => (
                  <div key={acc.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono">{acc.panelUsername}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                        {acc.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p>Email: <span className="text-slate-200 font-mono">{acc.panelEmail}</span></p>
                      <p>Paket Terpasang: <span className="text-emerald-400 font-medium">{acc.assignedPackage}</span></p>
                      <p className="text-[10px] text-slate-400 font-mono">Dibuat: {acc.createdAt}</p>
                    </div>

                    {acc.generatedPassword && (
                      <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between font-mono text-[11px] text-cyan-200">
                        <span>Pass: {acc.generatedPassword}</span>
                        <button
                          onClick={() => copyToClipboard(`Username: ${acc.panelUsername}\nPassword: ${acc.generatedPassword}\nPanel: https://panel.marrlabs.my.id`)}
                          className="p-1 hover:text-white"
                          title="Salin Kredensial"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400">
            💡 URL API & API Key Pterodactyl disembunyikan sepenuhnya dari Admin sesuai standar keamanan PRD.
          </div>
        </div>

      </div>

    </div>
  );
};

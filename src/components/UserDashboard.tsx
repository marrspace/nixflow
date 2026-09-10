import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Server, 
  ExternalLink, 
  RefreshCw, 
  ArrowUpRight, 
  Terminal, 
  Clock, 
  Cpu, 
  HardDrive, 
  Layers, 
  AlertCircle, 
  CheckCircle,
  ShoppingBag,
  Zap,
  Sliders,
  X
} from 'lucide-react';
import { ServerInstance } from '../types';

interface UserDashboardProps {
  onNavigateShop: () => void;
  onNavigateTopup: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateShop, onNavigateTopup }) => {
  const { currentUser, servers, renewServer, upgradeServer, ledgers } = useApp();
  
  // Modals state
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [renewDays, setRenewDays] = useState(30);

  // Upgrade form state
  const [extraRam, setExtraRam] = useState(2);
  const [extraCpu, setExtraCpu] = useState(40);
  const [extraDisk, setExtraDisk] = useState(5);
  const [modalFeedback, setModalFeedback] = useState<{ msg: string; success: boolean } | null>(null);

  const myServers = servers.filter(s => s.userId === currentUser.id && s.status !== 'deleted');
  const myLedgers = ledgers.filter(l => l.userId === currentUser.id).slice(0, 5);

  const handleOpenRenew = (srv: ServerInstance) => {
    setSelectedServer(srv);
    setModalFeedback(null);
    setShowRenewModal(true);
  };

  const handleOpenUpgrade = (srv: ServerInstance) => {
    setSelectedServer(srv);
    setModalFeedback(null);
    setShowUpgradeModal(true);
  };

  const executeRenew = () => {
    if (!selectedServer) return;
    const res = renewServer(selectedServer.id, renewDays);
    setModalFeedback({ msg: res.message, success: res.success });
    if (res.success) {
      setTimeout(() => setShowRenewModal(false), 1500);
    }
  };

  const executeUpgrade = () => {
    if (!selectedServer) return;
    const res = upgradeServer(selectedServer.id, extraRam, extraCpu, extraDisk);
    setModalFeedback({ msg: res.message, success: res.success });
    if (res.success) {
      setTimeout(() => setShowUpgradeModal(false), 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Banner & Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="md:col-span-2 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900/90 via-[#0b101d]/90 to-[#070b14]/90 border border-white/[0.08] relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Cluster Online</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Halo, {currentUser.username} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
              Kelola server bot WhatsApp, Node.js, atau game server Anda dengan otomasi provisioning instan.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateShop}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Beli Server Baru</span>
            </button>
            <a
              href="https://panel.marrlabs.my.id"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-semibold text-xs flex items-center gap-2 transition active:scale-95"
            >
              <span>Akses Panel Pterodactyl</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#10192a]/80 to-[#0c121e]/80 border border-emerald-500/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Nixflow</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Tier {currentUser.level}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                {currentUser.balanceNX.toLocaleString()} <span className="text-emerald-400 text-sm font-sans font-bold">NX</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Estimasi setara Rp {currentUser.balanceNX.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-slate-400">Total belanja: <span className="font-mono text-slate-200">{currentUser.totalSpentNX.toLocaleString()} NX</span></span>
            <button
              onClick={onNavigateTopup}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition active:scale-95"
            >
              + Isi Saldo
            </button>
          </div>
        </div>

      </div>

      {/* Active Servers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Daftar Server Anda ({myServers.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Server aktif yang terhubung langsung ke Pterodactyl node</p>
          </div>
        </div>

        {myServers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/[0.12] p-8 text-center bg-white/[0.01]">
            <Server className="w-10 h-10 text-slate-500 mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-white">Belum Ada Server Aktif</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Anda belum memiliki server aktif. Pilih paket starter atau coba trial gratis sekarang.
            </p>
            <button
              onClick={onNavigateShop}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              Buka Katalog Paket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myServers.map(srv => {
              const isRenewWindow = srv.status === 'renew_window';
              const daysLeft = Math.max(0, Math.ceil((new Date(srv.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

              return (
                <div
                  key={srv.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                    isRenewWindow
                      ? 'bg-amber-500/[0.04] border-amber-500/30 shadow-lg shadow-amber-500/5'
                      : 'bg-[#0d121f]/70 hover:bg-[#0d121f] border-white/[0.07] hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-white">{srv.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isRenewWindow
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isRenewWindow ? 'Grace Period (2 Hari)' : 'Running'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{srv.eggName} • {srv.nodeName}</p>
                    </div>

                    <a
                      href={srv.panelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition"
                      title="Buka di Panel"
                    >
                      <Terminal className="w-4 h-4 text-cyan-400" />
                    </a>
                  </div>

                  {/* Resource Specs Chips */}
                  <div className="grid grid-cols-3 gap-2 my-4">
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
                        <Layers className="w-3 h-3 text-cyan-400" /> RAM
                      </div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">{srv.ramGB} GB</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
                        <Cpu className="w-3 h-3 text-emerald-400" /> CPU
                      </div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">{srv.cpuPercent}%</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
                        <HardDrive className="w-3 h-3 text-amber-400" /> Disk
                      </div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">{srv.diskGB} GB</div>
                    </div>
                  </div>

                  {/* Expiry Bar & Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {isRenewWindow ? (
                        <span className="text-amber-400 font-semibold text-[11px]">Batas Hapus: {srv.renewDeadline.slice(0, 10)}</span>
                      ) : (
                        <span className="text-slate-300 text-[11px]">Sisa: <strong className="text-emerald-400">{daysLeft} hari</strong> ({srv.expiresAt.slice(0, 10)})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenUpgrade(srv)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold flex items-center gap-1 transition active:scale-95"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Upgrade</span>
                      </button>
                      <button
                        onClick={() => handleOpenRenew(srv)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
                          isRenewWindow
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Renew</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction & Audit Ledger Preview */}
      <div className="rounded-3xl p-5 sm:p-6 bg-[#0c101b]/80 border border-white/[0.07] space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight uppercase">Riwayat Mutasi Saldo NX</h3>
        {myLedgers.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">Belum ada transaksi.</p>
        ) : (
          <div className="space-y-2">
            {myLedgers.map(ledg => (
              <div key={ledg.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                <div>
                  <p className="font-semibold text-white">{ledg.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{ledg.createdAt} • Ref: {ledg.referenceId}</p>
                </div>
                <div className={`font-mono font-bold ${ledg.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {ledg.type === 'credit' ? '+' : '-'}{ledg.amountNX.toLocaleString()} NX
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RENEW MODAL */}
      {showRenewModal && selectedServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1422] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" /> Perpanjang Server (Renew)
              </h3>
              <button onClick={() => setShowRenewModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-400">Server:</p>
              <p className="text-sm font-bold text-white font-mono">{selectedServer.name}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Pilih Durasi Perpanjangan:</label>
              <div className="grid grid-cols-3 gap-2">
                {[7, 14, 30].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setRenewDays(d)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      renewDays === d ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/[0.03] text-slate-300 border-white/[0.06]'
                    }`}
                  >
                    {d} Hari
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Tarif Perpanjangan:</span>
                <span className="font-mono text-white font-bold">{Math.round((10000 / 30) * renewDays).toLocaleString()} NX</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Saldo Anda Sekarang:</span>
                <span className="font-mono text-emerald-400">{currentUser.balanceNX.toLocaleString()} NX</span>
              </div>
            </div>

            {modalFeedback && (
              <div className={`p-3 rounded-xl text-xs ${modalFeedback.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                {modalFeedback.msg}
              </div>
            )}

            <button
              onClick={executeRenew}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              Konfirmasi Perpanjang ({Math.round((10000 / 30) * renewDays).toLocaleString()} NX)
            </button>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgradeModal && selectedServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1422] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Upgrade Resource Server
              </h3>
              <button onClick={() => setShowUpgradeModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tambah RAM (GB): [Max total 12GB]</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 4].map(g => (
                    <button
                      key={g}
                      onClick={() => setExtraRam(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${extraRam === g ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/[0.03] text-slate-300 border-white/[0.06]'}`}
                    >
                      +{g} GB
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tambah CPU (%): [Max total 240%]</label>
                <div className="flex items-center gap-2">
                  {[20, 40, 80].map(c => (
                    <button
                      key={c}
                      onClick={() => setExtraCpu(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${extraCpu === c ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/[0.03] text-slate-300 border-white/[0.06]'}`}
                    >
                      +{c}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tambah NVMe Disk (GB): [Max total 50GB]</label>
                <div className="flex items-center gap-2">
                  {[5, 10, 20].map(d => (
                    <button
                      key={d}
                      onClick={() => setExtraDisk(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${extraDisk === d ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/[0.03] text-slate-300 border-white/[0.06]'}`}
                    >
                      +{d} GB
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Biaya Penyesuaian Upgrade:</span>
                <span className="font-mono text-white font-bold">{Math.round((extraRam * 1500) + (extraCpu * 30) + (extraDisk * 300)).toLocaleString()} NX</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">*Server akan di-restart otomatis oleh daemon Pterodactyl.</p>
            </div>

            {modalFeedback && (
              <div className={`p-3 rounded-xl text-xs ${modalFeedback.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                {modalFeedback.msg}
              </div>
            )}

            <button
              onClick={executeUpgrade}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              Bayar & Terapkan Upgrade
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

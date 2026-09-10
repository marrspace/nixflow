import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShoppingCart, Check, Zap, Tag, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Package } from '../types';

interface ShopCatalogProps {
  onSuccessBuy: () => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({ onSuccessBuy }) => {
  const { packages, currentUser, buyServer, vouchers } = useApp();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [durationDays, setDurationDays] = useState(30);
  const [selectedEgg, setSelectedEgg] = useState('NodeJS 20 (Baileys / WhatsApp Bot)');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [orderResult, setOrderResult] = useState<{ success: boolean; msg: string } | null>(null);

  const eggOptions = [
    'NodeJS 20 (Baileys / WhatsApp Bot)',
    'NodeJS 22 LTS (High Performance)',
    'Python 3.12 (Discord Bot / FastApi)',
    'Java 21 OpenJDK (Minecraft / Nexara Core)',
    'Generic Linux Alpine Custom'
  ];

  const handleOpenCheckout = (pkg: Package) => {
    setSelectedPkg(pkg);
    setDurationDays(pkg.isFreeTrial ? (pkg.freeTrialDays || 3) : 30);
    setOrderResult(null);
    setAppliedVoucher(null);
    setVoucherInput('');
  };

  const handleApplyVoucher = () => {
    const v = vouchers.find(vc => vc.code.toUpperCase() === voucherInput.trim().toUpperCase() && vc.active);
    if (v) {
      setAppliedVoucher({ code: v.code, discount: v.discountPercent });
    } else {
      alert('Voucher tidak valid atau sudah kedaluwarsa!');
    }
  };

  // Compute live price
  const calculatePrice = () => {
    if (!selectedPkg) return 0;
    if (selectedPkg.isFreeTrial) return 0;
    let base = Math.round((selectedPkg.price30DaysNX / 30) * durationDays);
    if (appliedVoucher) {
      base = Math.round(base * (1 - appliedVoucher.discount / 100));
    }
    return base;
  };

  const handleConfirmOrder = () => {
    if (!selectedPkg) return;
    const res = buyServer(selectedPkg.id, durationDays, selectedEgg, appliedVoucher?.code);
    setOrderResult({ success: res.success, msg: res.message });
    if (res.success) {
      setTimeout(() => {
        onSuccessBuy();
      }, 1800);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Katalog Server Nixflow • Cloud Automation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pilih Spek Resource Server Anda
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Provisioning instan dalam hitungan detik. Tanpa setup manual, langsung aktif di panel Pterodactyl.
        </p>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.filter(p => p.isActive).map(pkg => (
          <div
            key={pkg.id}
            className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative border ${
              pkg.popular
                ? 'bg-gradient-to-b from-[#111827] to-[#0a0f1d] border-emerald-500/40 shadow-xl shadow-emerald-500/10'
                : 'bg-[#0d121f]/80 hover:bg-[#0d121f] border-white/[0.08] hover:border-white/[0.2]'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                Paling Diminati
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white">{pkg.name}</h3>
                {pkg.isFreeTrial && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Gratis 3 Hari
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{pkg.description}</p>

              {/* Price Tag */}
              <div className="my-4 pb-4 border-b border-white/[0.06]">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                    {pkg.price30DaysNX === 0 ? '0' : pkg.price30DaysNX.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">NX</span>
                  <span className="text-xs text-slate-400">/ 30 hari</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {pkg.isFreeTrial ? 'Khusus 1x aktivasi akun baru' : `Custom durasi mulai dari ${Math.round(pkg.price30DaysNX / 30).toLocaleString()} NX/hari`}
                </p>
              </div>

              {/* Specs List */}
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>{pkg.ramGB} GB</strong> High-speed RAM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>{pkg.cpuPercent}%</strong> CPU Dedicated Core</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>{pkg.diskGB} GB</strong> Fast NVMe Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Auto-restart & File Manager</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenCheckout(pkg)}
              className={`mt-6 w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                pkg.popular
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{pkg.isFreeTrial ? 'Klaim Free Trial' : 'Order Sekarang'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* CHECKOUT MODAL */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0d1322] border border-white/[0.12] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">Checkout Server Nixflow</h3>
                <p className="text-xs text-slate-400">Konfigurasi runtime dan masa sewa</p>
              </div>
              <button
                onClick={() => setSelectedPkg(null)}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Selected Package Details */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Paket Pilihan:</span>
                <span className="text-sm font-bold text-white">{selectedPkg.name}</span>
                <span className="text-xs text-slate-400 block font-mono">
                  {selectedPkg.ramGB}GB RAM • {selectedPkg.cpuPercent}% CPU • {selectedPkg.diskGB}GB NVMe
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-bold text-emerald-400">{selectedPkg.price30DaysNX.toLocaleString()} NX</span>
                <span className="text-[10px] text-slate-400 block">/ 30 hari</span>
              </div>
            </div>

            {/* Select Egg / Environment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Pilih Environment / Egg Pterodactyl:</label>
              <select
                value={selectedEgg}
                onChange={e => setSelectedEgg(e.target.value)}
                className="w-full bg-[#141b2d] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {eggOptions.map(opt => (
                  <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                ))}
              </select>
            </div>

            {/* Custom Duration Selector */}
            {!selectedPkg.isFreeTrial && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Durasi Sewa (Hari):</label>
                  <span className="text-xs font-mono font-bold text-emerald-400">{durationDays} Hari</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 30, 60].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        durationDays === d
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/[0.02] text-slate-300 border-white/[0.06]'
                      }`}
                    >
                      {d} Hari
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Voucher Code Form */}
            {!selectedPkg.isFreeTrial && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Kode Voucher / Diskon Event:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={e => setVoucherInput(e.target.value)}
                    placeholder="Contoh: NIXFLOWFIRST"
                    className="flex-1 bg-[#141b2d] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white transition active:scale-95"
                  >
                    Gunakan
                  </button>
                </div>
                {appliedVoucher && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Voucher aktif! Diskon hemat {appliedVoucher.discount}%.</span>
                  </p>
                )}
              </div>
            )}

            {/* Total Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-[#090d17] border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Biaya Order:</span>
                <span className="font-mono text-white font-bold text-sm">{calculatePrice().toLocaleString()} NX</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Saldo Akun Anda:</span>
                <span className="font-mono text-emerald-400 font-bold">{currentUser.balanceNX.toLocaleString()} NX</span>
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex justify-between text-slate-400">
                <span>Sisa Saldo Setelah Order:</span>
                <span className="font-mono text-slate-200">
                  {Math.max(0, currentUser.balanceNX - calculatePrice()).toLocaleString()} NX
                </span>
              </div>
            </div>

            {orderResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  orderResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-300 border border-red-500/20'
                }`}
              >
                {orderResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />}
                <span>{orderResult.msg}</span>
              </div>
            )}

            <button
              onClick={handleConfirmOrder}
              disabled={currentUser.balanceNX < calculatePrice()}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-xl transition active:scale-95 flex items-center justify-center gap-2 ${
                currentUser.balanceNX < calculatePrice()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/[0.05]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <span>{currentUser.balanceNX < calculatePrice() ? 'Saldo NX Tidak Cukup' : `Konfirmasi Bayar (${calculatePrice().toLocaleString()} NX)`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

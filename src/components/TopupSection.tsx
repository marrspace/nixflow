import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Wallet, QrCode, UploadCloud, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const TopupSection: React.FC = () => {
  const { currentUser, submitTopup, topups } = useApp();
  const [amount, setAmount] = useState(25000);
  const [paymentMethod, setPaymentMethod] = useState('QRIS Realtime (BCA / Dana / Gopay)');
  const [refCode, setRefCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const myTopups = topups.filter(t => t.userId === currentUser.id);

  const presetAmounts = [10000, 25000, 50000, 100000, 250000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTopup(amount, paymentMethod, refCode, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRefCode('');
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      <div className="text-center space-y-1 py-2">
        <h1 className="text-2xl font-black text-white tracking-tight">Pengisian Saldo Nixflow (NX)</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Denominasi: 1 NX = Rp 1. Top-up diproses & diverifikasi langsung oleh Owner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form Isi Saldo */}
        <div className="rounded-3xl p-5 sm:p-6 bg-[#0c111e]/90 border border-white/[0.08] shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Formulir Pengajuan Top-up</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Quick Presets */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Pilih Nominal Cepat:</label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl font-mono font-bold border transition ${
                      amount === amt
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/[0.02] text-slate-300 border-white/[0.06]'
                    }`}
                  >
                    {amt.toLocaleString()} NX
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nominal Kustom (NX):</label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-[#141a2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Total Tagihan: Rp {amount.toLocaleString()}</span>
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Metode Pembayaran:</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full bg-[#141a2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="QRIS Realtime (BCA / Dana / Gopay)">QRIS Realtime (Semua E-Wallet & Bank)</option>
                <option value="Transfer Bank BCA (Manual)">Bank BCA - 8820199401 (MarrSpace)</option>
                <option value="Transfer Bank Mandiri">Bank Mandiri - 1370019283 (MarrSpace)</option>
                <option value="Dana / Gopay Direct">E-Wallet Direct Dana: 085743003734</option>
              </select>
            </div>

            {/* Ref Code / Nomor Pengirim */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nomor Pengirim / Ref Transfer:</label>
              <input
                type="text"
                placeholder="Contoh: 08123456789 atau BCA-Ref#992"
                value={refCode}
                onChange={e => setRefCode(e.target.value)}
                required
                className="w-full bg-[#141a2a] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Upload Bukti Simulation */}
            <div className="border border-dashed border-white/[0.15] rounded-2xl p-4 text-center bg-white/[0.01]">
              <UploadCloud className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-300">Upload Bukti Transfer</p>
              <p className="text-[10px] text-slate-400">JPG, PNG, atau WebP (Simulasi Otomatis)</p>
            </div>

            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Pengajuan berhasil dikirim! Owner sedang meninjau.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Kirim Pengajuan Top-up ({amount.toLocaleString()} NX)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* QRIS / Rekening Instruksi Box */}
        <div className="space-y-4">
          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#101728] to-[#0a0f1d] border border-emerald-500/20 shadow-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">QRIS Resmi Nixflow</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Scan melalui BCA, Livin, Dana, OVO, Gopay, ShopeePay, atau aplikasi perbankan apa pun.
            </p>

            <div className="p-3 bg-white rounded-2xl max-w-[180px] mx-auto shadow-xl">
              {/* QR Dummy visual */}
              <div className="w-full aspect-square bg-slate-900 rounded-lg flex items-center justify-center p-2">
                <div className="grid grid-cols-4 gap-1 w-full h-full opacity-90">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${i % 2 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-transparent'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <span className="text-emerald-400 font-bold">NMID: ID102938472918</span> • Nixflow Store
            </div>
          </div>

          {/* Riwayat Pengajuan User */}
          <div className="rounded-3xl p-5 bg-[#0c111e]/90 border border-white/[0.07] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Status Pengajuan Anda</h4>
            {myTopups.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada pengajuan top-up.</p>
            ) : (
              <div className="space-y-2">
                {myTopups.map(top => (
                  <div key={top.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-white">{top.amountNX.toLocaleString()} NX</span>
                      <p className="text-[10px] text-slate-400 font-mono">{top.createdAt.slice(0, 16)} • {top.referenceCode}</p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          top.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : top.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        }`}
                      >
                        {top.status === 'pending_review' ? 'Menunggu Review' : top.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { HelpCircle, MessageCircle, Shield, LifeBuoy, ExternalLink } from 'lucide-react';

export const SupportSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Layanan Bantuan & Dokumentasi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pusat Dukungan Nixflow
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Butuh bantuan terkait konfigurasi bot, kendala server, atau aktivasi API Pterodactyl? Hubungi kontak resmi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Support 1: Marrspace */}
        <div className="rounded-3xl p-5 sm:p-6 bg-[#0c121e]/90 border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Primary Support & Owner
            </span>
            <h3 className="text-base font-bold text-white mt-2">MarrSpace Core Support</h3>
            <p className="text-xs text-slate-400 mt-1">
              Bantuan teknis level infrastruktur server, bot WhatsApp Baileys, integrasi payment, dan konfigurasi cluster.
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">+60 17-518-7449</span>
            <a
              href="https://wa.me/60175187449"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Support 2: Yowtech */}
        <div className="rounded-3xl p-5 sm:p-6 bg-[#0c121e]/90 border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              Technical & Billing Support
            </span>
            <h3 className="text-base font-bold text-white mt-2">Yowtech | ren` Support</h3>
            <p className="text-xs text-slate-400 mt-1">
              Bantuan akun admin reseller, perpanjangan server, migrasi data egg, dan kendala deposit NX.
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-xs text-cyan-300 font-bold">+62 857-4300-3734</span>
            <a
              href="https://wa.me/6285743003734"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* SLA & Security note */}
      <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kebijakan Keamanan & Grace Period Server</span>
        </p>
        <p className="text-[11px] leading-relaxed">
          Server yang melewati masa aktif otomatis dihentikan dan memasuki masa <em>renew grace period</em> selama 2 hari (48 jam). Jika tidak diperpanjang, data server akan dihapus permanen dari cluster Pterodactyl untuk menghemat resource.
        </p>
      </div>

    </div>
  );
};

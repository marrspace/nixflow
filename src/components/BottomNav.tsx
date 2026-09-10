import React from 'react';
import { LayoutDashboard, ShoppingCart, Wallet, ShieldCheck, Crown, HelpCircle } from 'lucide-react';
import { useApp } from '../AppContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useApp();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07090f]/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 pb-safe"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around">
        
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all active:scale-90 ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-emerald-500/15' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all active:scale-90 ${
            activeTab === 'shop' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'shop' ? 'bg-emerald-500/15' : ''}`}>
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Katalog</span>
        </button>

        {/* Topup */}
        <button
          onClick={() => setActiveTab('topup')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all active:scale-90 ${
            activeTab === 'topup' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'topup' ? 'bg-emerald-500/15' : ''}`}>
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Topup</span>
        </button>

        {/* Admin Tab (Role check) */}
        {(currentUser.role === 'admin' || currentUser.role === 'owner') && (
          <button
            onClick={() => setActiveTab('admin_panel')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all active:scale-90 ${
              activeTab === 'admin_panel' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'admin_panel' ? 'bg-cyan-500/15' : ''}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Admin</span>
          </button>
        )}

        {/* Owner Tab */}
        {currentUser.role === 'owner' && (
          <button
            onClick={() => setActiveTab('owner')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all active:scale-90 ${
              activeTab === 'owner' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'owner' ? 'bg-amber-500/15' : ''}`}>
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Owner</span>
          </button>
        )}

        {/* Help / Support */}
        <button
          onClick={() => setActiveTab('support')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all active:scale-90 ${
            activeTab === 'support' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'support' ? 'bg-emerald-500/15' : ''}`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Bantuan</span>
        </button>

      </div>
    </nav>
  );
};

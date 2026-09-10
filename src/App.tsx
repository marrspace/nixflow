import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { UserDashboard } from './components/UserDashboard';
import { ShopCatalog } from './components/ShopCatalog';
import { TopupSection } from './components/TopupSection';
import { AdminPanelSection } from './components/AdminPanelSection';
import { OwnerSection } from './components/OwnerSection';
import { SupportSection } from './components/SupportSection';
import { AuthModal } from './components/AuthModal';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#07090f] text-slate-100 pb-20 md:pb-10 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Alert for Blocked User */}
        {currentUser.status === 'blocked' && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-between">
            <span>Akun Anda saat ini dinonaktifkan/diblokir oleh Owner. Anda tidak dapat melakukan order, renew, atau upgrade.</span>
          </div>
        )}

        {/* Tab Routing */}
        {activeTab === 'dashboard' && (
          <UserDashboard 
            onNavigateShop={() => setActiveTab('shop')} 
            onNavigateTopup={() => setActiveTab('topup')} 
          />
        )}

        {activeTab === 'shop' && (
          <ShopCatalog 
            onSuccessBuy={() => setActiveTab('dashboard')} 
          />
        )}

        {activeTab === 'topup' && (
          <TopupSection />
        )}

        {activeTab === 'admin_panel' && (currentUser.role === 'admin' || currentUser.role === 'owner') && (
          <AdminPanelSection />
        )}

        {activeTab === 'owner' && currentUser.role === 'owner' && (
          <OwnerSection />
        )}

        {activeTab === 'support' && (
          <SupportSection />
        )}

      </main>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block border-t border-white/[0.05] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <p>© 2026 Nixflow Cloud Platform • Powered by MarrSpace & Yowtech</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Single Pterodactyl Integration</span>
            <span>•</span>
            <span>Ledger-Safe Atomic Balance</span>
          </div>
        </div>
      </footer>

      {/* Mobile Android-Optimized Bottom Nav */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;

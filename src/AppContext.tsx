import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Package, ServerInstance, TopupRequest, LedgerEntry, PanelAccountCreated, Voucher, PterodactylConfig, NotificationItem, Role, UserLevel } from './types';
import { INITIAL_USERS, INITIAL_PACKAGES, INITIAL_SERVERS, INITIAL_TOPUPS, INITIAL_LEDGERS, INITIAL_VOUCHERS, INITIAL_PTERO_CONFIG, INITIAL_NOTIFICATIONS } from './mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  users: User[];
  packages: Package[];
  servers: ServerInstance[];
  topups: TopupRequest[];
  ledgers: LedgerEntry[];
  panelAccounts: PanelAccountCreated[];
  vouchers: Voucher[];
  pteroConfig: PterodactylConfig;
  notifications: NotificationItem[];
  // Actions
  buyServer: (pkgId: string, customDays: number, eggName: string, voucherCode?: string) => { success: boolean; message: string };
  renewServer: (serverId: string, days: number) => { success: boolean; message: string };
  upgradeServer: (serverId: string, extraRam: number, extraCpu: number, extraDisk: number) => { success: boolean; message: string };
  submitTopup: (amountNX: number, method: string, refCode: string, proofUrl: string) => void;
  reviewTopup: (topupId: string, status: 'approved' | 'rejected', note: string) => void;
  createAdminPanelUser: (shopUsername: string, email: string, whatsapp: string, pteroUsername: string, pkgId?: string) => { success: boolean; message: string };
  updatePteroConfig: (url: string, key: string) => { success: boolean; message: string };
  togglePackage: (pkgId: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'blocked' | 'disabled') => void;
  markNotifRead: (notifId: string) => void;
  registerUser: (username: string, email: string, whatsapp: string) => { success: boolean; message: string; secretKey: string };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[2]); // Default as User
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [servers, setServers] = useState<ServerInstance[]>(INITIAL_SERVERS);
  const [topups, setTopups] = useState<TopupRequest[]>(INITIAL_TOPUPS);
  const [ledgers, setLedgers] = useState<LedgerEntry[]>(INITIAL_LEDGERS);
  const [panelAccounts, setPanelAccounts] = useState<PanelAccountCreated[]>([]);
  const [vouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [pteroConfig, setPteroConfig] = useState<PterodactylConfig>(INITIAL_PTERO_CONFIG);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const switchRole = (role: Role) => {
    const found = users.find(u => u.role === role);
    if (found) setCurrentUser(found);
  };

  const markNotifRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const registerUser = (username: string, email: string, whatsapp: string) => {
    if (!email.endsWith('@gmail.com')) {
      return { success: false, message: 'Email wajib berdomain @gmail.com', secretKey: '' };
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username sudah digunakan!', secretKey: '' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email sudah terdaftar!', secretKey: '' };
    }
    const secretKey = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username,
      email,
      whatsapp,
      role: 'user',
      level: 'Member',
      balanceNX: 0,
      status: 'active',
      secretKey,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      totalSpentNX: 0
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Registrasi berhasil!', secretKey };
  };

  const submitTopup = (amountNX: number, method: string, refCode: string, proofUrl: string) => {
    const newTopup: TopupRequest = {
      id: `top_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      amountNX,
      amountIDR: amountNX, // 1 NX = 1 IDR base currency rate
      paymentMethod: method,
      accountNumber: 'NIX-QRIS-009',
      referenceCode: refCode || `TRX-${Date.now().toString().slice(-6)}`,
      proofImageUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60',
      status: 'pending_review',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setTopups(prev => [newTopup, ...prev]);
    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Top-up Diajukan',
      message: `Permintaan saldo sebesar ${amountNX.toLocaleString()} NX telah dikirim ke Owner.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }, ...prev]);
  };

  const reviewTopup = (topupId: string, status: 'approved' | 'rejected', note: string) => {
    const topup = topups.find(t => t.id === topupId);
    if (!topup || topup.status !== 'pending_review') return;

    setTopups(prev => prev.map(t => t.id === topupId ? { ...t, status, decisionNote: note, reviewedBy: currentUser.username } : t));

    if (status === 'approved') {
      // Credit balance
      setUsers(prev => prev.map(u => {
        if (u.id === topup.userId) {
          const newBal = u.balanceNX + topup.amountNX;
          // create ledger
          const ledger: LedgerEntry = {
            id: `ledg_${Date.now()}`,
            userId: u.id,
            amountNX: topup.amountNX,
            balanceBefore: u.balanceNX,
            balanceAfter: newBal,
            type: 'credit',
            description: `Topup Saldo disetujui Owner (${topup.paymentMethod})`,
            referenceId: topup.referenceCode,
            actor: currentUser.username,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
          };
          setLedgers(l => [ledger, ...l]);
          return { ...u, balanceNX: newBal };
        }
        return u;
      }));

      // Notify User
      setNotifications(prev => [{
        id: `notif_${Date.now()}`,
        userId: topup.userId,
        title: 'Top-up Disetujui!',
        message: `Saldo ${topup.amountNX.toLocaleString()} NX telah ditambahkan ke akun Anda.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }, ...prev]);
    } else {
      setNotifications(prev => [{
        id: `notif_${Date.now()}`,
        userId: topup.userId,
        title: 'Top-up Ditolak',
        message: `Permintaan saldo Anda ditolak. Alasan: ${note}`,
        type: 'alert',
        read: false,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }, ...prev]);
    }
  };

  const buyServer = (pkgId: string, customDays: number, eggName: string, voucherCode?: string) => {
    if (currentUser.role === 'owner') {
      return { success: false, message: 'Owner tidak dapat membuat server untuk akun Owner sendiri!' };
    }

    const pkg = packages.find(p => p.id === pkgId);
    if (!pkg) return { success: false, message: 'Paket tidak ditemukan!' };

    // Limit calculation by level
    const maxLimit = currentUser.level === 'VIP' ? 10 : currentUser.level === 'Gold' ? 7 : currentUser.level === 'Silver' ? 4 : currentUser.level === 'Bronze' ? 2 : 1;
    const userServerCount = servers.filter(s => s.userId === currentUser.id && s.status !== 'deleting' && s.status !== 'error').length;
    if (userServerCount >= maxLimit) {
      return { success: false, message: `Batas server untuk level ${currentUser.level} (${maxLimit} server) telah tercapai!` };
    }

    if (pkg.isFreeTrial) {
      const alreadyHasFree = servers.some(s => s.userId === currentUser.id && s.packageId === pkg.id);
      if (alreadyHasFree) {
        return { success: false, message: 'Free trial hanya berlaku 1 kali per akun user!' };
      }
    }

    // Price calculation
    let calculatedPrice = Math.round((pkg.price30DaysNX / 30) * customDays);
    if (pkg.isFreeTrial) calculatedPrice = 0;

    // Apply voucher
    if (voucherCode) {
      const v = vouchers.find(vc => vc.code === voucherCode && vc.active);
      if (v) {
        calculatedPrice = Math.round(calculatedPrice * (1 - v.discountPercent / 100));
      }
    }

    if (currentUser.balanceNX < calculatedPrice) {
      return { success: false, message: `Saldo NX tidak mencukupi! Diperlukan ${calculatedPrice.toLocaleString()} NX.` };
    }

    // Atomic Balance Deduction
    const newBal = currentUser.balanceNX - calculatedPrice;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balanceNX: newBal, totalSpentNX: u.totalSpentNX + calculatedPrice } : u));
    setCurrentUser(prev => ({ ...prev, balanceNX: newBal, totalSpentNX: prev.totalSpentNX + calculatedPrice }));

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + customDays);
    const renewDate = new Date(expiryDate);
    renewDate.setDate(renewDate.getDate() + 2); // 2 days grace

    const newServer: ServerInstance = {
      id: `srv_${Date.now()}`,
      name: `${pkg.name.replace(/\s+/g, '-')}-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser.id,
      packageId: pkg.id,
      packageName: pkg.name,
      eggName: eggName || 'NodeJS 20 (Baileys)',
      nodeName: 'SG-Node-01 (Singapore)',
      status: 'active',
      ramGB: pkg.ramGB,
      cpuPercent: pkg.cpuPercent,
      diskGB: pkg.diskGB,
      ipPort: `103.145.226.${Math.floor(10 + Math.random() * 80)}:${Math.floor(25500 + Math.random() * 500)}`,
      identifier: Math.random().toString(36).substring(2, 10),
      panelUrl: 'https://panel.marrlabs.my.id',
      expiresAt: expiryDate.toISOString().replace('T', ' ').slice(0, 19),
      renewDeadline: renewDate.toISOString().replace('T', ' ').slice(0, 19),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setServers(prev => [newServer, ...prev]);

    // Ledger
    const ledger: LedgerEntry = {
      id: `ledg_${Date.now()}`,
      userId: currentUser.id,
      amountNX: calculatedPrice,
      balanceBefore: currentUser.balanceNX,
      balanceAfter: newBal,
      type: 'debit',
      description: `Pembelian Server ${pkg.name} (${customDays} Hari)`,
      referenceId: `ORD-${newServer.identifier}`,
      actor: currentUser.username,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setLedgers(l => [ledger, ...l]);

    // Notification
    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Server Berhasil Dibuat!',
      message: `Server ${newServer.name} siap digunakan di panel Pterodactyl.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }, ...prev]);

    return { success: true, message: `Server ${newServer.name} berhasil dibuat secara otomatis!` };
  };

  const renewServer = (serverId: string, days: number) => {
    const srv = servers.find(s => s.id === serverId && s.userId === currentUser.id);
    if (!srv) return { success: false, message: 'Server tidak ditemukan!' };

    const pkg = packages.find(p => p.id === srv.packageId) || packages[1];
    const price = Math.round((pkg.price30DaysNX / 30) * days);

    if (currentUser.balanceNX < price) {
      return { success: false, message: `Saldo NX tidak mencukupi untuk renew! Butuh ${price.toLocaleString()} NX.` };
    }

    const newBal = currentUser.balanceNX - price;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balanceNX: newBal } : u));
    setCurrentUser(prev => ({ ...prev, balanceNX: newBal }));

    const currentExp = new Date(srv.expiresAt);
    const baseDate = currentExp > new Date() ? currentExp : new Date();
    baseDate.setDate(baseDate.getDate() + days);
    const renewDate = new Date(baseDate);
    renewDate.setDate(renewDate.getDate() + 2);

    setServers(prev => prev.map(s => s.id === serverId ? {
      ...s,
      status: 'active',
      expiresAt: baseDate.toISOString().replace('T', ' ').slice(0, 19),
      renewDeadline: renewDate.toISOString().replace('T', ' ').slice(0, 19),
    } : s));

    const ledger: LedgerEntry = {
      id: `ledg_${Date.now()}`,
      userId: currentUser.id,
      amountNX: price,
      balanceBefore: currentUser.balanceNX,
      balanceAfter: newBal,
      type: 'debit',
      description: `Perpanjangan (Renew) Server ${srv.name} (${days} Hari)`,
      referenceId: `RNW-${srv.identifier}`,
      actor: currentUser.username,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setLedgers(l => [ledger, ...l]);

    return { success: true, message: `Server ${srv.name} berhasil diperpanjang ${days} hari!` };
  };

  const upgradeServer = (serverId: string, extraRam: number, extraCpu: number, extraDisk: number) => {
    const srv = servers.find(s => s.id === serverId && s.userId === currentUser.id);
    if (!srv) return { success: false, message: 'Server tidak ditemukan!' };

    const newRam = srv.ramGB + extraRam;
    const newCpu = srv.cpuPercent + extraCpu;
    const newDisk = srv.diskGB + extraDisk;

    if (newRam > 12 || newCpu > 240 || newDisk > 50) {
      return { success: false, message: 'Resource melebihi batas platform maksimum (RAM 12GB, CPU 240%, Disk 50GB)!' };
    }

    // Cost estimation
    const upgradeCost = Math.round((extraRam * 1500) + (extraCpu * 30) + (extraDisk * 300));
    if (currentUser.balanceNX < upgradeCost) {
      return { success: false, message: `Saldo NX tidak mencukupi untuk upgrade! Butuh ${upgradeCost.toLocaleString()} NX.` };
    }

    const newBal = currentUser.balanceNX - upgradeCost;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balanceNX: newBal } : u));
    setCurrentUser(prev => ({ ...prev, balanceNX: newBal }));

    setServers(prev => prev.map(s => s.id === serverId ? {
      ...s,
      ramGB: newRam,
      cpuPercent: newCpu,
      diskGB: newDisk,
    } : s));

    const ledger: LedgerEntry = {
      id: `ledg_${Date.now()}`,
      userId: currentUser.id,
      amountNX: upgradeCost,
      balanceBefore: currentUser.balanceNX,
      balanceAfter: newBal,
      type: 'debit',
      description: `Upgrade Resource Server ${srv.name} (+${extraRam}GB RAM, +${extraCpu}% CPU, +${extraDisk}GB Disk)`,
      referenceId: `UPG-${srv.identifier}`,
      actor: currentUser.username,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setLedgers(l => [ledger, ...l]);

    return { success: true, message: `Upgrade berhasil! Server di-restart otomatis dengan resource baru.` };
  };

  const createAdminPanelUser = (shopUsername: string, email: string, whatsapp: string, pteroUsername: string, pkgId?: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'owner') {
      return { success: false, message: 'Akses khusus Admin / Owner!' };
    }

    const panelCost = 500; // 500 NX flat cost
    let totalCost = panelCost;
    let selectedPkg: Package | undefined;

    if (pkgId) {
      selectedPkg = packages.find(p => p.id === pkgId);
      if (selectedPkg) totalCost += selectedPkg.price30DaysNX;
    }

    if (currentUser.balanceNX < totalCost) {
      return { success: false, message: `Saldo Admin tidak mencukupi! Butuh ${totalCost.toLocaleString()} NX (Termasuk fee 500 NX/akun).` };
    }

    const newBal = currentUser.balanceNX - totalCost;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balanceNX: newBal } : u));
    setCurrentUser(prev => ({ ...prev, balanceNX: newBal }));

    // Create Shop user
    const generatedSecret = Math.floor(1000 + Math.random() * 9000).toString();
    const newShopUser: User = {
      id: `usr_${Date.now()}`,
      username: shopUsername,
      email,
      whatsapp,
      role: 'user',
      level: 'Member',
      balanceNX: 0,
      status: 'active',
      secretKey: generatedSecret,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      managedByAdminId: currentUser.id,
      totalSpentNX: 0
    };
    setUsers(prev => [...prev, newShopUser]);

    const generatedPassword = `Nx#${Math.random().toString(36).slice(-8)}!`;
    const newPanelAccount: PanelAccountCreated = {
      id: `pacc_${Date.now()}`,
      adminId: currentUser.id,
      panelUsername: pteroUsername,
      panelEmail: email,
      generatedPassword,
      assignedPackage: selectedPkg ? selectedPkg.name : 'None',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'active'
    };
    setPanelAccounts(prev => [newPanelAccount, ...prev]);

    // Ledger for Admin
    const ledger: LedgerEntry = {
      id: `ledg_${Date.now()}`,
      userId: currentUser.id,
      amountNX: totalCost,
      balanceBefore: currentUser.balanceNX,
      balanceAfter: newBal,
      type: 'debit',
      description: `Pembuatan Akun User Panel Pterodactyl (${pteroUsername}) [Fee 500 NX${selectedPkg ? ` + ${selectedPkg.name}` : ''}]`,
      referenceId: `ADM-ACC-${newPanelAccount.id}`,
      actor: currentUser.username,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setLedgers(l => [ledger, ...l]);

    return {
      success: true,
      message: `Akun Pterodactyl '${pteroUsername}' & User '${shopUsername}' berhasil dibuat! Password Panel: ${generatedPassword} | Secret Key Shop: ${generatedSecret}`
    };
  };

  const updatePteroConfig = (url: string, key: string) => {
    if (currentUser.role !== 'owner') return { success: false, message: 'Hanya Owner yang dapat mengubah konfigurasi Pterodactyl!' };
    setPteroConfig({
      panelUrl: url,
      apiKeyMasked: key.slice(0, 5) + '••••••••••••••••••••' + key.slice(-5),
      isConnected: true,
      lastChecked: new Date().toISOString().replace('T', ' ').slice(0, 19),
      nodeCount: 3,
      nestCount: 8,
      eggCount: 24
    });
    return { success: true, message: 'Konfigurasi Pterodactyl berhasil diverifikasi & disimpan!' };
  };

  const togglePackage = (pkgId: string) => {
    if (currentUser.role !== 'owner') return;
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, isActive: !p.isActive } : p));
  };

  const updateUserStatus = (userId: string, status: 'active' | 'blocked' | 'disabled') => {
    if (currentUser.role !== 'owner') return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        packages,
        servers,
        topups,
        ledgers,
        panelAccounts,
        vouchers,
        pteroConfig,
        notifications,
        buyServer,
        renewServer,
        upgradeServer,
        submitTopup,
        reviewTopup,
        createAdminPanelUser,
        updatePteroConfig,
        togglePackage,
        updateUserStatus,
        markNotifRead,
        registerUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

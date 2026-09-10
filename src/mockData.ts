import { User, Package, ServerInstance, TopupRequest, LedgerEntry, PanelAccountCreated, Voucher, PterodactylConfig, NotificationItem } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_marr_owner',
    username: 'marr',
    email: 'marr@gmail.com',
    whatsapp: '+60175187449',
    password: 'marrnull',
    role: 'owner',
    level: 'VIP',
    balanceNX: 999999,
    status: 'active',
    secretKey: '8899',
    createdAt: '2026-08-01 10:00:00',
    totalSpentNX: 0,
  },
  {
    id: 'usr_yowtech_admin',
    username: 'yowtech',
    email: 'yowtech@gmail.com',
    whatsapp: '+6285743003734',
    password: 'yownull',
    role: 'admin',
    level: 'Gold',
    balanceNX: 50000,
    status: 'active',
    secretKey: '1234',
    createdAt: '2026-08-15 14:20:00',
    totalSpentNX: 12500,
  },
  {
    id: 'usr_demo_user',
    username: 'userdemo',
    email: 'userdemo@gmail.com',
    whatsapp: '+6288973387893',
    password: 'user123',
    role: 'user',
    level: 'Silver',
    balanceNX: 25000,
    status: 'active',
    secretKey: '7777',
    createdAt: '2026-09-01 09:15:00',
    totalSpentNX: 45000,
  }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg_free',
    name: 'Free Trial',
    ramGB: 1,
    cpuPercent: 50,
    diskGB: 2,
    price30DaysNX: 0,
    freeTrialDays: 3,
    isFreeTrial: true,
    isActive: true,
    eggId: 'egg_nodejs',
    description: 'Uji coba performa node cloud Nixflow gratis 3 hari untuk 1 user.',
  },
  {
    id: 'pkg_starter',
    name: 'Starter Cloud',
    ramGB: 2,
    cpuPercent: 80,
    diskGB: 5,
    price30DaysNX: 5000,
    isActive: true,
    eggId: 'egg_nodejs',
    description: 'Cocok untuk WhatsApp bot ringan, Discord bot, atau script automation.',
  },
  {
    id: 'pkg_basic',
    name: 'Basic Node',
    ramGB: 4,
    cpuPercent: 120,
    diskGB: 10,
    price30DaysNX: 10000,
    isActive: true,
    eggId: 'egg_python',
    description: 'Solusi optimal untuk multi-bot dan backend API skala kecil.',
    popular: true,
  },
  {
    id: 'pkg_pro',
    name: 'Pro Engine',
    ramGB: 6,
    cpuPercent: 160,
    diskGB: 20,
    price30DaysNX: 15000,
    isActive: true,
    eggId: 'egg_python',
    description: 'Performa tinggi untuk Game server & bot traffic ramai tanpa throttle.',
  },
  {
    id: 'pkg_advanced',
    name: 'Advanced Core',
    ramGB: 8,
    cpuPercent: 200,
    diskGB: 35,
    price30DaysNX: 22500,
    isActive: true,
    eggId: 'egg_generic',
    description: 'Dedicated compute resource untuk operasional intensif & database.',
  },
  {
    id: 'pkg_vip',
    name: 'VIP Ultra Max',
    ramGB: 12,
    cpuPercent: 240,
    diskGB: 50,
    price30DaysNX: 30000,
    isActive: true,
    eggId: 'egg_generic',
    description: 'Limit hardware maksimal platform dengan prioritas I/O NVMe ultra-fast.',
  }
];

export const INITIAL_SERVERS: ServerInstance[] = [
  {
    id: 'srv_nix01',
    name: 'SawakoN1-WhatsApp',
    userId: 'usr_demo_user',
    packageId: 'pkg_basic',
    packageName: 'Basic Node',
    eggName: 'NodeJS 20 (Baileys)',
    nodeName: 'SG-Node-01 (Singapore)',
    status: 'active',
    ramGB: 4,
    cpuPercent: 120,
    diskGB: 10,
    ipPort: '103.145.226.18:25565',
    identifier: 'd8a7c29e',
    panelUrl: 'https://panel.marrlabs.my.id',
    expiresAt: '2026-09-28 23:59:59',
    renewDeadline: '2026-09-30 23:59:59',
    createdAt: '2026-08-29 14:00:00'
  },
  {
    id: 'srv_nix02',
    name: 'Nexara-Protector-Core',
    userId: 'usr_demo_user',
    packageId: 'pkg_pro',
    packageName: 'Pro Engine',
    eggName: 'Generic Java & Node',
    nodeName: 'ID-Node-02 (Jakarta Direct)',
    status: 'renew_window',
    ramGB: 6,
    cpuPercent: 160,
    diskGB: 20,
    ipPort: '103.145.226.19:25570',
    identifier: 'f4e19b3a',
    panelUrl: 'https://panel.marrlabs.my.id',
    expiresAt: '2026-09-09 18:00:00',
    renewDeadline: '2026-09-11 18:00:00',
    createdAt: '2026-08-10 18:00:00'
  }
];

export const INITIAL_TOPUPS: TopupRequest[] = [
  {
    id: 'top_9901',
    userId: 'usr_demo_user',
    username: 'userdemo',
    amountNX: 25000,
    amountIDR: 25000,
    paymentMethod: 'QRIS Realtime (All Payment)',
    accountNumber: 'NIX-QRIS-009',
    referenceCode: 'TRX-NX-882194',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60',
    status: 'pending_review',
    createdAt: '2026-09-10 10:15:00',
  }
];

export const INITIAL_LEDGERS: LedgerEntry[] = [
  {
    id: 'ledg_001',
    userId: 'usr_demo_user',
    amountNX: 10000,
    balanceBefore: 35000,
    balanceAfter: 25000,
    type: 'debit',
    description: 'Pembelian Server Basic Node (30 Hari)',
    referenceId: 'ORD-SRV-901',
    actor: 'userdemo',
    createdAt: '2026-09-01 09:20:00'
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    code: 'NIXFLOWFIRST',
    discountPercent: 15,
    maxUsage: 100,
    usedCount: 34,
    expiresAt: '2026-12-31',
    minDurationDays: 30,
    active: true,
  },
  {
    code: 'MARRSPACEVIP',
    discountPercent: 20,
    maxUsage: 50,
    usedCount: 12,
    expiresAt: '2026-10-31',
    minDurationDays: 30,
    active: true,
  }
];

export const INITIAL_PTERO_CONFIG: PterodactylConfig = {
  panelUrl: 'https://panel.marrlabs.my.id',
  apiKeyMasked: 'ptlc_••••••••••••••••••••99a8f',
  isConnected: true,
  lastChecked: '2026-09-10 11:20:00',
  nodeCount: 3,
  nestCount: 8,
  eggCount: 24,
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_demo_user',
    title: 'Server Memasuki Masa Renew',
    message: 'Server Nexara-Protector-Core telah berakhir. Masa tenggang renew tersisa 24 jam sebelum dihapus.',
    type: 'warning',
    read: false,
    createdAt: '2026-09-09 18:00:00',
  },
  {
    id: 'notif_2',
    userId: 'usr_demo_user',
    title: 'Topup Diajukan',
    message: 'Pengajuan isi saldo sebesar 25.000 NX sedang menunggu verifikasi Owner.',
    type: 'info',
    read: true,
    createdAt: '2026-09-10 10:15:00',
  }
];

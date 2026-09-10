export type Role = 'owner' | 'admin' | 'user';
export type UserLevel = 'Member' | 'Bronze' | 'Silver' | 'Gold' | 'VIP';

export interface User {
  id: string;
  username: string;
  email: string;
  whatsapp: string;
  password?: string;
  role: Role;
  level: UserLevel;
  balanceNX: number;
  status: 'active' | 'blocked' | 'disabled';
  secretKey: string;
  createdAt: string;
  managedByAdminId?: string;
  totalSpentNX: number;
}

export interface Package {
  id: string;
  name: string;
  ramGB: number;
  cpuPercent: number;
  diskGB: number;
  price30DaysNX: number;
  freeTrialDays?: number;
  isFreeTrial?: boolean;
  isActive: boolean;
  eggId: string;
  description: string;
  popular?: boolean;
}

export interface ServerInstance {
  id: string;
  name: string;
  userId: string;
  packageId: string;
  packageName: string;
  eggName: string;
  nodeName: string;
  status: 'active' | 'provisioning' | 'stopped' | 'renew_window' | 'deleting' | 'error';
  ramGB: number;
  cpuPercent: number;
  diskGB: number;
  ipPort: string;
  identifier: string; // ptero external/uuid
  panelUrl: string;
  expiresAt: string;
  renewDeadline: string;
  createdAt: string;
}

export interface TopupRequest {
  id: string;
  userId: string;
  username: string;
  amountNX: number;
  amountIDR: number;
  paymentMethod: string;
  accountNumber: string;
  referenceCode: string;
  proofImageUrl: string;
  status: 'pending_review' | 'approved' | 'rejected';
  createdAt: string;
  decisionNote?: string;
  reviewedBy?: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  amountNX: number;
  balanceBefore: number;
  balanceAfter: number;
  type: 'credit' | 'debit' | 'refund' | 'reservation';
  description: string;
  referenceId: string;
  actor: string;
  createdAt: string;
}

export interface PanelAccountCreated {
  id: string;
  adminId: string;
  panelUsername: string;
  panelEmail: string;
  generatedPassword?: string;
  assignedPackage: string;
  createdAt: string;
  status: 'active' | 'failed';
}

export interface Voucher {
  code: string;
  discountPercent: number;
  maxUsage: number;
  usedCount: number;
  expiresAt: string;
  minDurationDays: number;
  active: boolean;
}

export interface PterodactylConfig {
  panelUrl: string;
  apiKeyMasked: string;
  isConnected: boolean;
  lastChecked: string;
  nodeCount: number;
  nestCount: number;
  eggCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  metadata: string;
  timestamp: string;
  ip: string;
}

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 8787);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const SERVER_ROOT = path.resolve(process.env.NIXFLOW_SERVER_ROOT || path.join(DATA_DIR, 'server-files'));
const SESSION_SECRET = process.env.NIXFLOW_SESSION_SECRET || 'change-this-session-secret-before-production';
const OWNER_USERNAME = process.env.OWNER_USERNAME || 'marrspace';
const OWNER_PASSWORD = process.env.OWNER_INITIAL_PASSWORD || 'marnull';
const OWNER_LOGIN_TOKEN = process.env.OWNER_LOGIN_TOKEN || OWNER_PASSWORD;
const isProd = process.env.NODE_ENV === 'production';
const COOKIE = 'nixflow_session';
const PTERO_URL = String(process.env.PTERODACTYL_URL || '').replace(/\/$/, '');
const PTERO_KEY = process.env.PTERODACTYL_CLIENT_API_KEY || '';
const PTERO_SERVER = process.env.PTERODACTYL_SERVER_IDENTIFIER || '';
const pteroConfigured = Boolean(PTERO_URL && PTERO_KEY && PTERO_SERVER);

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(SERVER_ROOT, { recursive: true });

function now() { return new Date().toISOString(); }
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}
function createSession(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
function readSession(req) {
  const raw = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!raw) return null;
  const [payload, signature] = raw.split('.');
  const expected = payload ? sign(payload) : '';
  if (!payload || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch { return null; }
}
function defaultStore() {
  return {
    users: [{ id: 'usr_owner', username: OWNER_USERNAME, email: '', whatsapp: '', passwordHash: hashPassword(OWNER_PASSWORD), secretHash: hashPassword(OWNER_LOGIN_TOKEN), role: 'owner', status: 'active', createdAt: now() }],
    settings: { qris: { enabled: false, merchantName: '', qrImageData: '', instructions: 'Bayar sesuai nominal. Upload bukti hanya melalui kanal resmi.' }, server: { displayName: 'NixFlow Managed Node', provider: 'not-configured', status: 'offline' } },
    servers: [],
    audit: [],
    payments: [],
    baileys: { status: 'disconnected', phone: '', lastEventAt: null, qrAvailable: false }
  };
}
function loadStore() {
  let s;
  if (!fs.existsSync(STORE_FILE)) { s = defaultStore(); fs.writeFileSync(STORE_FILE, JSON.stringify(s, null, 2)); return s; }
  try { s = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')); } catch { s = defaultStore(); }
  const owner = s.users?.find(u => u.username === OWNER_USERNAME || u.role === 'owner');
  if (owner) {
    if (!owner.passwordHash) owner.passwordHash = hashPassword(OWNER_PASSWORD);
    if (!owner.secretHash) owner.secretHash = hashPassword(OWNER_LOGIN_TOKEN);
    if (!owner.email) owner.email = 'marrspace@gmail.com';
    owner.username = OWNER_USERNAME;
  } else if (s.users) {
    s.users.unshift({ id: 'usr_owner', username: OWNER_USERNAME, email: 'marrspace@gmail.com', whatsapp: '+6288973387893', passwordHash: hashPassword(OWNER_PASSWORD), secretHash: hashPassword(OWNER_LOGIN_TOKEN), role: 'owner', status: 'active', createdAt: now() });
  }
  return s;
}
let store = loadStore();
function saveStore() { fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2)); }
function audit(actor, action, meta = {}) { store.audit.unshift({ id: crypto.randomUUID(), actor, action, meta, createdAt: now() }); store.audit = store.audit.slice(0, 200); saveStore(); }
async function pteroFetch(endpoint, options = {}) {
  if (!pteroConfigured) throw new Error('PTERODACTYL_NOT_CONFIGURED');
  const response = await fetch(`${PTERO_URL}/api/client/servers/${encodeURIComponent(PTERO_SERVER)}${endpoint}`, { ...options, headers: { Accept: 'Application/vnd.pterodactyl.v1+json', 'Content-Type': 'application/json', Authorization: `Bearer ${PTERO_KEY}`, ...(options.headers || {}) } });
  const text = await response.text();
  let body = {}; try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!response.ok) { const error = new Error(body.errors?.[0]?.detail || `PTERODACTYL_HTTP_${response.status}`); error.status = response.status; throw error; }
  return body;
}
function pteroPath(value) { const clean = String(value || '/').replace(/\\/g, '/'); return clean.startsWith('/') ? clean : `/${clean}`; }
function safePath(relative = '.') {
  const target = path.resolve(SERVER_ROOT, relative);
  if (target !== SERVER_ROOT && !target.startsWith(`${SERVER_ROOT}${path.sep}`)) throw new Error('Path outside server sandbox');
  return target;
}
function publicSettings() {
  return { qris: { enabled: store.settings.qris.enabled, merchantName: store.settings.qris.merchantName, hasQr: Boolean(store.settings.qris.qrImageData), instructions: store.settings.qris.instructions }, server: { ...store.settings.server, pterodactylConfigured: pteroConfigured, identifier: pteroConfigured ? PTERO_SERVER : undefined }, baileys: { ...store.baileys, qrImage: undefined } };
}
function requireAuth(req, res, next) { const session = readSession(req); const user = session && store.users.find(u => u.id === session.id); if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' }); req.user = user; next(); }
function requireOwner(req, res, next) { requireAuth(req, res, () => req.user.role === 'owner' ? next() : res.status(403).json({ error: 'OWNER_ONLY' })); }

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(ROOT, 'dist')));

const attempts = new Map();
function setSession(res, user) { res.cookie(COOKIE, createSession(user), { httpOnly: true, secure: isProd, sameSite: 'strict', path: '/', maxAge: 43200000 }); }
function publicUser(user) { return { username: user.username, email: user.email || undefined, role: user.role, status: user.status || 'active' }; }
app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || 'unknown'; const record = attempts.get(ip) || { count: 0, reset: Date.now() + 60000 };
  if (record.reset < Date.now()) { record.count = 0; record.reset = Date.now() + 60000; }
  if (record.count >= 8) return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS' });
  const { identifier, token, username, password } = req.body || {};
  const lookup = String(identifier || username || '').trim().toLowerCase();
  const providedToken = String(token || '');
  const providedPassword = String(password || '');
  const credential = providedToken || providedPassword;
  const user = store.users.find(u => u.username.toLowerCase() === lookup || String(u.email || '').toLowerCase() === lookup);
  const tokenOk = Boolean(user && user.status !== 'blocked' && user.status !== 'disabled' && (
    (providedToken && user.secretHash && verifyPassword(providedToken, user.secretHash)) ||
    (providedPassword && user.passwordHash && verifyPassword(providedPassword, user.passwordHash)) ||
    ((!providedToken && !providedPassword) && 
     ((user.secretHash && verifyPassword(credential, user.secretHash)) ||
      (user.passwordHash && verifyPassword(credential, user.passwordHash))))
  ));
  if (!tokenOk) { record.count++; attempts.set(ip, record); console.warn('[auth] login_failed', { identifier: lookup.slice(0, 80), ip, at: now() }); return res.status(401).json({ error: 'INVALID_CREDENTIALS' }); }
  attempts.delete(ip); setSession(res, user); audit(user.username, 'auth.login', { ip, method: token ? 'secret_token' : 'legacy_password' }); console.info('[auth] login_success', { username: user.username, ip, at: now() }); res.json({ user: publicUser(user) });
});
app.post('/api/auth/register', (req, res) => {
  const { username, email, whatsapp, password, confirmPassword } = req.body || {};
  const name = String(username || '').trim(); const mail = String(email || '').trim().toLowerCase(); const phone = String(whatsapp || '').trim();
  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(name)) return res.status(400).json({ error: 'INVALID_USERNAME' });
  if (!/^.+@gmail\.com$/.test(mail)) return res.status(400).json({ error: 'GMAIL_REQUIRED' });
  if (!/^\+?[0-9][0-9 ()-]{7,24}$/.test(phone)) return res.status(400).json({ error: 'INVALID_WHATSAPP' });
  if (String(password || '').length < 8 || password !== confirmPassword) return res.status(400).json({ error: 'PASSWORD_MISMATCH_OR_SHORT' });
  if (store.users.some(u => u.username.toLowerCase() === name.toLowerCase() || String(u.email || '').toLowerCase() === mail || u.whatsapp === phone)) return res.status(409).json({ error: 'ACCOUNT_ALREADY_EXISTS' });
  const secretKey = String(crypto.randomInt(1000, 10000)); const user = { id: `usr_${crypto.randomUUID()}`, username: name, email: mail, whatsapp: phone, passwordHash: hashPassword(password), secretHash: hashPassword(secretKey), role: 'user', status: 'active', createdAt: now() };
  store.users.push(user); audit(user.username, 'account.created', { role: 'user' }); setSession(res, user); console.info('[auth] account_created', { username: user.username, ip: req.ip, at: now() }); res.status(201).json({ user: publicUser(user), secretKey });
});
app.post('/api/auth/logout', requireAuth, (req, res) => { audit(req.user.username, 'auth.logout'); res.clearCookie(COOKIE, { httpOnly: true, secure: isProd, sameSite: 'strict', path: '/' }); res.json({ ok: true }); });
app.get('/api/auth/me', requireAuth, (req, res) => res.json({ user: { username: req.user.username, role: req.user.role } }));
app.get('/api/audit', requireOwner, (req, res) => res.json({ entries: store.audit.slice(0, 100) }));

app.get('/api/overview', requireAuth, (req, res) => res.json({ settings: publicSettings(), servers: store.servers.map(({ providerUrl, apiKey, ...safe }) => safe), payments: store.payments.map(p => ({ ...p, proofImageData: undefined })), audit: store.audit.slice(0, 30) }));
app.get('/api/files', requireOwner, async (req, res) => { try { const requested = pteroPath(req.query.path); if (pteroConfigured) { const body = await pteroFetch(`/files/list-directory?directory=${encodeURIComponent(requested)}`); return res.json({ path: requested, entries: (body.data || []).map(item => ({ name: item.attributes.name, type: item.attributes.is_file ? 'file' : 'directory', size: item.attributes.size })) }); } const dir = safePath(req.query.path || '.'); const entries = fs.readdirSync(dir, { withFileTypes: true }).map(e => ({ name: e.name, type: e.isDirectory() ? 'directory' : 'file', size: e.isFile() ? fs.statSync(path.join(dir, e.name)).size : undefined })); res.json({ path: path.relative(SERVER_ROOT, dir) || '.', entries }); } catch (e) { res.status(e.status || 400).json({ error: e.message }); } });
app.post('/api/files/folder', requireOwner, async (req, res) => { try { const requested = pteroPath(req.body.path); if (pteroConfigured) { const parent = path.posix.dirname(requested); const name = path.posix.basename(requested); await pteroFetch('/files/create-folder', { method: 'POST', body: JSON.stringify({ root: parent === '/' ? '/' : parent, name }) }); audit(req.user.username, 'files.mkdir', { path: requested, provider: 'pterodactyl' }); return res.json({ ok: true }); } const target = safePath(req.body.path); fs.mkdirSync(target, { recursive: true }); audit(req.user.username, 'files.mkdir', { path: req.body.path }); res.json({ ok: true }); } catch (e) { res.status(e.status || 400).json({ error: e.message }); } });
app.delete('/api/files', requireOwner, async (req, res) => { try { const requested = pteroPath(req.body.path); if (pteroConfigured) { await pteroFetch('/files/delete', { method: 'POST', body: JSON.stringify({ root: path.posix.dirname(requested), files: [path.posix.basename(requested)] }) }); audit(req.user.username, 'files.delete', { path: requested, provider: 'pterodactyl' }); return res.json({ ok: true }); } const target = safePath(req.body.path); if (target === SERVER_ROOT) throw new Error('Cannot delete server root'); fs.rmSync(target, { recursive: true, force: true }); audit(req.user.username, 'files.delete', { path: req.body.path }); res.json({ ok: true }); } catch (e) { res.status(e.status || 400).json({ error: e.message }); } });

const allowedActions = new Set(['start', 'stop', 'restart']);
app.post('/api/server/action', requireOwner, async (req, res) => { const action = String(req.body.action || ''); if (!allowedActions.has(action)) return res.status(400).json({ error: 'ACTION_NOT_ALLOWED' }); try { if (pteroConfigured) await pteroFetch('/power', { method: 'POST', body: JSON.stringify({ signal: action }) }); store.settings.server.status = action === 'stop' ? 'offline' : 'online'; audit(req.user.username, `server.${action}`, { provider: pteroConfigured ? 'pterodactyl' : 'local-fallback' }); res.json({ ok: true, status: store.settings.server.status, provider: pteroConfigured ? 'pterodactyl' : 'local-fallback' }); } catch (e) { res.status(e.status || 502).json({ error: e.message }); } });
app.get('/api/server/resources', requireOwner, async (req, res) => { try { const body = await pteroFetch('/resources'); res.json(body); } catch (e) { res.status(e.status || 502).json({ error: e.message }); } });
app.post('/api/server/startup', requireOwner, async (req, res) => { const command = String(req.body.command || '').trim(); const image = String(req.body.image || '').trim(); if (!command || command.length > 300 || /[;&|`$<>]/.test(command)) return res.status(400).json({ error: 'STARTUP_COMMAND_REJECTED' }); try { if (pteroConfigured) await pteroFetch('/startup', { method: 'PATCH', body: JSON.stringify({ startup: command, image }) }); store.settings.server.startup = { command, image, updatedAt: now() }; audit(req.user.username, 'server.startup.update', { provider: pteroConfigured ? 'pterodactyl' : 'local-fallback' }); res.json({ ok: true, startup: store.settings.server.startup }); } catch (e) { res.status(e.status || 502).json({ error: e.message }); } });

app.put('/api/settings/qris', requireOwner, (req, res) => { const { enabled, merchantName, qrImageData, instructions } = req.body || {}; if (qrImageData && (!String(qrImageData).startsWith('data:image/') || String(qrImageData).length > 1500000)) return res.status(400).json({ error: 'QR_IMAGE_INVALID' }); store.settings.qris = { enabled: Boolean(enabled), merchantName: String(merchantName || '').slice(0, 120), qrImageData: qrImageData ? String(qrImageData) : store.settings.qris.qrImageData, instructions: String(instructions || '').slice(0, 500) }; audit(req.user.username, 'settings.qris.update', { enabled: store.settings.qris.enabled, hasQr: Boolean(store.settings.qris.qrImageData) }); res.json({ ok: true, qris: publicSettings().qris }); });
app.post('/api/payments', requireAuth, (req, res) => { const { amount, reference } = req.body || {}; const numeric = Number(amount); if (!Number.isInteger(numeric) || numeric <= 0 || numeric > 100000000) return res.status(400).json({ error: 'INVALID_AMOUNT' }); const payment = { id: crypto.randomUUID(), username: req.user.username, amount: numeric, reference: String(reference || '').slice(0, 100), status: 'pending', createdAt: now() }; store.payments.unshift(payment); audit(req.user.username, 'payment.create', { amount: numeric }); res.status(201).json({ payment }); });

app.get('/api/baileys/session', requireOwner, (req, res) => res.json({ ...store.baileys, qrImage: undefined, note: 'Baileys must run in a separate worker with encrypted auth state; this panel exposes status only.' }));
app.post('/api/baileys/session/reset', requireOwner, (req, res) => { store.baileys = { status: 'disconnected', phone: '', lastEventAt: now(), qrAvailable: false }; audit(req.user.username, 'baileys.session.reset'); res.json({ ok: true, status: store.baileys.status }); });

app.get('*', (req, res) => res.sendFile(path.join(ROOT, 'dist', 'index.html')));
app.listen(PORT, '127.0.0.1', () => console.log(`NixFlow local server listening on port ${PORT}`));

# NixFlow Shop Panel MVP — Production hardening

ZIP ini menggantikan panel demo dengan panel owner yang berjalan sebagai aplikasi React + Express lokal. Default owner adalah `marr` dengan password bootstrap `marnull`; password hanya dibaca server saat first run, lalu disimpan sebagai hash `scrypt` di `data/store.json`. Untuk deployment produksi, wajib mengganti `NIXFLOW_SESSION_SECRET`, `OWNER_INITIAL_PASSWORD`, dan memindahkan storage ke database/secret manager.

## Jalankan

```bash
npm install
npm run build
OWNER_USERNAME=marr OWNER_INITIAL_PASSWORD=marnull NIXFLOW_SESSION_SECRET="ganti-dengan-random-64-char" npm start
```

Untuk pengujian lokal dengan frontend dan API sekaligus, gunakan `npm run dev`. Script ini melakukan build lalu menjalankan Express pada port `8787`; `npm run dev:ui` hanya menjalankan Vite dan tidak menyediakan API login.

Tidak ada public registration route pada MVP ini. Owner dibuat otomatis pada first run dari `OWNER_USERNAME` dan `OWNER_INITIAL_PASSWORD`. Log login berhasil/gagal tampil di terminal backend tanpa pernah mencetak password. Audit terstruktur dapat dibaca owner melalui `GET /api/audit` setelah login.

Server hanya bind ke `127.0.0.1` secara default. Frontend tidak mengetahui URL provider, API key, atau port remote; semua request memakai path relatif `/api/*` dengan session cookie `httpOnly`, `sameSite=strict`, dan `secure` saat `NODE_ENV=production`.

## Yang diubah

- Menghapus mock data, akun demo, URL panel Pterodactyl, dan API key hardcoded.
- Menambahkan login owner, rate limit login sederhana, signed session cookie, password hash `scrypt`, logout, dan role guard owner.
- Menambahkan file manager yang dibatasi ke `data/server-files`, mencegah path traversal dan penghapusan root.
- Menambahkan operasi server `start`, `stop`, `restart` dengan allowlist dan audit log. Tidak ada arbitrary shell execution.
- Menambahkan editor startup dengan validasi command dan panjang input.
- Menambahkan pengaturan QRIS yang dapat diubah owner dari web, termasuk upload gambar QR sebagai data URL terbatas ukuran.
- Menambahkan pencatatan payment pending. Integrasi payment gateway realtime belum dipalsukan; provider credentials harus ditambahkan sebelum aktivasi produksi.
- Menambahkan status Baileys dan reset session. Baileys harus berjalan sebagai worker terpisah dengan encrypted auth state; panel hanya mengekspos status, bukan QR/auth material.

## Baileys production notes

Baileys menggunakan WebSocket dan `connection.update`/`creds.update`. Implementasi worker sebaiknya menggunakan `makeWASocket`, menyimpan kredensial melalui storage terenkripsi (bukan folder publik), subscribe ke `connection.update`, dan menjalankan reconnect policy berdasarkan disconnect reason. `useMultiFileAuthState` cocok untuk prototipe tetapi perlu diganti atau dibungkus encrypted persistent storage untuk produksi. Jangan menampilkan QR, credential files, atau pairing secret pada endpoint publik. Gunakan secara patuh pada Terms of Service WhatsApp; hindari spam/bulk messaging.

Referensi: https://baileys.wiki/ dan https://github.com/WhiskeySockets/Baileys

## Hal yang masih membutuhkan konfigurasi provider

Kontrol node remote, console nyata, dan pembayaran realtime memerlukan kredensial provider yang tidak disertakan dalam ZIP. Tambahkan adapter server-side untuk Pterodactyl atau provider lain; jangan menaruh URL/API key di `src/`. QRIS statis dapat dikelola sekarang, sedangkan verifikasi otomatis memerlukan gateway QRIS dan webhook terverifikasi.

## Pterodactyl Client API adapter

Jika environment berikut diisi pada server backend, route internal meneruskan operasi ke Pterodactyl Client API tanpa membocorkan kredensial ke browser:

```bash
PTERODACTYL_URL=https://panel.example.com
PTERODACTYL_CLIENT_API_KEY=ptlc_...
PTERODACTYL_SERVER_IDENTIFIER=server-identifier
```

Mapping endpoint:

| Panel route internal | Pterodactyl Client API |
| --- | --- |
| `POST /api/server/action` | `POST /api/client/servers/{server}/power` dengan `signal: start|stop|restart` |
| `GET /api/server/resources` | `GET /api/client/servers/{server}/resources` |
| `POST /api/server/startup` | `PATCH /api/client/servers/{server}/startup` |
| `GET /api/files?path=/` | `GET /api/client/servers/{server}/files/list-directory?directory=/` |
| `POST /api/files/folder` | `POST /api/client/servers/{server}/files/create-folder` |
| `DELETE /api/files` | `POST /api/client/servers/{server}/files/delete` |

Header provider yang digunakan adalah `Authorization: Bearer ptlc_...`, `Accept: Application/vnd.pterodactyl.v1+json`, dan `Content-Type: application/json`. Jika environment provider belum diisi, file manager memakai sandbox lokal dan power/startup memakai fallback lokal yang aman; tidak ada URL atau secret dummy.

Sumber dokumentasi: [Pterodactyl Client API reference](https://pterodactyl-api-docs.netvpx.com/docs/api/client) dan [Pterodactyl panel routes](https://github.com/pterodactyl/panel/tree/1.0-develop/routes).

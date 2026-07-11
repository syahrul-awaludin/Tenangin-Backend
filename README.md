# Tenangin Backend API 🌿

Ini adalah repositori **Backend Server** (RESTful API) yang digunakan untuk mendukung aplikasi *mobile* **Tenangin**. Backend ini dibangun menggunakan arsitektur modern untuk memastikan performa yang cepat, aman, dan mudah di-*scale*.

Repositori aplikasi Mobile (Frontend/Flutter) dapat diakses di sini: [Tenangin App (Flutter)](https://github.com/syahrul-awaludin/UTS-Mobile-Computing-Tenangin-App)

---

## 💻 Tech Stack & Dependencies

- **Platform/Environment**: Node.js
- **Framework**: Express.js
- **Autentikasi**: JSON Web Token (JWT) + Bcrypt (Password Hashing)
- **Deployment**: Ubuntu VPS Server
- **Process Manager**: PM2

---

## 🏗 Struktur Arsitektur (Layered MVC)

Backend ini disusun menggunakan pendekatan *Layered Architecture* (seperti MVC) agar kode mudah dibaca dan dikelola.

```text
src/
 ├── config/            # Konfigurasi aplikasi (Database, Environment Variables)
 ├── controllers/       # Menangani request & response HTTP (Pintu masuk logika)
 ├── services/          # Tempat beradanya logika bisnis inti (Business Logic Layer)
 ├── repositories/      # Bertanggung jawab berinteraksi langsung dengan Database
 ├── routes/            # Definisi endpoint (URL path) dan mengarahkannya ke Controller
 ├── middleware/        # Penengah request (seperti Cek Token JWT & Otorisasi)
 └── validators/        # Memastikan data (payload) dari user valid sebelum diproses
```

---

## 🛡 Fitur Utama & Keamanan

1. **Authentication & Authorization**:
   - Sistem pendaftaran dan *login* yang aman menggunakan algoritma *hashing* sebelum data masuk ke *database*.
   - Setiap *endpoint* yang bersifat *private* dilindungi oleh **Middleware Authenticate** menggunakan verifikasi *JWT Token*.

2. **Community Posts & Comments**:
   - Mendukung fitur *Create, Read, Update, Delete* (CRUD) untuk memfasilitasi forum komunitas Tenangin.
   - Endpoint khusus untuk memberikan interaksi *Like* pada postingan.

3. **Data Sanitization**:
   - Melindungi aplikasi dari *injection* dengan memfilter data yang masuk pada lapisan *middleware*.

---

## 📡 API Endpoints Reference

Semua *endpoint* memiliki *base URL*: `/api/v1`

### 1. Authentication (`/auth`)
| Method | Endpoint | Keterangan | Auth Required |
|--------|----------|------------|---------------|
| `POST` | `/auth/register` | Mendaftarkan pengguna baru. | ❌ No |
| `POST` | `/auth/login` | Login pengguna dan mengembalikan JWT Token. | ❌ No |
| `POST` | `/auth/refresh` | Mengambil token baru menggunakan *refresh token*. | ❌ No |

### 2. Posts & Community (`/posts`)
| Method | Endpoint | Keterangan | Auth Required |
|--------|----------|------------|---------------|
| `GET`  | `/posts` | Mengambil daftar semua postingan komunitas. | ✅ Yes |
| `POST` | `/posts` | Membuat postingan baru (Body: `subject`, `content`, `mood`). | ✅ Yes |
| `PUT`  | `/posts/:id` | Mengedit postingan (Hanya Author). | ✅ Yes |
| `DELETE`| `/posts/:id` | Menghapus postingan (Hanya Author / Admin). | ✅ Yes |
| `POST` | `/posts/:postId/like` | Memberikan atau membatalkan *like* (Toggle Like). | ✅ Yes |

### 3. Comments
| Method | Endpoint | Keterangan | Auth Required |
|--------|----------|------------|---------------|
| `GET`  | `/posts/:postId/comments` | Mengambil komentar dari suatu postingan. | ✅ Yes |
| `POST` | `/posts/:postId/comments` | Menambahkan komentar ke postingan tertentu. | ✅ Yes |
| `PUT`  | `/posts/comments/:commentId`| Mengedit komentar (Hanya Author). | ✅ Yes |
| `DELETE`| `/posts/comments/:commentId`| Menghapus komentar. | ✅ Yes |

### 4. Notifications (`/notifications`)
| Method | Endpoint | Keterangan | Auth Required |
|--------|----------|------------|---------------|
| `GET`  | `/notifications` | Mendapatkan daftar notifikasi pengguna saat ini. | ✅ Yes |
| `PUT`  | `/notifications/:id/read` | Menandai satu notifikasi sebagai "dibaca". | ✅ Yes |
| `PUT`  | `/notifications/read-all` | Menandai seluruh notifikasi sebagai "dibaca". | ✅ Yes |

---

## 🚀 Instalasi & Menjalankan di Lokal

Jika Anda ingin menjalankan atau mengembangkan backend ini di komputer lokal, ikuti langkah berikut:

### 1. Clone Repository
```bash
git clone https://github.com/syahrul-awaludin/Tenangin-Backend.git
cd Tenangin-Backend
```

### 2. Instalasi Dependencies
Pastikan **Node.js** sudah terinstal, lalu jalankan:
```bash
npm install
```

### 3. Konfigurasi Environment
Buat sebuah file `.env` di *root folder*, lalu sesuaikan variabelnya (contoh):
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=tenangin_db
JWT_SECRET=rahasia_super_aman
```

### 4. Jalankan Server
Untuk keperluan *development* lokal:
```bash
npm run dev
```
*(Server akan berjalan dan bisa diakses di `http://localhost:3000`)*

---

## 🌐 Proses Deployment (VPS)
Di sisi server (Production), aplikasi ini di-*deploy* menggunakan **PM2** untuk menjaga server tetap hidup (auto-restart) jika terjadi *crash*.
```bash
pm2 start src/index.js --name tenangin-backend
pm2 save
```

---
*Dibuat oleh Syahrul Awaludin untuk UAS Mobile Computing 2026*

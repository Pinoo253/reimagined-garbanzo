# ADB Creative Team

Website ADB Creative Team dengan HTML, CSS, JavaScript, Python Flask, dan Supabase.

## Struktur root

File utama berada langsung di root: `index.html`, `style.css`, `main.js`, `admin.html`, `admin.js`, `app.py`, dan `schema.sql`. Tidak menggunakan struktur subfolder bertingkat.

## Menjalankan lokal

1. Install Python 3.10+.
2. Buat virtual environment (opsional): `python -m venv .venv`
3. Aktifkan environment.
4. Install dependency: `pip install -r requirements.txt`
5. Jalankan: `python app.py`
6. Buka `http://127.0.0.1:5000`.

## Menghubungkan Supabase

1. Buka `config.js`.
2. Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` dari Supabase Project Settings > API.
3. Jangan pernah memasukkan `service_role` key ke `config.js`.
4. Buka Supabase Dashboard > SQL Editor.
5. Jalankan seluruh isi `schema.sql`.
6. Jalankan seluruh isi `seed.sql` jika ingin menambahkan kategori awal.
7. Buat user admin melalui Authentication > Users.
8. Salin UUID user tersebut, lalu jalankan SQL berikut di SQL Editor:

```sql
insert into public.admins (user_id)
values ('UUID_USER_ADMIN_DI_SINI')
on conflict do nothing;
```

9. Buka `admin.html`, lalu login memakai email dan password user admin tersebut.

## Database

`schema.sql` membuat tabel `profiles`, `categories`, `activities`, `projects`, `gallery`, `feedback`, `admins`, `team_members`, dan `achievements`, termasuk relasi, index, RLS, policies, serta bucket Storage `media`.

Pengunjung dapat membaca konten publik dan mengirim feedback. Operasi pengelolaan konten hanya bisa dilakukan oleh user yang terdaftar pada tabel `admins`, sesuai RLS.

## Catatan admin

Admin panel menyediakan login Supabase Auth dan operasi dasar tambah, baca, ubah, hapus untuk projects, activities, gallery, dan categories. Feedback dapat dibaca dan dihapus oleh admin. Untuk upload media, unggah file ke bucket `media` melalui Supabase Storage, lalu simpan public URL-nya pada kolom URL terkait.

## Deployment

- Flask dapat dijalankan pada layanan hosting Python yang mendukung Flask (misalnya Render atau Railway).
- GitHub menyimpan source code dan SQL.
- Supabase menjalankan database, auth, dan storage.
- GitHub Pages hanya untuk static frontend, bukan untuk menjalankan Flask.
- Jika deploy Flask, atur environment variables sesuai `.env.example`.

## Status pengujian

Lakukan tes koneksi Supabase, login admin, CRUD, Storage, dan RLS setelah memasukkan credential proyek. Fitur yang membutuhkan credential tidak dapat dinyatakan aktif sebelum diuji pada project Supabase milikmu.

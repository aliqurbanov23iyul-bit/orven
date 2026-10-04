ORVEN v2 — HTML / CSS / Vanilla JavaScript + Vercel API + Neon

Vercel ayarları:
Framework Preset: Other
Build Command: boş
Output Directory: .
Install Command: npm install (standart)

Environment Variables (Production və Preview üçün):
DATABASE_URL — Neon PostgreSQL bağlantı ünvanı, sslmode=require
ADMIN_PASSWORD — admin üçün ən azı 8 simvolluq şifrə
SESSION_SECRET — ən azı 32 simvolluq təsadüfi mətn
Dəyişənləri əlavə etdikdən sonra Redeploy edin.

Admin: /admin.html və ya /admin
Giriş şifrəsi ADMIN_PASSWORD dəyəridir. Şifrə brauzer kodunda saxlanmır.
Şifrəni dəyişmək üçün Vercel-də ADMIN_PASSWORD dəyərini dəyişib Redeploy edin.

Database cədvəlləri ilk API çağırışında avtomatik yaradılır. Mövcud məhsullar silinmir.
Əgər Neon istifadəçisinin CREATE TABLE icazəsi yoxdursa, database/schema.sql faylını Neon SQL Editor-da işlədin.

Məhsullar, qiymətlər, ölçülər, aktiv/gizli statusu, ana fotolar, mətnlər, sosial linklər və animasiya parametrləri admin paneldən idarə olunur.
Saxlama düyməsini basana qədər dəyişikliklər yayımlanmır. Paralel saxlama toqquşmaları aşkarlanır.

assets/css — səliqəli əsas dizayn və admin dizaynı
assets/js — brauzer funksiyaları
assets/images — lokal şəkillər
assets/data/defaults.json — ilk nümunə kolleksiya və ehtiyat görünüş
api/index.js — Vercel server funksiyası
lib/ — giriş, yoxlama, database əməliyyatları
scripts/ — yerli yoxlama və development server
 tests/ — PostgreSQL API testləri

Yerli yoxlama: npm ci, npm test, npm run check
Yerli server: .env faylında real dəyişənləri yazın, npm start
Database olmadan yalnız test rejimi: ORVEN_TEST_DATABASE=1 npm start
Bu rejimin şifrəsi local-test-password; yalnız development serverinə aiddir və production API tərəfindən istifadə olunmur.

İlkin məhsullar və fotolar nümunədir. Instagram və WhatsApp məlumatlarını admin paneldən dəqiqləşdirin.
Foto mənbələri: Anomaly / Unsplash (WWesmHEgXDs), Juan Pablo Lara / Unsplash (wQrWkODs59c), Alexia / Unsplash (6kxMffqGvkg).

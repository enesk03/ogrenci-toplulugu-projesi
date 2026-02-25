# 🎓 Öğrenci Topluluğu Web Projesi

Bu proje, üniversite öğrenci topluluklarının etkinliklerini, üyelerini ve duyurularını paylaşabileceği bir web sitesidir. Ayrıca yöneticilerin siteyi kolayca güncelleyebilmesi için bir **Yönetim Paneli (Admin Panel)** içerir.

## 🌟 Neler Yapılabilir?

* **Etkinlikler:** Yeni etkinlik eklenebilir, silinebilir ve afiş yüklenebilir.
* **Üyeler:** Yönetim kurulu üyeleri fotoğraflarıyla birlikte eklenebilir.
* **Site Yazıları:** Sitedeki "Hakkımızda", "Vizyon" gibi yazılar Admin panelinden güncellenebilir.
* **Admin Girişi:** Sadece şifresi olanlar yönetim paneline girebilir.

---

## ⚙️ Projeyi Bilgisayarında Nasıl Çalıştırırsın?

Projeyi indirdikten sonra çalıştırmak için sırasıyla şu 3 adımı yapman yeterli:

### 1. Adım: Veritabanını Kur (Çok Önemli!)
Projenin ana klasöründe **`database_setup.sql`** adında bir dosya göreceksin. Bu dosya, veritabanını ve içindeki örnek verileri (Admin şifresi, etkinlikler vb.) otomatik kurar.

1.  **SQL Server Management Studio (SSMS)** uygulamasını aç.
2.  `database_setup.sql` dosyasını sürükleyip SSMS içine bırak.
3.  Yukarıdaki **Execute (Çalıştır)** butonuna bas.
4.  *İşlem tamam! Veritabanın hazır.*

### 2. Adım: Backend'i (API) Başlat
1.  `backend` klasörünün içindeki `StudentCommunity.Api.sln` dosyasını Visual Studio ile aç.
2.  `appsettings.json` dosyasını aç ve oradaki `Server=` kısmını kendi bilgisayarının adıyla değiştir (Genellikle `.` veya `localhost` olur).
3.  Yukarıdaki **Yeşil Başlat (Play)** butonuna bas.
4.  Ekranda siyah bir pencere veya Swagger sayfası açıldıysa tamamdır.

### 3. Adım: Frontend'i (Siteyi) Başlat
1.  Bu klasörde boş bir yere sağ tıkla ve Terminal aç.
2.  Şu komutları sırasıyla yaz:

```bash
cd frontend
npm install
npm run dev

Ekranda çıkan http://localhost:5173 linkine tıkla.

Admin Paneline Giriş
Site açılınca en altta (Footer) admin giriş linkini bulabilirsin veya direkt /login sayfasına gidebilirsin.

Kullanıcı Adı: admin

Şifre: 123456
StudyPilot - Öğrenci Paneli
StudyPilot, öğrencilerin ve odaklanmak isteyen bireylerin ders çalışma süreçlerini optimize etmek, görevlerini yönetmek ve çalışma ortamlarını kişiselleştirmek için tasarlanmış modern bir web uygulamasıdır.

StudyPilot; pomodoro sayacı, görev yöneticisi ve müzik entegrasyonu gibi araçlarla verimliliği artırır.


Özellikler:
Bu proje aşağıdaki modülleri içerir:

1. Görev Yöneticisi (Task Manager)
İşlemler: Görev ekleme, düzenleme, silme ve tamamlama.

Kategorilendirme: Ders (Course), Ödev (Assignment) ve Sınav (Exam) türleri.

Önceliklendirme: Yaklaşan teslim tarihine (deadline) göre otomatik sıralama.

İlerleme Takibi: Tamamlanan görevlerin görsel ilerleme çubuğu.


2. Özelleştirilebilir Pomodoro Sayacı
Otomatik Döngü: Çalışma, Kısa Mola ve Uzun Mola döngüleri.

Esnek Süreler: Standart 25 dakika veya kullanıcı tarafından ayarlanabilen odaklanma süreleri.

Oturum Takibi: Günlük tamamlanan odaklanma oturumlarının kaydı.


3. Spotify Entegrasyonu
Müzik Önerileri: Odaklanma için özel çalma listesi önerileri.

Kişisel Kütüphane: Kullanıcının kendi Spotify çalma listelerine erişim.

Dahili Oynatıcı: Site içinden çıkmadan müzik dinleme imkanı.

Not: Spotify Premium veya oturum açma gerektirir.


4. Akıllı Hava Durumu & Çalışma Tavsiyeleri
Konum Bazlı Veri: Kullanıcının konumunu algılayarak anlık hava durumu (Open-Meteo API).

Akıllı Öneriler: Sıcaklık ve hava koşullarına göre (örn. "Yağmurlu hava, evde odaklanmak için harika" veya "Hava çok sıcak, serin bir yer bul") çalışma ortamı tavsiyeleri.


5. Analizler ve İstatistikler
Haftalık Özet: Oluşturulan, tamamlanan ve geciken görevlerin haftalık dökümü.

Odaklanma Grafiği: Toplam odaklanma süresini gösteren dairesel grafik.

Verimlilik Oranı: Görev tamamlama yüzdesi.


6. Kullanıcı Sistemi & Arayüz
Giriş/Kayıt: LocalStorage tabanlı kimlik doğrulama.

Modern UI: Hareketli arkaplan ve modern tasarım.




Kullanılan Teknolojiler:


Frontend: HTML5, CSS3

Dil: JavaScript

Veri Saklama: Tarayıcı Yerel Depolama (LocalStorage)



 API'ler:


Spotify Web API (Müzik verileri için)

Open-Meteo API (Hava durumu verileri için - API Key gerektirmez)



 Proje Yapısı:


StudyPilot/
├── index.html              # Ana Dashboard sayfası
├── login.html              # Giriş/Kayıt sayfası
├── login.js                # Giriş mantığı
├── styles/
│   ├── style.css           # Ana stil dosyası (Dashboard)
│   └── login.css           # Giriş sayfası stili
├── modules/                # Mantık modülleri
│   ├── Analytics.js        # İstatistik hesaplamaları
│   ├── Pomodoro.js         # Sayaç mantığı
│   ├── Prioritizer.js      # Görev sıralama algoritmaları
│   └── TaskManager.js      # Görev veritabanı (LocalStorage) yönetimi
├── components/             # UI bileşenleri
│   ├── DashboardUI.js      # Ana ekranın render edilmesi
│   ├── TaskCard.js         # TaskCard bileşeni
│   └── TimerUI.js          # Sayaç görünümü
├── services/               # Servisler (API)
│   ├── SpotifyService.js   # Spotify Auth ve Data işlemleri
│   └── WeatherService.js   # Hava durumu işlemleri
└── effects/
    └── starfield.js        # Canvas arka plan animasyonu


 Kurulum ve Çalıştırma:

Bu proje herhangi bir backend sunucusu gerektirmez, doğrudan tarayıcıda çalışabilir. Ancak Spotify API entegrasyonunun düzgün çalışması için bir yerel sunucu (Live Server) önerilir.

Projeyi İndirin: Dosyaları bilgisayarınıza kaydedin.

Spotify Yapılandırması (Önemli): services/SpotifyService.js dosyasını açın. Eğer projeyi kendi Spotify Developer hesabınızla kullanacaksanız clientId ve redirectUri alanlarını güncellemeniz gerekir.

static clientId = "SENIN_SPOTIFY_CLIENT_ID";
static redirectUri = "http://127.0.0.1:5500/StudyPilot/index.html"; // Kendi yerel adresin
(Mevcut kodda tanımlı bir yapılandırma bulunmaktadır, test ederken çalışabilir ancak ürün için kendi ID'nizi almalısınız.)

Çalıştırın:

VS Code Kullanıyorsanız: index.html veya login.html dosyasına sağ tıklayıp "Open with Live Server" diyerek başlatın.

Manuel: login.html dosyasına çift tıklayarak tarayıcınızda açın.

URL üzerinden erişim: https://cool-zuccutto-dd7c3c.netlify.app/login.html adresine giderek siteye erişebilirsiniz


 Kullanım:

İlk açılışta bir kullanıcı hesabı oluşturun (Veriler sadece tarayıcınızda saklanır).

Dashboard'a yönlendirileceksiniz.

Spotify'a bağlan butonunu kullanarak müzik özelliklerini aktif edebilirsiniz.

  UML:

<img width="1532" height="951" alt="image" src="https://github.com/user-attachments/assets/5619410f-bc4a-45db-8f6e-d19524bb2b8f" />


 Lisans:

Bu proje açık kaynaklıdır ve eğitim amaçlı geliştirilmiştir. İstediğiniz gibi kullanabilir ve geliştirebilirsiniz.

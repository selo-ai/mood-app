# 📱 Android SDK Kurulum Rehberi

## 🎯 **Amaç**
Expo Go uygulamasını telefonunda test edebilmek için Android SDK kurulumu.

## 📋 **Gereksinimler**
- Windows 10/11
- En az 8GB RAM (önerilen)
- En az 10GB boş disk alanı

---

## 🚀 **Kurulum Yöntemi 1: Android Studio (Önerilen)**

### **1. Android Studio İndir**
- [Android Studio'yu buradan indir](https://developer.android.com/studio)
- "Download Android Studio" butonuna tıkla
- Windows için olan sürümü seç

### **2. Android Studio Kur**
- İndirilen `.exe` dosyasını çalıştır
- **"Android SDK"** seçeneğini işaretle (önemli!)
- Varsayılan konum: `C:\Users\seloy\AppData\Local\Android\Sdk`
- Kurulumu tamamla

### **3. Environment Variables Ayarla**

#### **Windows Environment Variables:**
1. **Windows + R** tuşlarına bas
2. `sysdm.cpl` yaz ve Enter'a bas
3. **Advanced** sekmesine git
4. **Environment Variables** butonuna tıkla
5. **System Variables** bölümünde:

#### **ANDROID_HOME Ekle:**
- **New** butonuna tıkla
- **Variable name:** `ANDROID_HOME`
- **Variable value:** `C:\Users\seloy\AppData\Local\Android\Sdk`

#### **Path'e Ekle:**
- **Path** değişkenini seç ve **Edit** butonuna tıkla
- **New** butonuna tıkla
- `%ANDROID_HOME%\platform-tools` ekle
- **OK** ile kaydet

---

## 🔧 **Kurulum Yöntemi 2: Sadece Command Line Tools**

### **1. Command Line Tools İndir**
- [Android SDK Command Line Tools'u indir](https://developer.android.com/studio#command-tools)
- "Download" butonuna tıkla

### **2. Klasör Yapısı Oluştur**
```
C:\Users\seloy\AppData\Local\Android\Sdk\
├── cmdline-tools\
│   └── latest\
│       ├── bin\
│       ├── lib\
│       └── source.properties
└── platform-tools\
```

### **3. Environment Variables Ayarla**
(Yukarıdaki gibi aynı adımları takip et)

---

## ✅ **Test Etme**

### **1. Yeni Terminal Aç**
- Mevcut terminal'i kapat
- Yeni PowerShell aç
- Environment variables'ın yüklenmesi için

### **2. Test Komutları**
```powershell
# Android SDK versiyonunu kontrol et
adb version

# Bağlı cihazları listele
adb devices

# ANDROID_HOME'u kontrol et
echo $env:ANDROID_HOME
```

### **3. Beklenen Çıktı**
```
Android Debug Bridge version 1.0.xx
Version x.xx.x-xxxxxx
Installed as C:\Users\seloy\AppData\Local\Android\Sdk\platform-tools\adb.exe
```

---

## 📱 **Telefon Ayarları**

### **1. Developer Options Aç**
1. **Ayarlar** > **Telefon Hakkında**
2. **Build Number**'a 7 kez tıkla
3. "Developer options enabled" mesajını gör

### **2. USB Debugging Aç**
1. **Ayarlar** > **Geliştirici Seçenekleri**
2. **USB Debugging**'i aç
3. **USB Debugging (Security Settings)**'i aç

### **3. Telefonu Bağla**
1. USB kablosu ile telefonu bilgisayara bağla
2. Telefonda "USB Debugging" izni ver
3. `adb devices` komutu ile telefonu gör

---

## 🎯 **Expo Go Test**

### **1. Expo Go İndir**
- Google Play Store'dan **Expo Go** uygulamasını indir

### **2. Projeyi Başlat**
```powershell
cd C:\Users\seloy\Projects\my-mood\my-mood-app
npm start
```

### **3. QR Kodu Tara**
- Expo Go uygulamasını aç
- QR kodu tara
- Uygulama telefonunda açılacak

---

## ❌ **Olası Sorunlar ve Çözümler**

### **1. "adb is not recognized"**
- Environment variables'ı kontrol et
- Terminal'i yeniden başlat
- ANDROID_HOME path'ini kontrol et

### **2. "Failed to resolve the Android SDK path"**
- ANDROID_HOME doğru ayarlanmış mı?
- Path'e platform-tools eklendi mi?

### **3. Telefon Bağlanmıyor**
- USB Debugging açık mı?
- Farklı USB kablosu dene
- Telefonu yeniden başlat

### **4. Expo Go QR Kod Çalışmıyor**
- Aynı WiFi ağında mısın?
- Firewall ayarlarını kontrol et
- `expo start --tunnel` komutunu dene

---

## 📞 **Yardım**

Eğer sorun yaşarsan:
1. Bu dosyayı tekrar oku
2. Environment variables'ı kontrol et
3. Terminal'i yeniden başlat
4. Android Studio'yu yeniden kur

**Not:** Kurulum tamamlandıktan sonra `npm start` ile projeyi başlat ve QR kodu telefonunda test et! 
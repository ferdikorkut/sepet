# Sepet — Görsel Yeniden Tasarım (Redesign) Spec

**Tarih:** 2026-07-29
**Durum:** Onaylandı, uygulama planı bekleniyor

## Amaç

Mevcut Sepet uygulamasının (5 sayfa, Context API + useReducer + Local Storage) **mantığını değiştirmeden** görsel katmanını yeniler. Kaynak tasarım, kullanıcının [stitch.withgoogle.com](https://stitch.withgoogle.com) ile ürettiği ve `design-reference/` klasörüne yüklediği mockup'lardan (5 ekran + `DESIGN.md` design system) türetilmiştir.

**Kapsam dışı bırakılan Stitch özellikleri:** arama çubuğu, kategori filtresi/fiyat aralığı, ürün puanları/yorumları, sayfalama, kupon kodu, kargo tahmini/ücreti, sipariş takip/teslimat tarihi, haber bülteni aboneliği, mobil alt navigasyon, sosyal paylaşım butonları. Bunlar spec'in "Kapsam Dışı" bölümüyle çelişir ve backend veya karmaşık state gerektirir — eklenmeyecek.

**Kapsama dahil edilen 3 basit ekstra özellik** (kullanıcı onayıyla):
1. Ürün rozetleri (statik "Yeni" / "İndirim" etiketleri)
2. Ana sayfa hero'sunda statik bir duyuru etiketi
3. Sipariş Tamamlandı sayfasında client-side üretilen kozmetik bir sipariş numarası

## Tasarım Token'ları

### Renkler (CSS custom properties, `:root` içinde)

```css
--color-primary: #ab3500;            /* logo, aktif nav linki, fiyat metni */
--color-primary-container: #ff6b35;  /* birincil buton arka planı, "Yeni" rozeti */
--color-on-primary: #ffffff;         /* birincil buton üzerindeki metin */
--color-secondary: #6b46c1;          /* "İndirim" rozeti, ikincil aksan */
--color-on-secondary: #ffffff;
--color-background: #f9f9ff;         /* sayfa arka planı */
--color-surface: #ffffff;            /* kart/panel arka planı */
--color-surface-alt: #eef1fc;        /* sepet özeti kutusu, footer, hover zemin */
--color-on-surface: #121c2c;         /* ana metin */
--color-on-surface-variant: #5b5f6b; /* ikincil/açıklama metni (Stitch'in kahverengimsi tonu yerine, mavi-gri arka planla daha tutarlı nötr bir gri kullanılıyor — bilinçli bir sadeleştirme) */
--color-border: #e3e6f0;             /* kart/input kenarlıkları */
--color-error: #ba1a1a;              /* "Sil" linki, hata durumları */
```

### Tipografi

- **Başlıklar (h1/h2/h3) ve fiyatlar:** `Plus Jakarta Sans`, self-hosted via `@fontsource/plus-jakarta-sans` (700/800 ağırlıkları) — Inter'de olduğu gibi Google Fonts CDN'den **çekilmeyecek**.
- **Gövde metni, butonlar, etiketler:** mevcut `Inter` (400/600/700, zaten self-hosted).
- Hero başlığı ~40px/800, sayfa başlıkları (h1) ~32px/700, kart başlıkları ~16px/600, fiyat ~20px/800.

### Şekil & Gölge

- Kartlar: `border-radius: 14px`
- Butonlar/input'lar: `border-radius: 10px`
- Rozet/pill'ler: `border-radius: 999px`
- Kart gölgesi: `0 4px 20px rgba(18, 28, 44, 0.06)`; hover'da hafif derinleşir ve kart 2px yukarı kalkar (`transform: translateY(-2px)`, `transition`).

### İkonlar

Stitch'in kullandığı "Material Symbols" Google Font'tan self-host kuralımıza aykırı olduğu için **kullanılmayacak**. Yerine, ihtiyaç duyulan yerlerde (Header'daki sepet ikonu, Sipariş Tamamlandı'daki onay işareti, 404'teki sepet/basket ikonu) elle yazılmış, projeye gömülü **inline SVG** kullanılacak — harici istek yok.

## Sayfa Bazında Değişiklikler

### Header
Logo `--color-primary` renginde ve `Plus Jakarta Sans`. Aktif `NavLink` alt çizgili + `--color-primary`. Sağda küçük bir inline SVG sepet ikonu + yanında/üzerinde rozet (`--color-primary-container` arka plan, beyaz metin) — mevcut `totalItems > 0` koşulu aynı kalır.

### Ana Sayfa (Home)
Hero bölümünün üstünde küçük bir statik etiket/pill: "Yeni Ürünler Geldi" (arka plan `--color-primary-container` %10 opaklık, metin `--color-primary`). Başlık + açıklama aynı kalır, tek bir birincil buton ("Ürünleri Gör" → `/urunler`). Stitch'teki ikincil "Daha Fazla Bilgi" butonu **eklenmiyor** — gidecek bir içeriği olmayan işlevsiz bir buton olurdu. "Öne Çıkan Ürünler" başlığının altında ince bir vurgu çizgisi (`--color-primary-container`, 4px yükseklik, 64px genişlik, tam yuvarlak).

### ProductCard (Ürünler + Ana Sayfa'da ortak)
Yeni kart stiline geçer (14px radius, ince kenarlık, hover'da hafif yükselme). Ürünün `badge` alanı varsa (`'Yeni'` veya `'İndirim'`), kartın sağ üst köşesinde küçük bir pill olarak gösterilir — `'Yeni'` için `--color-primary-container` arka plan, `'İndirim'` için `--color-secondary` arka plan, ikisinde de beyaz metin. Fiyat `Plus Jakarta Sans`, `--color-primary` renginde ve kalın. "Sepete Ekle" butonu birincil buton stiliyle aynı kalır.

### Ürünler (Products)
Sayfa başlığı + kısa bir açıklama cümlesi eklenir ("Özenle seçilmiş ürünleri keşfedin." gibi). Grid, yeni `ProductCard` stiliyle aynı kalır. Filtre/arama/sayfalama **yok**.

### Sepet (Cart)
Masaüstünde iki sütunlu bir düzen: solda `CartItem` listesi (yeni kart stiliyle), sağda sabit genişlikte bir "Sipariş Özeti" kutusu (`--color-surface-alt` arka plan, 14px radius) — içinde "Ara Toplam: {totalPrice}" ve altında ayraçla ayrılmış "Genel Toplam: {totalPrice}" (aynı değer; kargo/kupon yok, bu yüzden ikisi eşit — bu bilinçli bir tasarım kararı, spec'te not edilir), altında birincil "Siparişi Tamamla" butonu, ikincil "Sepeti Temizle" ve "Alışverişe Devam Et" butonları. Mobilde (≤768px) sütunlar alt alta dizilir. Boş sepet durumu aynı mantıkla kalır, sadece yeni buton/tipografi stiliyle.

### Sipariş Tamamlandı (OrderComplete)
Ortada büyük, `--color-primary-container` renginde dairesel bir onay ikonu (inline SVG checkmark, arka planında yumuşak bir daire). Başlık + mesaj aynı kalır. Altında, `--color-surface-alt` arka planlı küçük bir kutu içinde "Sipariş Numarası: #SPT-XXXXXX" — numara, sayfa yüklendiğinde `useState`'in lazy initializer'ıyla client-side üretilir (6 haneli rastgele sayı), **kalıcı değildir ve gerçek bir sipariş takip sistemini temsil etmez** — sadece deneyimsel bir dokunuş. Altında birincil "Ana Sayfaya Dön" ve ikincil "Alışverişe Devam Et" butonları.

### 404 (NotFound)
Ortada küçük bir inline SVG sepet/basket ikonu (`--color-primary-container` çizgi rengi). Altında büyük "404" (`Plus Jakarta Sans`, `--color-primary`), mevcut mesaj, birincil "Ana Sayfaya Dön" butonu.

### Footer
`--color-surface-alt` arka plan, üstte ince bir kenarlık. İçerik aynı kalır (telif metni), sadece yeni renk/tipografiye uyarlanır.

## Veri Modeli Değişikliği

`src/data/products.js`'teki her ürüne opsiyonel bir `badge` alanı eklenir: `'Yeni' | 'İndirim' | undefined`. 8 üründen 2 tanesine `'Yeni'`, 1 tanesine `'İndirim'` atanır (kalanlarında rozet yok); atama tamamen kozmetik bir tercih, hangi ürünlere atandığı fonksiyonel bir anlam taşımaz.

`CartContext`'in reducer'ı ve action'ları **değişmez** — `badge` alanı, `category` gibi zaten sepete kopyalanan ekstra bir alan olarak sepette de görünür, bu zararsızdır (mevcut `category` alanıyla aynı durum).

## Bağımlılık Değişikliği

`package.json`'a `@fontsource/plus-jakarta-sans` eklenir (aynı `@fontsource/inter` deseniyle, 700 ve 800 ağırlıkları).

## Kapsam Dışı (Redesign için)

- Arama, kategori filtresi, fiyat aralığı, sayfalama
- Ürün puanı/yorumu
- Kupon kodu, kargo ücreti/tahmini
- Gerçek sipariş takibi/teslimat tarihi (sadece kozmetik sipariş numarası var)
- Haber bülteni aboneliği
- Mobil alt navigasyon çubuğu (mevcut üst header responsive kalır)
- Karanlık mod (dark mode) — Stitch çıktısı `light` class'ı kullanıyor, biz de sadece açık tema uygularız

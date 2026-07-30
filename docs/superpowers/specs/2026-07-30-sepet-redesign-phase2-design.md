# Sepet — Redesign Phase 2: Hero Rework + Restored Features

**Tarih:** 2026-07-30
**Durum:** Onaylandı, uygulama planı bekleniyor

## Amaç

İlk redesign turunda (2026-07-29) Home hero'yu ve bazı Stitch mockup özelliklerini bilinçli olarak sadeleştirmiştik. Kullanıcı, orijinal Stitch tasarımıyla karşılaştırınca hero'nun ve dört ek özelliğin (arama, puanlar, bülten, mobil nav) daha yakın/geri istendiğini belirtti. Bu spec, o farkı kapatır. Önceki spec'lerin (2026-07-28 ve 2026-07-29) geri kalan tüm kararları (CartContext/routing/localStorage değişmez, backend yok, gerçek arama/puan/bülten/mobil nav'ın nasıl "sahte veri olmadan" yapılacağı) geçerliliğini korur.

## Kapsam

1. **Hero yeniden yapımı:** İki sütunlu düzen (metin + dekoratif görsel), gradient arka plan, ikincil buton artık gerçek işlevli (sayfa içi kaydırma), "Tümünü Gör" linki.
2. **Arama:** Header'da gerçek, client-side çalışan arama — backend yok, `products` dizisini isme göre filtreler.
3. **Ürün puanı/yorumu:** Statik veri, rozetler gibi `products.js`'e eklenir.
4. **Bülten kutusu:** Tamamen dekoratif/deneyimsel — gerçek bir e-posta toplama sistemi yok, sahte bir "Teşekkürler!" mesajı gösterir.
5. **Mobil alt navigasyon:** Küçük ekranlarda sabit alt navigasyon çubuğu; masaüstü header'daki nav linkleri ve arama kutusu mobilde gizlenir (Stitch mockup'ındaki `hidden md:flex` deseniyle aynı mantık).

## Tasarım Kararları

### Hero (`src/pages/Home.jsx`)

- İki sütun: sol tarafta mevcut metin içeriği (`.hero-tag`, `h1`, `p`, iki buton), sağ tarafta `.hero-visual` — gerçek ürün fotoğrafı olmadığı için, uygulamanın zaten kullandığı emoji diline uygun bir **dekoratif kolaj**: büyük bir 🛍️ emoji'si yumuşak gradient bir kart içinde, köşelerinde küçük 🎧/⌚ emoji rozetleri (ürün kartlarındaki emoji kullanımıyla tutarlı, sahte fotoğraf iddiası yok).
- İkincil buton ("Daha Fazla Bilgi") artık **gerçek işlevli**: aynı sayfadaki "Öne Çıkan Ürünler" bölümüne düz bir `#anchor` linkiyle kaydırır (`scroll-behavior: smooth`). Uydurma bir hedef sayfa yok.
- "Öne Çıkan Ürünler" başlığının yanına, `/urunler`'e giden bir **"Tümünü Gör"** linki eklenir.
- Mobilde (≤768px) hero tek sütuna döner, metin ortalanır.

### Arama (`Header.jsx` + `Products.jsx`)

- Header'a bir arama formu eklenir (`SearchIcon` + text input). Enter'a basılınca (form submit), `/urunler?q=<değer>`'e yönlendirir.
- `Products.jsx`, `useSearchParams` ile `q` parametresini okur, `products` dizisini `name.toLowerCase().includes(query.toLowerCase())` ile filtreler.
- Aktif bir arama varsa, sonuç sayısı ve "Aramayı temizle" linki gösterilir (`/urunler`'e döner).
- Sonuç 0 ise, boş bir grid yerine "Aramanızla eşleşen ürün bulunamadı." mesajı gösterilir.
- Header'daki arama kutusunun değeri, `/urunler` rotasındayken URL'deki `q` ile senkronize olur (başka bir sayfadayken boş görünür).
- Bu **gerçek** bir özellik — sahte/dekoratif değil, backend gerektirmeyen saf client-side filtreleme.

### Ürün Puanı (`data/products.js` + `ProductCard.jsx`)

- Her 8 ürüne statik `rating` (ör. `4.8`) ve `reviewCount` (ör. `124`) alanı eklenir — rozetlerle aynı desen (sabit, kozmetik veri).
- `ProductCard`'da isim ile fiyat arasına `★ {rating} ({reviewCount})` satırı eklenir (dolu bir yıldız ikonu + metin).

### Bülten Kutusu (`src/components/Newsletter.jsx`, yeni)

- Home sayfasına, öne çıkan ürünlerin altına yeni bir bölüm eklenir: başlık + açıklama + e-posta input + "Abone Ol" butonu.
- Form submit edilince **hiçbir yere veri gönderilmez** — sadece yerel bir `subscribed` state'i `true` olur ve formun yerine "Teşekkürler! Fırsatlardan haberdar olacaksınız." mesajı gösterilir. Sayfa yenilenince state sıfırlanır (kalıcılık yok, kasıtlı olarak).

### Mobil Alt Navigasyon (`src/components/MobileNav.jsx`, yeni)

- Sadece ≤640px genişlikte görünen, sabit (fixed) alt navigasyon: Ana Sayfa / Ürünler / Sepet (ikon + kısa etiket), Sepet öğesinde mevcut sepet rozeti.
- Aynı breakpoint'te, üst header'ın nav linkleri ve arama kutusu gizlenir (yalnızca logo kalır) — çakışan/tekrarlı navigasyon olmaz.
- `.page-content`'e mobilde alt boşluk eklenir ki içerik sabit çubuğun altında kalmasın.

## Veri Modeli Değişikliği

`src/data/products.js`'teki her ürüne `rating: number` ve `reviewCount: number` eklenir. `CartContext` değişmez — bu alanlar da `badge`/`category` gibi sepete kopyalanır, zararsızdır.

## Yeni Bağımlılık Yok

Tüm yeni özellikler mevcut `react-router-dom` (`useSearchParams`, `useNavigate`, `useLocation`) ve React'in kendi `useState`'i ile yapılır. Yeni npm paketi gerekmez.

## Kapsam Dışı (hâlâ geçerli)

- Gerçek e-posta toplama/backend entegrasyonu (bülten sadece dekoratif)
- Gerçek kullanıcı yorumları (puan/yorum sayısı sabit, kullanıcı girişi yok)
- Kategori filtresi, fiyat aralığı, sayfalama (Stitch'in "Filtrele" kenar çubuğu hâlâ kapsam dışı)
- Gerçek sipariş takibi (Task 8'deki kozmetik sipariş numarası aynen kalır)

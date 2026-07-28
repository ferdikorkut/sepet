# Sepet — Context API Sepet Uygulaması Tasarımı

**Tarih:** 2026-07-28
**Durum:** Onaylandı, uygulama planı bekleniyor

## Amaç

React Context API + Local Storage kullanarak öğretici, modern bir sepet (shopping cart) uygulaması geliştirmek. Odak noktası; global state yönetimi (useReducer + Context), custom hook pattern'i ve tarayıcı kalıcılığıdır (Local Storage). Backend/ödeme entegrasyonu yoktur.

## Teknoloji Yığını

- **Araç:** Vite + React (JavaScript/JSX, TypeScript değil)
- **Routing:** React Router
- **State yönetimi:** `useReducer` + Context API (`CartContext`)
- **Kalıcılık:** Local Storage (anahtar: `sepet-cart`)
- **Ürün verisi:** Proje içinde sabit `src/data/products.js` dosyası (mock veri, dış API yok)
- **Stil:** Sade CSS — global `index.css`, gerekirse bileşen/sayfa bazlı ek CSS dosyaları. CSS Modules veya Tailwind kullanılmayacak.
- **Font:** Inter, self-hosted (bkz. "Fontlar" bölümü) — Google Fonts CDN üzerinden **çekilmeyecek**.

## Fontlar (Self-Hosted)

Almanya'da geçerli veri koruma kuralları gereği, Google Fonts'a tarayıcıdan doğrudan CDN üzerinden istek atmak (kullanıcının IP adresini Google'a iletmek anlamına geldiği için) hukuki risk taşıyor. Bu nedenle proje **hiçbir harici font CDN'ine istek atmayacak**; seçilen font dosyaları projeye gömülü (self-hosted) olarak servis edilecek.

- **Seçilen font:** Inter (görsel karşılaştırma sonrası onaylandı)
- **Ağırlıklar:** 400 (normal), 600 (semi-bold), 700 (bold) — `.woff2` formatında
- **Kaynak:** `@fontsource/inter` npm paketi — Inter'in resmi woff2 dosyalarını (OFL lisanslı) npm registry üzerinden proje bağımlılığı olarak sağlar. Dosyalar `node_modules` içinde bulunur ve build'e dahil edilir; build veya çalışma zamanında Google sunucularına hiçbir istek yapılmaz.
- **Kullanım:** `index.css` içinde `@fontsource/inter/400.css`, `@fontsource/inter/600.css`, `@fontsource/inter/700.css` import edilir, `body`'ye `font-family: 'Inter', system-ui, sans-serif;` olarak uygulanır (yükleme başarısız/gecikirse sistem fontuna düşer)

## Sayfalar & Routing

React Router ile 5 route:

| Path | Sayfa | Açıklama |
|---|---|---|
| `/` | Home | Hero bölümü + öne çıkan ilk 3-4 ürün (vitrin) |
| `/urunler` | Products | Tüm ürünlerin grid halinde listesi, filtre/arama yok |
| `/sepet` | Cart | Sepet içeriği, adet artır/azalt, ürün sil, toplam, sepeti temizle, siparişi tamamla, alışverişe devam et |
| `/siparis-tamamlandi` | OrderComplete | "Siparişi Tamamla" sonrası teşekkür sayfası; sepeti temizler |
| `*` (eşleşmeyen yol) | NotFound | 404 — sadece "sayfa bulunamadı" + ana sayfaya dönüş linki (genel Error Boundary kapsam dışı) |

**Layout:** `App` içinde tüm route'lar ortak bir `Layout` bileşeni altında, React Router'ın `<Outlet />` mekanizmasıyla render edilir:

```
Layout
├── Header (logo, nav linkleri, sepet ikonu + adet rozeti)
├── <Outlet />
└── Footer (statik bilgi/telif metni)
```

## Klasör Yapısı

```
sepet/
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # Router tanımları
│   ├── index.css                # Global stiller
│   ├── data/
│   │   └── products.js          # Sabit ürün listesi
│   ├── context/
│   │   └── CartContext.jsx      # CartProvider + reducer + localStorage senkronizasyonu
│   ├── hooks/
│   │   └── useCart.js           # useContext(CartContext) sarmalayan custom hook
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── ProductCard.jsx
│   │   └── CartItem.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Products.jsx
│       ├── Cart.jsx
│       ├── OrderComplete.jsx
│       └── NotFound.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Veri Modelleri

**Ürün (`data/products.js`):**
```js
{ id, name, price, image, category }
```

**Sepetteki ürün (CartContext state elemanı):**
```js
{ id, name, price, image, quantity }
```

## CartContext Tasarımı

**State:** Sepetteki ürünlerin dizisi (`cart`).

**Reducer action'ları:**

| Action | Davranış |
|---|---|
| `ADD_ITEM` | Ürün sepette yoksa `quantity: 1` ile ekler; varsa mevcut ürünün `quantity`'sini 1 artırır |
| `REMOVE_ITEM` | Ürünü id'sine göre sepetten tamamen çıkarır |
| `INCREASE_QUANTITY` | Belirtilen ürünün adedini 1 artırır |
| `DECREASE_QUANTITY` | Belirtilen ürünün adedini 1 azaltır; adet 0'a inerse ürün sepetten kaldırılır |
| `CLEAR_CART` | Sepeti tamamen boşaltır ("Sepeti Temizle" butonu ve sipariş tamamlama akışı tarafından kullanılır) |
| `LOAD_CART` | Uygulama ilk yüklendiğinde Local Storage'dan okunan sepeti state'e yükler |

**CartProvider akışı:**
1. `useReducer(cartReducer, [], getInitialCart)` — üçüncü argüman olan `getInitialCart` lazy initializer'ı, `sepet-cart` anahtarını Local Storage'dan senkron biçimde okuyup `JSON.parse` eder (try/catch ile sarmalı, ayrıca parse edilen değer dizi değilse `[]`'e düşen bir `Array.isArray` kontrolüyle korumalı) ve sonucu doğrudan başlangıç state'i olarak kullanır. Ayrı bir "yükleme" effect'i yoktur.
2. `cart` her değiştiğinde tek bir `useEffect` (`[cart]` bağımlılığıyla), güncel sepeti `JSON.stringify` ile `sepet-cart` anahtarına yazar.
3. Context value: `{ cart, dispatch, totalItems, totalPrice }`. `totalItems` ve `totalPrice`, ayrı state olarak tutulmadan her render'da `cart` dizisinden türetilir.

> **Not:** İlk tasarımda mount effect'i ile ayrı bir `LOAD_CART` dispatch'i planlanmıştı, ancak bu yaklaşım React 18 StrictMode'un geliştirme modunda effect'leri iki kez çalıştırmasıyla yarışa (race condition) giriyordu: yazma effect'i, yükleme effect'inin dispatch'i işlemesinden önce başlangıçtaki boş `[]` state'ini Local Storage'a yazabiliyor, StrictMode'un ikinci çalıştırması da bu bozulmuş değeri geri okuyunca kalıcı sepet her sayfa yenilemesinde kayboluyordu. Lazy initializer bu sorunu ortadan kaldırır çünkü yüklenen değer doğrudan ilk render state'i olur; effect sıralamasına bağlı bir yarış durumu oluşmaz.

**`useCart` custom hook'u:** `CartContext`'i tüketmek için `useContext(CartContext)` sarmalar; Provider dışında çağrılırsa açıklayıcı bir hata fırlatır.

## Bileşenler

- **Header:** Logo/proje adı, nav linkleri (Ana Sayfa / Ürünler / Sepet), sepet ikonu üzerinde `totalItems` gösteren rozet. `useCart` kullanır.
- **Footer:** Statik telif/bilgi metni.
- **Layout:** Header + `<Outlet />` + Footer sarmalayıcısı.
- **ProductCard:** Görsel, isim, fiyat + "Sepete Ekle" butonu (`ADD_ITEM` dispatch eder). Home ve Products sayfalarında kullanılır.
- **CartItem:** Görsel, isim, birim fiyat, adet +/- butonları, satır toplamı, "Sil" butonu.

## Sayfa Detayları

- **Home:** Hero (başlık + kısa açıklama + "Ürünleri Gör" butonu) + `products.js`'ten ilk 3-4 ürünün `ProductCard` ile vitrini.
- **Products:** Tüm ürünler `ProductCard` grid'i, filtre/arama yok.
- **Cart:** Sepet boşsa "Sepetiniz boş" mesajı + "Alışverişe Devam Et" linki. Doluysa `CartItem` listesi + genel toplam + "Sepeti Temizle" / "Alışverişe Devam Et" / "Siparişi Tamamla" butonları. "Siparişi Tamamla" → `CLEAR_CART` dispatch edilir ve `/siparis-tamamlandi`'ye yönlendirilir.
- **OrderComplete:** "Siparişiniz alındı, teşekkürler!" mesajı + ana sayfaya/ürünlere dönüş linki.
- **NotFound:** "404 - Sayfa bulunamadı" mesajı + ana sayfaya dönüş linki.

## Kapsam Dışı

- Kullanıcı girişi/hesap yönetimi
- Gerçek ödeme/backend entegrasyonu
- Ürün detay sayfası (ayrı route)
- Kategori filtresi / arama
- Genel React Error Boundary (sadece 404 route'u var)
- Otomatik test suite (proje öğretici amaçlı, manuel test ile doğrulanacak)

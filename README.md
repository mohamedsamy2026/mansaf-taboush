# منسف طبوش — Mansaf Taboush (React + Vite + Tailwind)

Interactive, bilingual (AR default / EN), delivery-only ordering site with WhatsApp checkout.

## Run
```bash
npm install
npm run dev      # development
npm run build    # production build -> dist/
npm run preview
```
SPA rewrites are included (`vercel.json`, `public/_redirects` for Netlify/Cloudflare).

## Configure (everything is centralized)
| File | What |
|---|---|
| `src/config/restaurant.js` | WhatsApp number, phone, currency, delivery fee (`null` = confirmed on WhatsApp), social handle + **verified** social URLs |
| `src/data/products.js` | Categories, products, sizes, prices, images |
| `src/i18n/translations.js` | All Arabic / English text |

## MUST be replaced before launch (demo data)
- All product names, descriptions, sizes and **prices are samples**, not confirmed offerings.
- Product images: every product reuses one crop of the supplied reference (`public/images/products/mansaf-plate.jpg`) because the ZIP has no photo catalog. Replace per product in `products.js`.
- Social links are `null` → icons show as inactive. Add verified URLs in `restaurant.js`.
- No address or opening hours were supplied, so none are shown.
- Delivery fee is not configured; messages say it will be confirmed by the restaurant.

## Assets
- `public/images/brand/logo.jpeg`, `reference.jpeg`: untouched originals.
- `logo-transparent.png`: derived from the logo (black JPEG background removed) for use on colored backgrounds.
- `mansaf-plate.jpg`: crop of the plate from the reference.

## Behavior notes
- WhatsApp opens via `wa.me` with a prefilled message; the customer presses Send. The app never claims the order was sent or confirmed, and the cart is not cleared.
- Cart persists in localStorage; size variants are separate lines (`productId|sizeId`).

## Known visual limitations
The reference is a flattened image, so castle/palm silhouettes, ornaments and the patterned borders are simplified SVG/CSS recreations, not exact copies. Fonts load from Google Fonts (Lalezar, Cairo); Lalezar approximates, but does not match, the reference's display lettering.

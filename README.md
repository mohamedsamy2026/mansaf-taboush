# منسف طبوش | Mansaf Taboush

Responsive bilingual (Arabic/English) React + Vite ordering website with WhatsApp checkout. Based on the original restaurant ZIP design and logo.

## Run locally

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuration

- `src/config/restaurant.js`: WhatsApp number (201115083459), currency, delivery configuration and unverified social URLs.
- `src/data/products.js`: **All products, descriptions, sizes and prices are DEMONSTRATION data.** Replace with the official menu before launch.
- `src/i18n/translations.js`: localized content.
- `public/images/brand/logo.jpeg`: original supplied logo.
- `public/images/brand/reference.jpeg`: complete original reference, kept as supplied.
- `public/images/brand/hero-food.webp` and `hero-landscape.webp`: crops of original promotional art. No independent product photo catalog was supplied; product cards temporarily reuse logo artwork, not separate food photos.

## Important behavior

- Delivery only, not dine-in or pickup.
- Customer details and cart stay in browser/local state; no backend or payment gateway.
- Checkout opens a prefilled WhatsApp chat. **The order is not placed or confirmed until the customer sends the message and the restaurant replies.**
- Cart is not cleared when WhatsApp opens.
- Delivery costs and time must be confirmed with the restaurant.
- Demo prices are not a claim about actual restaurant pricing.
- Unverified social media URLs are not linked.

## Deployment

Deploy the `dist/` output to Vercel/Netlify/another SPA-capable host. Configure fallback rewrites to `index.html` for `/menu`, `/cart` and `/checkout` (see `vercel.json` and `public/_redirects`).

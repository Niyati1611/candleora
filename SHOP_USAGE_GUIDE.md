# Shop Feature Quick Start Guide

## Installation & Setup

Your React Shop is already set up! Just run:

```bash
npm run dev
```

This starts the development server. The app will be available at `http://localhost:5173` (or 5174 if 5173 is in use).

---

## Navigation Guide

### Home Page
- **URL**: `/`
- **Content**: Hero section, featured products, special offers
- **Access**: Click "Home" in header or default page

### Shop Page
- **URL**: `/shop`
- **Content**: Full product listing with filters and search
- **Features**:
  - Search bar (top)
  - Filters sidebar (left)
    - Candle Type (jar, pillar, votive, etc.)
    - Size (small, medium, large)
    - Fragrance (lavender, vanilla, rose, etc.)
    - Price Range slider
    - Reset Filters button
  - Products grid (center/right)
  - Add to Cart buttons
  - View Details buttons

### Product Detail Page
- **URL**: `/product/:id` (e.g., `/product/1`)
- **Content**: Complete product information
- **Features**:
  - Large product image
  - Product title and rating
  - Full description
  - Specifications table
  - Dimensions and weight
  - Ingredients list
  - Quantity selector
  - Add to Cart & Buy Now buttons
  - Related products section
  - Breadcrumb navigation

---

## How to Use Each Feature

### 🔍 Search Products

1. Go to `/shop`
2. Type in the search bar at the top
3. Search by:
   - Product name (e.g., "Lavender")
   - Fragrance type (e.g., "vanilla")
4. Results update instantly
5. Shows count of matching products

**Example Searches:**
- "Lavender" → finds Lavender Dreams
- "vanilla" → finds Vanilla Bliss
- "rose" → finds Rose Garden
- "large" → finds all large candles

---

### 🎯 Filter Products

1. Go to `/shop`
2. Use filters sidebar on the left:

**By Type:**
- Select: Jar, Pillar, Votive, Tea Light, Decorative

**By Size:**
- Select: Small, Medium, Large

**By Fragrance:**
- Select: Lavender, Vanilla, Rose, Ocean, Unscented, Cinnamon, Peppermint

**By Price:**
- Drag slider to set max price ($0-$100)

3. Multiple filters work together (e.g., find large scented jars under $50)
4. Click **"Reset Filters"** to clear everything

**Example Filtering:**
- Type: Jar + Fragrance: Vanilla + Price: Under $50 = Vanilla Bliss
- Type: Votive + Size: Small = Ocean Breeze & Peppermint Festive
- Price: Under $20 = 4 products

---

### 📱 View Product Details

**Method 1: From Shop**
1. Go to `/shop`
2. Click **"View Details"** button on any product
3. Or hover over product and click on overlay button

**Method 2: Direct URL**
- Candle 1 (Lavender): `/product/1`
- Candle 2 (Vanilla): `/product/2`
- Candle 3 (Rose): `/product/3`
- ... up to `/product/8`

**On Product Page:**
- See full product description
- View all specifications
- Check dimensions and weight
- Read ingredients
- View related candles
- Select quantity and add to cart
- Use breadcrumb to navigate back

---

### 🛒 Shopping Actions

**Add to Cart:**
1. From shop: Click "🛒 Add to Cart" button on product card
2. From detail page: Select quantity, click "🛒 Add to Cart"
3. Confirmation message appears

**Buy Now:**
1. Go to product detail page
2. Select quantity
3. Click "Buy Now" button
4. Proceeds to checkout (ready for implementation)

---

## Product Showcase

### All 8 Candles Available:

| Product | Price | Type | Size | Fragrance |
|---------|-------|------|------|-----------|
| Lavender Dreams | $34.99 | Jar | Medium | Lavender |
| Vanilla Bliss | $45.99 | Jar | Large | Vanilla |
| Rose Garden | $29.99 | Pillar | Medium | Rose |
| Ocean Breeze | $16.99 | Votive | Small | Ocean |
| Unscented Pure | $22.99 | Jar | Medium | Unscented |
| Honey Cinnamon | $48.99 | Jar | Large | Cinnamon |
| Charcoal Tea Light | $12.99 | Tea Light | Small | Unscented |
| Peppermint Festive | $18.99 | Votive | Small | Peppermint |

---

## Responsive Behavior

### Desktop (1024px and above)
- Shop page: 3-column product grid
- Filters: Sticky sidebar on left
- All features fully visible

### Tablet (768px - 1023px)
- Shop page: 2-column product grid
- Filters: Collapsible on mobile
- Optimized spacing

### Mobile (below 768px)
- Shop page: 2-column grid (480px+) or 1-column (<480px)
- Filters: Full width accordion style
- Touch-friendly buttons
- Simplified header

---

## Tips & Tricks

✨ **Pro Tips:**
- Combine search + filters for precise results
- Check related products section for similar items
- Use breadcrumbs to navigate quickly
- Mobile menu appears as hamburger on small screens
- Price slider updates product count in real-time

---

## Troubleshooting

**Q: Search results showing nothing?**
A: Check spelling or try searching by fragrance type instead of product name.

**Q: Can't find a specific candle type?**
A: Use the filters - select the type from the dropdown instead of searching.

**Q: Product detail page not loading?**
A: Ensure URL has correct product ID (1-8). Use shop page links instead.

**Q: Mobile layout looks weird?**
A: Try refreshing the page. Ensure you're viewing in portrait mode for best experience.

---

## Customization

To add new candles, edit `src/data/productsData.js`:

```javascript
export const productsData = [
  {
    id: 9,
    name: 'Your Candle Name',
    category: 'scented',
    type: 'jar',
    size: 'medium',
    price: 29.99,
    image: '🕯️',
    color: 'Color Name',
    fragrance: 'fragrance-name',
    description: 'Product description...',
    dimensions: '3.5" x 4"',
    weight: '200g',
    burningTime: '35-40 hours',
    ingredients: 'Soy wax, fragrance oil, cotton wick',
  }
]
```

---

## Performance & Features

✅ **What's Working:**
- Real-time search and filtering
- Responsive design on all devices
- Product detail pages
- Related products
- Price range filtering
- Multiple filter combinations

⏳ **Ready for Implementation:**
- Shopping cart system
- User accounts
- Payment processing
- Checkout flow
- Order history
- Wishlist

---

Enjoy your Bloom & Rudy candle shop! 🕯️✨

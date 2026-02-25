# 🛍️ Quick Access Guide - Bloom & Rudy Shop

## Current Server Status
✅ **Development Server Running**
- **URL:** http://localhost:5174
- **Port:** 5174 (5173 was in use, Vite switched automatically)
- **Start Command:** `npm run dev`

---

## 🚀 Getting Started (Right Now!)

1. **Server is Already Running** ✅
   - Open your browser
   - Go to: `http://localhost:5174`

2. **Navigate to Shop**
   - Click "Shop" in the header
   - Or go directly to: `http://localhost:5174/shop`

---

## 📍 All Available Pages

### Home Page
- **URL:** `http://localhost:5174` or `http://localhost:5174/`
- **Features:**
  - Hero section "WILD ONE"
  - Featured products
  - Special offer banner
  - Newsletter signup

### Shop Page
- **URL:** `http://localhost:5174/shop`
- **Features:**
  - Search bar
  - Filters (type, size, fragrance, price)
  - Product listing grid
  - Add to Cart buttons
  - View Details buttons

### Product Detail Pages
- **Lavender Dreams:** `http://localhost:5174/product/1`
- **Vanilla Bliss:** `http://localhost:5174/product/2`
- **Rose Garden:** `http://localhost:5174/product/3`
- **Ocean Breeze:** `http://localhost:5174/product/4`
- **Unscented Pure:** `http://localhost:5174/product/5`
- **Honey Cinnamon:** `http://localhost:5174/product/6`
- **Charcoal Tea Light:** `http://localhost:5174/product/7`
- **Peppermint Festive:** `http://localhost:5174/product/8`

---

## 🎯 Quick Feature Demo

### 1️⃣ Search
1. Go to `/shop`
2. Type in search bar: "lavender"
3. See Lavender Dreams appear
4. Try: "vanilla", "rose", "small", etc.

### 2️⃣ Filter by Type
1. Go to `/shop`
2. Click filter "Candle Type"
3. Select "jar"
4. See only jar candles (4 products)

### 3️⃣ Filter by Price
1. Go to `/shop`
2. Find "Price Range" slider
3. Drag to $40 max
4. See products under $40

### 4️⃣ View Product Details
1. Go to `/shop`
2. Click "View Details" on any product
3. See full product information:
   - Complete description
   - Specifications
   - Dimensions & weight
   - Ingredients
   - Related products

### 5️⃣ Add to Cart
1. From `/shop`: Click "🛒 Add to Cart" button
2. From product page: Select quantity, click "🛒 Add to Cart"
3. See confirmation message

---

## 🔍 Browse All Products

**Visit:** `http://localhost:5174/shop`

**See all 8 candles:**
1. Lavender Dreams - $34.99
2. Vanilla Bliss - $45.99
3. Rose Garden - $29.99
4. Ocean Breeze - $16.99
5. Unscented Pure - $22.99
6. Honey Cinnamon - $48.99
7. Charcoal Tea Light - $12.99
8. Peppermint Festive - $18.99

---

## 🧪 Try These Search Terms

```
✓ "lavender"      → Lavender Dreams
✓ "vanilla"       → Vanilla Bliss
✓ "rose"          → Rose Garden
✓ "ocean"         → Ocean Breeze
✓ "cinnamon"      → Honey Cinnamon
✓ "peppermint"    → Peppermint Festive
✓ "large"         → 2 large candles
✓ "small"         → 4 small candles
```

---

## 🎨 Try These Filters

```
Type: jar           → 4 products
Type: votive        → 2 products
Type: pillar        → 1 product
Size: small         → 4 products
Size: medium        → 2 products
Size: large         → 2 products
Price: under $30    → 5 products
Price: under $50    → 7 products
Fragrance: vanilla  → 1 product
Fragrance: unscented → 2 products
```

---

## 📱 Responsive Testing

**Desktop View (1024px+)**
- 3-column product grid
- Sidebar filters always visible
- All features displayed

**Tablet View (768px)**
- 2-column product grid
- Sticky sidebar filters
- Optimized spacing

**Mobile View (480px)**
- 2-column or 1-column grid
- Stacked layout
- Touch-friendly buttons

**Test by:**
1. Pressing F12 to open DevTools
2. Click device toolbar icon
3. Select different devices to test
4. Or manually resize browser window

---

## 🛠️ If You Need to Restart Server

**Stop the server:**
- Press `Ctrl+C` in the terminal

**Start again:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

---

## 📂 Project Files (Important)

**Where the Shop code is:**
- `/src/pages/Shop.jsx` - Shop listing page
- `/src/pages/ProductDetail.jsx` - Product detail page
- `/src/data/productsData.js` - Product database
- `/src/App.jsx` - Main routing setup

**To edit products:**
1. Open `/src/data/productsData.js`
2. Modify product data
3. Save (hot reload happens automatically)

---

## ✅ Feature Checklist

As you explore, verify these work:

- [ ] Home page loads
- [ ] Shop page loads with 8 products
- [ ] Search works (try "lavender")
- [ ] Filters work (select a type)
- [ ] Product detail page works
- [ ] Price slider works
- [ ] Reset filters works
- [ ] View Details button works
- [ ] Add to Cart button works
- [ ] Back button works
- [ ] Mobile view is responsive
- [ ] Header Shop link works

---

## 💡 Pro Tips

1. **Combine Search + Filters** for best results
2. **Check Related Products** on detail pages
3. **Read s** on product pages
4. **Use Breadcrumbs** to navigate back
5. **Test on Mobile** by resizing browser

---

## 🎯 Next Steps (For Development)

If you want to extend the shop:

1. **Add More Products:**
   - Edit `src/data/productsData.js`
   - Add new product objects with id, name, price, etc.

2. **Add Shopping Cart:**
   - Create `src/components/Cart.jsx`
   - Use React Context or Redux for state

3. **Add Checkout:**
   - Create `src/pages/Checkout.jsx`
   - Integrate payment gateway

4. **Add User Accounts:**
   - Create `src/pages/Login.jsx`
   - Add authentication

---

## 📞 Troubleshooting

**Page not loading?**
- Check URL is correct
- Refresh the browser (F5)
- Check server is running

**Products not showing?**
- Verify `/src/data/productsData.js` exists
- Check browser console for errors (F12)
- Restart dev server

**Filters not working?**
- Try resetting filters first
- Refresh the page
- Clear browser cache

**Mobile view broken?**
- Press F12 → click device toolbar
- Close DevTools and reload (sometimes fixes layout)

---

## 🎉 You're Ready!

Everything is set up and working!

**Start here:** `http://localhost:5174/shop`

Enjoy browsing the Bloom & Rudy candle collection! 🕯️✨

---

**Last Updated:** February 8, 2026
**Server Port:** 5174
**Status:** ✅ Running

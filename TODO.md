# User Profile Implementation TODO

## Backend
- [x] 1. Create database migration script (add columns and wishlist table)
- [x] 2. Update User model with updateProfile() and getOrdersByUser()
- [x] 3. Update Order model to include user_id
- [x] 4. Create Wishlist model
- [x] 5. Create userController.js
- [x] 6. Create wishlistController.js
- [x] 7. Create userRoutes.js
- [x] 8. Create wishlistRoutes.js
- [x] 9. Update server.js to include new routes

## Frontend
- [x] 10. Update api.js with user profile and wishlist endpoints
- [x] 11. Create Profile.jsx page with 3 tabs
- [x] 12. Update App.jsx to add profile route (already exists)
- [x] 13. Add wishlist button to ProductDetail.jsx

## Next Steps
- Run the database migration: cd backend && node scripts/add_user_profile_fields.js
- Start the backend: cd backend && npm run dev
- Start the frontend: npm run dev

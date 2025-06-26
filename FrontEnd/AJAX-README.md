# AJAX Implementation for Foody Project

This implementation adds dynamic AJAX functionality to your Foody recipe website, focusing only on user interactions that require real-time updates without page reloads.

## 🚀 Features Implemented

### 1. **Dynamic Favorites** (`ajax-favorites.js`)
- ❤️ Add/remove recipes from favorites via AJAX
- 🔄 Real-time UI updates without page refresh
- 📡 Syncs with Django backend database
- 🔔 User-friendly notifications for actions

### 2. **Live Search & Filtering** (`ajax-search.js`)
- 🔍 Real-time recipe search as you type
- 🥕 Filter by ingredients
- 🏷️ Filter by recipe tags
- ⚡ Debounced requests to prevent spam
- 💾 Intelligent caching for better performance

### 3. **Load More Pagination** (`ajax-pagination.js`)
- 📄 Load recipes in batches (6 at a time)
- ⬇️ "Load More" button for seamless browsing
- 🔄 Works with search and filter results
- ✨ Smooth animations for new content

### 4. **Coordinated System** (`ajax-main.js`)
- 🎛️ Central coordinator for all AJAX modules
- 🔗 Backend connection monitoring
- 🐛 Error handling and debugging
- 👤 User session management

## 📁 File Structure

```
FrontEnd/
├── foody-config.js      # Configuration (load first!)
├── ajax-favorites.js    # Favorites functionality
├── ajax-search.js       # Search and filtering
├── ajax-pagination.js   # Load more/pagination
├── ajax-main.js         # Main coordinator
├── ajax-test.html       # Test page for debugging
├── ajax-demo.html       # Demo page to test all features
└── AJAX-README.md       # This file
```

## 🛠️ Setup Instructions

### 1. Backend Setup (Django)
Ensure your Django server is running:
```bash
cd backend/foody_backend
python manage.py runserver
```

The AJAX modules expect the backend to be available at `http://127.0.0.1:8000`.

### 2. Frontend Integration
Add the AJAX scripts to your HTML pages in this **exact order**:

```html
<!-- Include dependencies first -->
<script src="storageManager.js"></script>

<!-- Load configuration first (REQUIRED) -->
<script src="foody-config.js"></script>

<!-- Add AJAX modules -->
<script src="ajax-favorites.js"></script>
<script src="ajax-search.js"></script>
<script src="ajax-pagination.js"></script>
<script src="ajax-main.js"></script>

<!-- Your existing scripts last -->
<script src="your-existing-scripts.js"></script>
```

**⚠️ Important:** The `foody-config.js` file must be loaded before the AJAX modules to avoid "Identifier already declared" errors.

### 3. HTML Requirements
Make sure your recipe cards have the correct structure:

```html
<div class="recipe-card" data-recipe-id="123">
    <img src="recipe-image.jpg" alt="Recipe Name" />
    <div class="recipe-info">
        <h3>Recipe Name</h3>
        <p>Recipe description</p>
    </div>
    <button class="favorite-btn">♡</button>
</div>
```

**Important attributes:**
- `data-recipe-id`: Must contain the recipe's database ID
- `favorite-btn` or `favorite-button`: Class for favorite buttons

## 🎯 Which Pages Need AJAX?

### ✅ **Use AJAX On:**
- **Search Page** (`search.html`) - Live search, filtering, load more
- **Home Page** (`home.html`) - Favorites, load more recipes
- **Recipe Lists** (`list.html`) - Favorites, filtering
- **Favorites Page** (`favorate.html`) - Remove favorites dynamically

### ❌ **Don't Use AJAX On:**
- **Recipe Details** (`Discription_page.html`) - Better with SSR
- **Add Recipe** (`adding_page.html`) - Form submission is fine as-is
- **Profile/Settings** - Static content, better with SSR
- **Login/Signup** - Authentication flows should reload pages

## 🧪 Testing Your Implementation

### 1. Use the Test Page First
Open `ajax-test.html` in your browser to diagnose any issues:
- File loading verification
- Backend connection testing
- API endpoint testing
- Debug information

### 2. Use the Demo Page
Once the test page shows everything working, try `ajax-demo.html`:
- Live search demonstration
- Favorites management
- Load more functionality
- Full feature showcase

### 2. Check Browser Console
The modules provide detailed logging. Open Developer Tools (F12) and check the Console tab for:
- ✅ Module initialization messages
- 🔍 AJAX request details
- ❌ Error messages if something goes wrong

### 3. Test Scenarios
1. **Search**: Type in search box - results should appear without page reload
2. **Favorites**: Click heart icons - should toggle color and show notification
3. **Load More**: Click "Load More" button - new recipes should appear with animation
4. **Connection**: Ensure Django backend is running and accessible

## 🐛 Troubleshooting

### Common Issues:

**1. "Identifier 'BACKEND_URL' has already been declared" error:**
- ✅ Make sure `foody-config.js` is loaded BEFORE other AJAX modules
- ✅ Check script loading order in your HTML
- ✅ Use the test page (`ajax-test.html`) to verify module loading

**2. "Cannot connect to server" error:**
- ✅ Ensure Django server is running: `python manage.py runserver`
- ✅ Check that backend URL is correct (http://127.0.0.1:8000)
- ✅ Verify CORS settings if accessing from different domain

**2. Favorites not working:**
- ✅ Check recipe cards have `data-recipe-id` attribute
- ✅ Verify favorite buttons have `favorite-btn` class
- ✅ Ensure user session is initialized (check localStorage for `current_user`)

**3. Search not showing results:**
- ✅ Check if `recipes-container` element exists on page
- ✅ Verify Django search endpoint is working: visit http://127.0.0.1:8000/recipes/search/ directly
- ✅ Check browser console for JavaScript errors

**4. "Failed to load resource: 404 (Not Found)" errors:**
- ✅ Check if these files exist in your FrontEnd directory:
  - `foody-config.js`
  - `storageManager.js` (from your existing project)
  - `auth.js` (from your existing project)
  - `navbar.js` (from your existing project)
- ✅ Verify all CSS files exist (`navbar.css`, `search.css`, etc.)
- ✅ Check that image files exist in the `source/` directory
- ✅ Use the test page to identify which specific files are missing

**5. Load More not appearing:**
- ✅ Ensure pagination manager is initialized
- ✅ Check if there are enough recipes to paginate
- ✅ Verify search results have pagination data

### Debug Commands:
Open browser console and try these commands:

```javascript
// Check if modules are loaded
console.log(window.ajaxFavoritesManager);
console.log(window.ajaxSearchManager);
console.log(window.ajaxPaginationManager);

// Test backend connection
await window.ajaxMainCoordinator.checkBackendConnection();

// Refresh all data
window.refreshAjaxData();

// Test search manually
await window.ajaxSearchManager.searchRecipes('chicken');
```

## 🔄 Integration with Existing Code

### Working with Current JavaScript:
The AJAX modules are designed to work alongside your existing code:

- **storageManager.js**: Enhanced to work with backend favorites
- **search.js**: Still works, but AJAX provides enhanced functionality
- **favorites.js**: AJAX provides backend sync while maintaining localStorage fallback

### Gradual Integration:
You can integrate these features gradually:

1. Start with **favorites** on one page
2. Add **search** functionality to search page
3. Implement **load more** for better UX
4. Use **main coordinator** for unified experience

## 📱 Future SSR Considerations

This AJAX implementation is designed with future Server-Side Rendering in mind:

- **Separation of Concerns**: AJAX only handles dynamic interactions
- **Progressive Enhancement**: Works with or without JavaScript
- **Backend-First**: All data operations go through Django APIs
- **Clean Integration**: Easy to replace with SSR when ready

### What to Convert to SSR Later:
- Initial page loads
- Recipe detail pages
- Static content rendering
- SEO-critical pages

### What to Keep as AJAX:
- Favorites management
- Live search/filtering
- Load more functionality
- User interaction feedback

## 🎨 Customization

### Styling:
The modules include minimal CSS for functionality. Customize by:
- Modifying the CSS in each module's `addStyles()` function
- Adding your own CSS classes
- Overriding the notification styles

### Behavior:
- Adjust search debounce time in `ajax-search.js`
- Change pagination page size in `ajax-pagination.js`
- Modify notification duration in `ajax-favorites.js`

## 🤝 Contributing

To extend this AJAX implementation:

1. Follow the same pattern as existing modules
2. Use the coordinator pattern for integration
3. Include proper error handling
4. Add debug logging
5. Test with the demo page

## 📞 Support

If you encounter issues:
1. Check the demo page first
2. Review browser console for errors
3. Verify backend is running and accessible
4. Test individual modules separately
5. Check Django logs for backend issues

---

**Happy coding! 🚀** This AJAX implementation will make your Foody website much more interactive while keeping it simple and maintainable. 
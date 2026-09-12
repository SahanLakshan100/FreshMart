/* ============================================
   PRODUCT & CATEGORY DATA
   ============================================ */

const products = [
  { id: 1, name: 'Cavendish Bananas', price: 450, category: 'fruits', icon: '🍌', unit: '1 kg', featured: true, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Hass Avocados', price: 320, category: 'fruits', icon: '🥑', unit: 'each', featured: true, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Strawberries', price: 1350, category: 'fruits', icon: '🍓', unit: '400 g punnet', featured: true, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Royal Gala Apples', price: 950, category: 'fruits', icon: '🍎', unit: '1 kg bag', featured: true, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Whole Milk', price: 420, category: 'dairy', icon: '🥛', unit: '1 L', featured: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Free-Range Eggs', price: 900, category: 'dairy', icon: '🥚', unit: '12 pack', featured: true, image: 'https://images.unsplash.com/photo-1491524062933-cb0289261700?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Greek Style Yoghurt', price: 550, category: 'dairy', icon: '🥣', unit: '500 g', featured: false, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Mild Cheddar Cheese', price: 1650, category: 'dairy', icon: '🧀', unit: '250 g', featured: false, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'Farmhouse White Bread', price: 300, category: 'bakery', icon: '🍞', unit: 'loaf', featured: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'Butter Croissants', price: 850, category: 'bakery', icon: '🥐', unit: '4 pack', featured: false, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { id: 11, name: 'Spaghetti Pasta', price: 650, category: 'pantry', icon: '🍝', unit: '500 g', featured: false, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80' },
  { id: 12, name: 'Extra Virgin Olive Oil', price: 2400, category: 'pantry', icon: '🫒', unit: '750 ml', featured: true, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { id: 13, name: 'Basmati Rice', price: 1600, category: 'pantry', icon: '🍚', unit: '5 kg', featured: false, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { id: 14, name: 'Tomato Ketchup', price: 650, category: 'pantry', icon: '🍅', unit: '500 ml', featured: false, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { id: 15, name: 'Chicken Breast Fillets', price: 1800, category: 'meat', icon: '🍗', unit: '500 g', featured: true, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80' },
  { id: 16, name: 'Atlantic Salmon Fillet', price: 4200, category: 'meat', icon: '🐟', unit: '300 g', featured: false, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80' }
];

const categories = [
  { id: 'all', label: 'All Products', icon: 'fas fa-th-large', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/CDE.png', items: [] },
  { id: 'desserts', label: 'Desserts', icon: 'fas fa-ice-cream', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/CDE.png', items: ['Chocolate Cake', 'Vanilla Swiss Roll', 'Caramel Pudding', 'Chocolate Eclairs', 'Fruit Trifle', 'Jelly Dessert Cups', 'Strawberry Cheesecake', 'Chocolate Mousse', 'Watalappan', 'Ice Cream Tub'] },
  { id: 'snacks', label: 'Snacks', icon: 'fas fa-cookie-bite', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GSN.png', items: ['Potato Chips', 'Cheese Puffs', 'Spicy Mixture', 'Salted Peanuts', 'Popcorn', 'Cassava Chips', 'Corn Snacks', 'Trail Mix', 'Roasted Chickpeas', 'Plantain Chips'] },
  { id: 'biscuits', label: 'Biscuits', icon: 'fas fa-cookie', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GBS.png', items: ['Cream Crackers', 'Chocolate Cream Biscuits', 'Milk Shortcake', 'Ginger Biscuits', 'Digestive Biscuits', 'Butter Cookies', 'Chocolate Chip Cookies', 'Wafer Biscuits', 'Salt Biscuits', 'Marie Biscuits'] },
  { id: 'coffee', label: 'Coffee', icon: 'fas fa-mug-hot', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/BCF.png', items: ['Roasted Coffee Beans', 'Instant Coffee Classic', 'Instant Coffee Gold', 'Ground Coffee', 'Coffee Sachets', 'Espresso Roast', 'Decaf Coffee', 'Mocha Coffee Mix', 'Iced Coffee Mix', 'Cappuccino Sachets'] },
  { id: 'eggs', label: 'Eggs', icon: 'fas fa-egg', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GC3.png', items: ['Free-Range Eggs', 'Large White Eggs', 'Brown Eggs', 'Omega 3 Eggs', 'Organic Eggs', 'Quail Eggs', 'Egg Whites', 'Farm Fresh Eggs', 'Medium Eggs', 'Jumbo Eggs'] },
  { id: 'bakery', label: 'Bakery', icon: 'fas fa-bread-slice', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GW2.png', items: ['Farmhouse White Bread', 'Whole Wheat Bread', 'Butter Croissants', 'Chocolate Croissants', 'Burger Buns', 'Hot Dog Rolls', 'Garlic Bread', 'Dinner Rolls', 'Cinnamon Danish', 'Multigrain Loaf'] },
  { id: 'family-beverages', label: 'Family Consumption Beverages', icon: 'fas fa-bottle-water', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0B.png', items: ['Cola Soft Drink', 'Ginger Ale', 'Lemon Lime Soda', 'Orange Soft Drink', 'Ginger Beer', 'Soda Water', 'Tonic Water', 'Family Fruit Punch', 'Sparkling Apple Drink', 'Mango Nectar'] },
  { id: 'individual-beverages', label: 'Individual Consumption Beverages', icon: 'fas fa-bottle-water', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0C.png', items: ['Cola 500ml', 'Orange Drink 500ml', 'Lemon Lime 500ml', 'Iced Tea Bottle', 'Energy Drink', 'Sports Drink', 'Fruit Juice Bottle', 'Ginger Beer Bottle', 'Sparkling Water', 'Kombucha Drink'] },
  { id: 'water', label: 'Water', icon: 'fas fa-glass-water', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0D.png', items: ['Natural Mineral Water 500ml', 'Natural Mineral Water 1L', 'Natural Mineral Water 1.5L', 'Spring Water 5L', 'Family Water 6L', 'Sparkling Water 750ml', 'Alkaline Water', 'Flavoured Water Lemon', 'Flavoured Water Berry', 'Kids Water Bottle'] },
  { id: 'malt-chocolate', label: 'Malt & Chocolate Drinks', icon: 'fas fa-mug-hot', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0F.png', items: ['Chocolate Malt Drink', 'Classic Malt Powder', 'Chocolate Milk Drink', 'Malted Milo Style Drink', 'Kids Chocolate Drink', 'Dark Chocolate Drink', 'Malt Drink Sachets', 'Hot Chocolate Powder', 'Choco Mocha Mix', 'Chocolate Protein Drink'] },
  { id: 'milk', label: 'Powdered & Liquid Milk', icon: 'fas fa-glass-water', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0G.png', items: ['Whole Milk 1L', 'Low Fat Milk', 'Full Cream Milk Powder', 'Skimmed Milk Powder', 'Condensed Milk', 'Evaporated Milk', 'UHT Chocolate Milk', 'UHT Low Fat Milk', 'Lactose Free Milk', 'Coconut Milk'] },
  { id: 'tea', label: 'Tea', icon: 'fas fa-mug-hot', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0H.png', items: ['English Breakfast Tea', 'Ceylon Black Tea', 'Earl Grey Tea', 'Green Tea', 'Ginger Tea', 'Lemon Tea', 'Peppermint Tea', 'Chamomile Tea', 'Tea Bags 100 Pack', 'Iced Tea Blend'] },
  { id: 'cheese', label: 'Cheese', icon: 'fas fa-cheese', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/C0I.png', items: ['Mild Cheddar Cheese', 'Mozzarella Cheese', 'Cream Cheese', 'Parmesan Cheese', 'Processed Cheese Slices', 'Edam Cheese', 'Gouda Cheese', 'Blue Cheese', 'Cottage Cheese', 'Cheese Spread'] },
  { id: 'yoghurts-curd', label: 'Yoghurts & Curd', icon: 'fas fa-bowl-food', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/C0P.png', items: ['Greek Style Yoghurt', 'Natural Set Yoghurt', 'Strawberry Yoghurt', 'Vanilla Yoghurt', 'Mango Yoghurt', 'Drinking Yoghurt', 'Plain Curd', 'Buffalo Curd', 'Low Fat Yoghurt', 'Family Yoghurt Tub'] },
  { id: 'frozen-snacks', label: 'Frozen RTC Snacks', icon: 'fas fa-snowflake', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/D0V.png', items: ['Frozen Fish Fingers', 'Chicken Nuggets', 'Vegetable Spring Rolls', 'Samosa Pack', 'French Fries', 'Hash Browns', 'Frozen Cutlets', 'Cheese Balls', 'Chicken Sausage', 'Frozen Paratha'] },
  { id: 'pasta-noodles', label: 'Pasta & Noodles', icon: 'fas fa-bowl-food', image: 'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/G1F.png', items: ['Spaghetti Pasta', 'Penne Pasta', 'Macaroni Pasta', 'Egg Noodles', 'Instant Chicken Noodles', 'Instant Vegetable Noodles', 'Rice Noodles', 'Lasagne Sheets', 'Fusilli Pasta', 'Whole Wheat Pasta'] }
];

const productImagePool = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80'
];

const namedProductImages = {
  dessert: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  snack: 'https://images.unsplash.com/photo-1621939514649-280e2aa7b1b9?auto=format&fit=crop&w=600&q=80',
  biscuit: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
  egg: 'https://images.unsplash.com/photo-1491524062933-cb0289261700?auto=format&fit=crop&w=600&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  beverage: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  tea: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80',
  cheese: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80',
  yoghurt: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  frozen: 'https://images.unsplash.com/photo-1577704890248-3f7c3b9f0e6d?auto=format&fit=crop&w=600&q=80',
  pasta: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80'
};

function getNamedProductImage(name, categoryId, index) {
  const value = name.toLowerCase();
  const type = value.includes('cake') || value.includes('pudding') || value.includes('mousse') || value.includes('dessert') || value.includes('cheesecake')
    ? 'dessert'
    : value.includes('chip') || value.includes('popcorn') || value.includes('peanut') || value.includes('snack') || value.includes('mixture') || value.includes('chickpea')
      ? 'snack'
      : value.includes('biscuit') || value.includes('cookie') || value.includes('cracker') || value.includes('wafer')
        ? 'biscuit'
        : value.includes('coffee') || value.includes('espresso') || value.includes('cappuccino') || value.includes('mocha')
          ? 'coffee'
          : value.includes('egg')
            ? 'egg'
            : value.includes('bread') || value.includes('croissant') || value.includes('bun') || value.includes('roll') || value.includes('danish') || value.includes('paratha')
              ? 'bakery'
              : value.includes('water')
                ? 'water'
                : value.includes('milk') || value.includes('coconut') || value.includes('condensed') || value.includes('evaporated')
                  ? 'milk'
                  : value.includes('tea')
                    ? 'tea'
                    : value.includes('cheese')
                      ? 'cheese'
                      : value.includes('yoghurt') || value.includes('yogurt') || value.includes('curd')
                        ? 'yoghurt'
                        : value.includes('frozen') || value.includes('fries') || value.includes('nugget') || value.includes('samosa') || value.includes('spring roll')
                          ? 'frozen'
                          : value.includes('pasta') || value.includes('noodle') || value.includes('spaghetti') || value.includes('macaroni')
                            ? 'pasta'
                            : categoryId.includes('beverage') ? 'beverage' : null;
  return namedProductImages[type] || productImagePool[index % productImagePool.length];
}

const categoryProducts = categories
  .filter(category => category.id !== 'all')
  .flatMap((category, categoryIndex) => category.items.map((name, itemIndex) => ({
    id: 1000 + (categoryIndex * 10) + itemIndex + 1,
    name,
    price: 250 + ((categoryIndex * 137 + itemIndex * 83) % 1250),
    category: category.id,
    icon: '🛒',
    unit: 'pack',
    featured: false,
    image: getNamedProductImage(name, category.id, categoryIndex * 10 + itemIndex),
    fallbackImage: category.image
  })));

products.push(...categoryProducts);

/* Keep the demo catalog editable between browser sessions. */
const CatalogStore = (function () {
  const PRODUCTS_KEY = 'freshmart_products';
  const CATEGORIES_KEY = 'freshmart_categories';

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  const savedProducts = read(PRODUCTS_KEY, null);
  const savedCategories = read(CATEGORIES_KEY, null);
  if (savedProducts) products.splice(0, products.length, ...savedProducts);
  if (savedCategories) categories.splice(0, categories.length, ...savedCategories);

  function saveProducts() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  function saveCategories() {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }

  return { saveProducts, saveCategories };
})();

function formatPrice(value) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
  }).format(value);
}
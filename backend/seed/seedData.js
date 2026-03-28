// ============================================
// Database Seeder - Sample Data (College Canteen)
// ============================================
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const users = [
  { name: 'Canteen Admin', email: 'admin@canteen.com', password: 'admin123', role: 'admin', phone: '9876543210', address: 'College Campus', canteenName: 'Campus Canteen' },
  { name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'customer', phone: '9876543211', address: 'Hostel Block A' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'user123', role: 'customer', phone: '9876543212', address: 'Hostel Block B' },
];

const menuItems = [
  { name: 'Paneer Butter Masala', description: 'Rich creamy paneer curry in butter tomato gravy', price: 280, category: 'veg', availability: true, orderCount: 145, rating: 4.5, image: '🧈' },
  { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables and spices', price: 220, category: 'veg', availability: true, orderCount: 120, rating: 4.2, image: '🍚' },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils in rich creamy butter sauce', price: 200, category: 'veg', availability: true, orderCount: 98, rating: 4.4, image: '🥘' },
  { name: 'Palak Paneer', description: 'Fresh cottage cheese cubes in smooth spinach gravy', price: 250, category: 'veg', availability: true, orderCount: 87, rating: 4.3, image: '🥬' },
  { name: 'Aloo Gobi', description: 'Classic potato and cauliflower curry with spices', price: 180, category: 'veg', availability: true, orderCount: 65, rating: 4.0, image: '🥔' },
  { name: 'Butter Chicken', description: 'Tender chicken in rich creamy tomato sauce', price: 320, category: 'non-veg', availability: true, orderCount: 200, rating: 4.8, image: '🍗' },
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice layered with spiced chicken', price: 300, category: 'non-veg', availability: true, orderCount: 180, rating: 4.7, image: '🍛' },
  { name: 'Mutton Rogan Josh', description: 'Slow-cooked mutton in rich Kashmiri spice gravy', price: 380, category: 'non-veg', availability: true, orderCount: 95, rating: 4.6, image: '🥩' },
  { name: 'Fish Curry', description: 'Fresh fish in tangy coconut-based curry sauce', price: 340, category: 'non-veg', availability: true, orderCount: 72, rating: 4.3, image: '🐟' },
  { name: 'Egg Curry', description: 'Boiled eggs simmered in spicy onion-tomato gravy', price: 180, category: 'non-veg', availability: true, orderCount: 55, rating: 4.1, image: '🥚' },
  { name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas', price: 40, category: 'snacks', availability: true, orderCount: 250, rating: 4.5, image: '🥟' },
  { name: 'Spring Rolls', description: 'Crispy rolls stuffed with mixed vegetables', price: 120, category: 'snacks', availability: true, orderCount: 110, rating: 4.2, image: '🌯' },
  { name: 'French Fries', description: 'Golden crispy potato fries served with ketchup', price: 100, category: 'snacks', availability: true, orderCount: 160, rating: 4.0, image: '🍟' },
  { name: 'Chicken Wings', description: 'Spicy buffalo chicken wings with dip', price: 220, category: 'snacks', availability: true, orderCount: 130, rating: 4.4, image: '🍗' },
  { name: 'Gulab Jamun', description: 'Soft milk dumplings in rose-flavored sugar syrup', price: 100, category: 'desserts', availability: true, orderCount: 140, rating: 4.6, image: '🍩' },
  { name: 'Chocolate Brownie', description: 'Rich fudgy brownie topped with vanilla ice cream', price: 180, category: 'desserts', availability: true, orderCount: 170, rating: 4.7, image: '🍫' },
  { name: 'Ice Cream Sundae', description: 'Three scoops with hot fudge, nuts, and cherry', price: 150, category: 'desserts', availability: true, orderCount: 125, rating: 4.4, image: '🍨' },
  { name: 'Rasgulla', description: 'Spongy cottage cheese balls in light sugar syrup', price: 90, category: 'desserts', availability: true, orderCount: 95, rating: 4.3, image: '⚪' },
  { name: 'Mango Lassi', description: 'Refreshing yogurt drink blended with sweet mangoes', price: 80, category: 'beverages', availability: true, orderCount: 175, rating: 4.5, image: '🥤' },
  { name: 'Masala Chai', description: 'Traditional Indian tea brewed with aromatic spices', price: 40, category: 'beverages', availability: true, orderCount: 220, rating: 4.6, image: '☕' },
  { name: 'Cold Coffee', description: 'Chilled coffee blended with milk and ice cream', price: 120, category: 'beverages', availability: true, orderCount: 155, rating: 4.3, image: '🧋' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime juice mixed with soda water', price: 60, category: 'beverages', availability: true, orderCount: 100, rating: 4.1, image: '🍋' },
  { name: 'Naan Bread', description: 'Soft fluffy Indian flatbread baked in tandoor', price: 40, category: 'main-course', availability: true, orderCount: 300, rating: 4.5, image: '🫓' },
  { name: 'Jeera Rice', description: 'Fragrant basmati rice tempered with cumin seeds', price: 120, category: 'main-course', availability: true, orderCount: 180, rating: 4.2, image: '🍚' },
  { name: 'Tandoori Roti', description: 'Whole wheat bread baked in clay oven', price: 30, category: 'main-course', availability: true, orderCount: 280, rating: 4.4, image: '🫓' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodie-express');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    // Also clear the counter collection
    try {
      await mongoose.connection.db.collection('counters').deleteMany({});
    } catch (e) { /* collection may not exist */ }
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create menu items
    const createdItems = await MenuItem.create(menuItems);
    console.log(`Created ${createdItems.length} menu items`);

    // Create sample orders
    const sampleOrders = [
      {
        user: createdUsers[1]._id,
        items: [
          { menuItem: createdItems[5]._id, name: createdItems[5].name, price: createdItems[5].price, quantity: 2 },
          { menuItem: createdItems[22]._id, name: createdItems[22].name, price: createdItems[22].price, quantity: 4 },
        ],
        totalPrice: createdItems[5].price * 2 + createdItems[22].price * 4,
        status: 'Delivered',
        deliveryAddress: 'Hostel Block A',
        phone: '9876543211',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 3) },
          { status: 'Preparing', timestamp: new Date(Date.now() - 86400000 * 3 + 600000) },
          { status: 'Ready for Pickup', timestamp: new Date(Date.now() - 86400000 * 3 + 1800000) },
          { status: 'Delivered', timestamp: new Date(Date.now() - 86400000 * 3 + 3600000) },
        ],
      },
      {
        user: createdUsers[1]._id,
        items: [
          { menuItem: createdItems[0]._id, name: createdItems[0].name, price: createdItems[0].price, quantity: 1 },
          { menuItem: createdItems[18]._id, name: createdItems[18].name, price: createdItems[18].price, quantity: 2 },
        ],
        totalPrice: createdItems[0].price + createdItems[18].price * 2,
        status: 'Preparing',
        deliveryAddress: 'Hostel Block A',
        phone: '9876543211',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000) },
          { status: 'Preparing', timestamp: new Date(Date.now() - 1800000) },
        ],
      },
      {
        user: createdUsers[2]._id,
        items: [
          { menuItem: createdItems[6]._id, name: createdItems[6].name, price: createdItems[6].price, quantity: 1 },
          { menuItem: createdItems[14]._id, name: createdItems[14].name, price: createdItems[14].price, quantity: 3 },
        ],
        totalPrice: createdItems[6].price + createdItems[14].price * 3,
        status: 'Pending',
        deliveryAddress: 'Hostel Block B',
        phone: '9876543212',
        statusHistory: [{ status: 'Pending', timestamp: new Date() }],
      },
    ];

    await Order.create(sampleOrders);
    console.log('Created sample orders');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin (Canteen Staff): admin@canteen.com / admin123');
    console.log('   Student 1: john@example.com / user123');
    console.log('   Student 2: jane@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();

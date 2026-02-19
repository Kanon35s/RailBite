const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Order = require('./models/Order');
const Menu = require('./models/Menu');
const DeliveryStaff = require('./models/DeliveryStaff');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/railbite';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    // 1) Admin user
    let admin = await User.findOne({ email: 'admin@railbite.com' });

    if (!admin) {
      admin = await User.create({
        name: 'RailBite Admin',
        email: 'admin@railbite.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', admin.email);
    }

        // 2) Clear existing orders
    await Order.deleteMany({});
    console.log('Existing orders cleared');

    // 3) Sample orders
    const now = new Date();
    const today = new Date(now);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const sampleOrders = [
      {
        orderNumber: 'RB-1001',
        user: admin._id,
        items: [
          { name: 'Chicken Biryani', price: 250, quantity: 2 },
          { name: 'Coke', price: 40, quantity: 2 }
        ],
        totalAmount: 580,
        status: 'delivered',
        paymentMethod: 'cash',
        createdAt: today,
        updatedAt: today
      },
      {
        orderNumber: 'RB-1002',
        user: admin._id,
        items: [
          { name: 'Beef Burger', price: 200, quantity: 1 },
          { name: 'Fries', price: 80, quantity: 1 }
        ],
        totalAmount: 280,
        status: 'pending',
        paymentMethod: 'online',
        createdAt: today,
        updatedAt: today
      },
      {
        orderNumber: 'RB-1003',
        user: admin._id,
        items: [
          { name: 'Chicken Pizza', price: 400, quantity: 1 }
        ],
        totalAmount: 400,
        status: 'delivered',
        paymentMethod: 'card',
        createdAt: yesterday,
        updatedAt: yesterday
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('Sample orders inserted');

    // 4) Clear and seed menu items
    await Menu.deleteMany({});
    console.log('Existing menu items cleared');

    const menuItems = [
      // Breakfast
      { name: 'Paratha with Dim Bhuna', category: 'breakfast', price: 120, description: 'Flaky paratha with spiced scrambled eggs', image: '/images/paratha-dim.png', available: true },
      { name: 'Khichuri with Beef', category: 'breakfast', price: 180, description: 'Comfort rice and lentils with spiced beef', image: '/images/beef-khichuri.png', available: true },
      { name: 'Roti with Niramish', category: 'breakfast', price: 100, description: 'Whole wheat bread with mixed vegetable curry', image: '/images/roti-niramish.png', available: true },

      // Lunch
      { name: 'Bhuna Khichuri with Chicken', category: 'lunch', price: 200, description: 'Rich and flavorful rice dish', image: '/images/bhuna-khichuri.png', available: true },
      { name: 'Morog Polao', category: 'lunch', price: 220, description: 'Chicken pulao with ghee', image: '/images/morog-polao.png', available: true },
      { name: 'Beef Kala Bhuna', category: 'lunch', price: 280, description: 'Slow-cooked spicy beef curry', image: '/images/beef-kalabhuna.png', available: true },
      { name: 'Fish Curry with Rice', category: 'lunch', price: 180, description: 'Traditional Bengali fish curry', image: '/images/fishcurry.jpg', available: true },

      // Dinner
      { name: 'Chicken Rezala', category: 'dinner', price: 250, description: 'Creamy yogurt-based chicken curry', image: '/images/chicken-rezala.png', available: true },
      { name: 'Beef Tehari', category: 'dinner', price: 200, description: 'Spiced beef with yellow rice', image: '/images/beef-tehari.jpg', available: true },

      // Biryani
      { name: 'Kacchi Biryani', category: 'biryani', price: 350, description: 'Authentic mutton biryani', image: '/images/biryani.jpg', available: true },
      { name: 'Chicken Biryani', category: 'biryani', price: 180, description: 'Tender chicken with aromatic rice', image: '/images/chicken-biryani.jpg', available: true },

      // Burgers
      { name: 'Firecracker Chicken', category: 'burger', price: 200, description: 'Spicy chicken with jalapeños', image: '/images/firecracker-chicken.png', available: true },
      { name: 'BBQ Beef Blast', category: 'burger', price: 350, description: 'Smoky BBQ beef with crispy bacon', image: '/images/bbq-beef-blast.png', available: true },
      { name: 'The Classic King', category: 'burger', price: 250, description: 'Double beef patty with cheese', image: '/images/classic-king.png', available: true },
      { name: 'Sunrise Burger', category: 'burger', price: 300, description: 'Beef patty with fried egg', image: '/images/sunrise.png', available: true },

      // Pizza
      { name: 'Peri Peri Chicken Pizza', category: 'pizza', price: 999, description: 'Spicy chicken with peri peri sauce', image: '/images/peri-peri-pizza.png', available: true },
      { name: 'Beef Pepperoni Pizza', category: 'pizza', price: 899, description: 'Classic pepperoni with mozzarella', image: '/images/beef-pepperoni.jpg', available: true },
      { name: 'Mozzarella Cheese Mushroom Pizza', category: 'pizza', price: 799, description: 'Cheesy mushroom delight', image: '/images/mozarella-cheese.jpg', available: true },
      { name: 'Vegetable Pizza', category: 'pizza', price: 699, description: 'Fresh vegetables with herbs', image: '/images/vegetable-pizza.jpg', available: true },

      // Shwarma
      { name: 'Chicken Shwarma', category: 'shwarma', price: 80, description: 'Classic chicken wrap with garlic sauce', image: '/images/chicken-shwarma.png', available: true },
      { name: 'Beef Shwarma', category: 'shwarma', price: 120, description: 'Spiced beef with tahini sauce', image: '/images/beef-shwarma.png', available: true },
      { name: 'Turkey Shwarma', category: 'shwarma', price: 100, description: 'Tender turkey with fresh vegetables', image: '/images/turkey-shwarma.png', available: true },

      // Beverages
      { name: 'Sprite', category: 'beverage', price: 50, description: 'Lemon-lime flavored soda', image: '/images/sprite.jpg', available: true },
      { name: '7Up', category: 'beverage', price: 50, description: 'Crisp lemon-lime drink', image: '/images/7up.jpg', available: true },
      { name: 'Mirinda', category: 'beverage', price: 50, description: 'Orange flavored soda', image: '/images/mirinda.jpg', available: true },
      { name: 'Coca Cola', category: 'beverage', price: 50, description: 'Classic cola drink', image: '/images/coca-cola.jpg', available: true },
      { name: 'Fanta', category: 'beverage', price: 50, description: 'Orange flavored soda', image: '/images/fanta.jpg', available: true },
      { name: 'Pepsi', category: 'beverage', price: 50, description: 'Cola soft drink', image: '/images/pepsi.jpg', available: true },

      // Smoothies
      { name: 'Mango Smoothie', category: 'smoothie', price: 199, description: 'Fresh mango blended with yogurt', image: '/images/mango-smoothie.jpg', available: true },
      { name: 'Strawberry Smoothie', category: 'smoothie', price: 219, description: 'Sweet strawberries with cream', image: '/images/strawberry-smoothie.jpg', available: true },
      { name: 'Mixed Fruits Smoothie', category: 'smoothie', price: 249, description: 'Blend of tropical fruits', image: '/images/mixfruit-smoothie.jpg', available: true },

      // Snacks
      { name: 'Jhal Muri', category: 'snacks', price: 30, description: 'Spicy puffed rice mix', image: '/images/jhalmuri.png', available: true }
    ];
      
    await DeliveryStaff.deleteMany({});
    const deliveryStaffData = [
    { name: 'Karim Ahmed', phone: '01712345678', vehicleType: 'bike', vehicleNumber: 'DHA-1234', status: 'available', assignedOrders: 0, completedToday: 5 },
    { name: 'Rahim Mia', phone: '01812345678', vehicleType: 'bike', vehicleNumber: 'DHA-5678', status: 'busy', assignedOrders: 1, completedToday: 3 },
    { name: 'Salman Khan', phone: '01912345678', vehicleType: 'car', vehicleNumber: 'DHA-9012', status: 'available', assignedOrders: 0, completedToday: 7 }
    ];
    await DeliveryStaff.insertMany(deliveryStaffData);
    console.log('Delivery staff inserted');

    await Menu.insertMany(menuItems);
    console.log('Menu items inserted');

    console.log('Seeding finished');
    process.exit(0);

  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();

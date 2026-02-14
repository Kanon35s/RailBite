const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const menuItems = [
  // Breakfast
  {
    name: 'Paratha with Dim Bhuna',
    category: 'breakfast',
    price: 120,
    description: 'Flaky paratha with spiced scrambled eggs',
    image: '/images/paratha-dim.png'
  },
  {
    name: 'Khichuri with Beef',
    category: 'breakfast',
    price: 180,
    description: 'Comfort rice and lentils with spiced beef',
    image: '/images/beef-khichuri.png'
  },
  {
    name: 'Roti with Niramish',
    category: 'breakfast',
    price: 100,
    description: 'Whole wheat bread with mixed vegetable curry',
    image: '/images/roti-niramish.png'
  },

  // Lunch
  {
    name: 'Bhuna Khichuri with Chicken',
    category: 'lunch',
    price: 200,
    description: 'Rich and flavorful rice dish',
    image: '/images/bhuna-khichuri.png'
  },
  {
    name: 'Morog Polao',
    category: 'lunch',
    price: 220,
    description: 'Chicken pulao with ghee',
    image: '/images/morog-polao.png'
  },
  {
    name: 'Beef Kala Bhuna',
    category: 'lunch',
    price: 280,
    description: 'Slow-cooked spicy beef curry',
    image: '/images/beef-kalabhuna.png'
  },
  {
    name: 'Fish Curry with Rice',
    category: 'lunch',
    price: 180,
    description: 'Traditional Bengali fish curry',
    image: '/images/fishcurry.jpg'
  },

  // Dinner
  {
    name: 'Chicken Rezala',
    category: 'dinner',
    price: 250,
    description: 'Creamy yogurt-based chicken curry',
    image: '/images/chicken-rezala.png'
  },
  {
    name: 'Morog Polao',
    category: 'dinner',
    price: 220,
    description: 'Chicken pulao with ghee',
    image: '/images/morog-polao.png'
  },
  {
    name: 'Beef Tehari',
    category: 'dinner',
    price: 200,
    description: 'Spiced beef with yellow rice',
    image: '/images/beef-tehari.jpg'
  },
  {
    name: 'Fish Curry with Rice',
    category: 'dinner',
    price: 180,
    description: 'Traditional Bengali fish curry',
    image: '/images/fishcurry.jpg'
  },

  // Biryani
  {
    name: 'Kacchi Biryani',
    category: 'biryani',
    price: 350,
    description: 'Authentic mutton biryani',
    image: '/images/biryani.jpg'
  },
  {
    name: 'Chicken Biryani',
    category: 'biryani',
    price: 180,
    description: 'Tender chicken with aromatic rice',
    image: '/images/chicken-biryani.jpg'
  },
  {
    name: 'Beef Tehari',
    category: 'biryani',
    price: 200,
    description: 'Spiced beef with yellow rice',
    image: '/images/beef-tehari.jpg'
  },
  {
    name: 'Morog Polao',
    category: 'biryani',
    price: 220,
    description: 'Chicken pulao with ghee',
    image: '/images/morog-polao.jpg'
  },

  // Burgers
  {
    name: 'Firecracker Chicken',
    category: 'burger',
    price: 200,
    description: 'Spicy chicken with jalapeños',
    image: '/images/firecracker-chicken.png'
  },
  {
    name: 'BBQ Beef Blast',
    category: 'burger',
    price: 350,
    description: 'Smoky BBQ beef with crispy bacon',
    image: '/images/bbq-beef-blast.png'
  },
  {
    name: 'The Classic King',
    category: 'burger',
    price: 250,
    description: 'Double beef patty with cheese',
    image: '/images/classic-king.png'
  },
  {
    name: 'Sunrise Burger',
    category: 'burger',
    price: 300,
    description: 'Beef patty with fried egg',
    image: '/images/sunrise.png'
  },

  // Pizza
  {
    name: 'Peri Peri Chicken Pizza',
    category: 'pizza',
    price: 999,
    description: 'Spicy chicken with peri peri sauce',
    image: '/images/peri-peri-pizza.png'
  },
  {
    name: 'Beef Pepperoni Pizza',
    category: 'pizza',
    price: 899,
    description: 'Classic pepperoni with mozzarella',
    image: '/images/beef-pepperoni.jpg'
  },
  {
    name: 'Mozzarella Cheese Mushroom Pizza',
    category: 'pizza',
    price: 799,
    description: 'Cheesy mushroom delight',
    image: '/images/mozarella-cheese.jpg'
  },
  {
    name: 'Vegetable Pizza',
    category: 'pizza',
    price: 699,
    description: 'Fresh vegetables with herbs',
    image: '/images/vegetable-pizza.jpg'
  },

  // Shwarma
  {
    name: 'Chicken Shwarma',
    category: 'shwarma',
    price: 80,
    description: 'Classic chicken wrap with garlic sauce',
    image: '/images/chicken-shwarma.png'
  },
  {
    name: 'Beef Shwarma',
    category: 'shwarma',
    price: 120,
    description: 'Spiced beef with tahini sauce',
    image: '/images/beef-shwarma.png'
  },
  {
    name: 'Turkey Shwarma',
    category: 'shwarma',
    price: 100,
    description: 'Tender turkey with fresh vegetables',
    image: '/images/turkey-shwarma.png'
  },

  // Beverages (now matches BeverageMenu.js)
  {
    name: 'Sprite',
    category: 'beverage',
    price: 50,
    description: 'Lemon-lime flavored soda',
    image: '/images/sprite.jpg'
  },
  {
    name: '7Up',
    category: 'beverage',
    price: 50,
    description: 'Crisp lemon-lime drink',
    image: '/images/7up.jpg'
  },
  {
    name: 'Mirinda',
    category: 'beverage',
    price: 50,
    description: 'Orange flavored soda',
    image: '/images/mirinda.jpg'
  },
  {
    name: 'Coca Cola',
    category: 'beverage',
    price: 50,
    description: 'Classic cola drink',
    image: '/images/coca-cola.jpg'
  },
  {
    name: 'Fanta',
    category: 'beverage',
    price: 50,
    description: 'Orange flavored soda',
    image: '/images/fanta.jpg'
  },
  {
    name: 'Pepsi',
    category: 'beverage',
    price: 50,
    description: 'Cola soft drink',
    image: '/images/pepsi.jpg'
  },

  // Smoothies
  {
    name: 'Mango Smoothie',
    category: 'smoothie',
    price: 199,
    description: 'Fresh mango blended with yogurt',
    image: '/images/mango-smoothie.jpg'
  },
  {
    name: 'Strawberry Smoothie',
    category: 'smoothie',
    price: 219,
    description: 'Sweet strawberries with cream',
    image: '/images/strawberry-smoothie.jpg'
  },
  {
    name: 'Mixed Fruits Smoothie',
    category: 'smoothie',
    price: 249,
    description: 'Blend of tropical fruits',
    image: '/images/mixfruit-smoothie.jpg'
  },

  // Snacks
  {
    name: 'Jhal Muri',
    category: 'snacks',
    price: 30,
    description: 'Spicy puffed rice mix',
    image: '/images/jhalmuri.png'
  }
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await MenuItem.deleteMany();
    console.log('Menu items deleted');
    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedMenu();

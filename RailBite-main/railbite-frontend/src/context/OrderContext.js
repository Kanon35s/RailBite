import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderType, setOrderType] = useState('train');
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Load order history from localStorage
    const storedOrders = localStorage.getItem('railbiteOrderHistory');
    if (storedOrders) {
      setOrderHistory(JSON.parse(storedOrders));
    } else {
      // Generate mock orders for demo
      const mockOrders = generateMockOrders();
      setOrderHistory(mockOrders);
      localStorage.setItem('railbiteOrderHistory', JSON.stringify(mockOrders));
    }

    // Load order type
    const storedOrderType = localStorage.getItem('railbiteOrderType');
    if (storedOrderType) {
      setOrderType(storedOrderType);
    }

    // Load booking details
    const storedBooking = localStorage.getItem('railbiteBooking');
    if (storedBooking) {
      setBookingDetails(JSON.parse(storedBooking));
    }
  }, []);

  const saveOrderType = (type) => {
    setOrderType(type);
    localStorage.setItem('railbiteOrderType', type);
  };

  const saveBookingDetails = (details) => {
    setBookingDetails(details);
    localStorage.setItem('railbiteBooking', JSON.stringify(details));
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: order.id || `RB${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    localStorage.setItem('railbiteOrderHistory', JSON.stringify(updatedHistory));
    setCurrentOrder(newOrder);
    localStorage.setItem('railbiteLastOrder', JSON.stringify(newOrder));
    
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orderHistory.find(order => order.id === orderId);
  };

  const generateMockOrders = () => {
    return [
      {
        id: 'RB123456',
        date: new Date('2024-12-18').toISOString(),
        items: [
          { name: 'Kacchi Biryani', quantity: 2, price: 350 },
          { name: 'Borhani', quantity: 2, price: 50 }
        ],
        customer: { fullName: 'Rashid Mostafa', phone: '01898942731' },
        paymentMethod: 'mobile',
        subtotal: 800,
        vat: 40,
        deliveryFee: 50,
        total: 890,
        status: 'delivered',
        trainInfo: { trainNumber: '701', coachNumber: 'KA', seatNumber: '25' }
      },
      {
        id: 'RB123455',
        date: new Date('2024-12-15').toISOString(),
        items: [
          { name: 'Paratha with Dim Bhuna', quantity: 1, price: 120 },
          { name: 'Cha (Tea)', quantity: 1, price: 15 }
        ],
        customer: { fullName: 'Rashid Mostafa', phone: '01898942731' },
        paymentMethod: 'cash',
        subtotal: 135,
        vat: 7,
        deliveryFee: 50,
        total: 192,
        status: 'delivered',
        trainInfo: { trainNumber: '709', coachNumber: 'GHA', seatNumber: '42' }
      }
    ];
  };

  const value = {
    orderHistory,
    currentOrder,
    orderType,
    bookingDetails,
    saveOrderType,
    saveBookingDetails,
    addOrder,
    getOrderById
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
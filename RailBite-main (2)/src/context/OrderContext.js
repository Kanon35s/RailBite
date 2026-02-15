import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

const getAuthConfig = () => {
  const token = localStorage.getItem('railbiteToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const OrderProvider = ({ children }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderType, setOrderType] = useState('train');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    const storedOrderType = localStorage.getItem('railbiteOrderType');
    if (storedOrderType) {
      setOrderType(storedOrderType);
    }

    const storedBooking = localStorage.getItem('railbiteBooking');
    if (storedBooking) {
      setBookingDetails(JSON.parse(storedBooking));
    }

    fetchOrders();
  }, []);

  const fetchOrders = async (status = 'all') => {
    try {
      setLoadingOrders(true);
      setOrderError(null);
      const res = await axios.get(`${API_URL}/orders`, {
        params: { status },
        ...getAuthConfig(),
      });
      if (res.data.success) {
        setOrderHistory(res.data.data || []);
      } else {
        setOrderHistory([]);
        setOrderError('Failed to load orders');
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrderError(
        err.response?.data?.message || 'Failed to load orders'
      );
      setOrderHistory([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const saveOrderType = (type) => {
    setOrderType(type);
    localStorage.setItem('railbiteOrderType', type);
  };

  const saveBookingDetails = (details) => {
    setBookingDetails(details);
    localStorage.setItem('railbiteBooking', JSON.stringify(details));
  };

  const addOrder = async (orderPayload) => {
    try {
      const res = await axios.post(
        `${API_URL}/orders`,
        orderPayload,
        getAuthConfig()
      );
      if (res.data.success) {
        const newOrder = res.data.data;
        setCurrentOrder(newOrder);
        await fetchOrders();
        localStorage.setItem(
          'railbiteLastOrder',
          JSON.stringify(newOrder)
        );
        return newOrder;
      }
      throw new Error('Failed to create order');
    } catch (err) {
      console.error('Failed to create order:', err);
      throw err;
    }
  };

  const getOrderById = (orderId) => {
    // backend uses _id or id; adjust if needed
    return (
      orderHistory.find((order) => order._id === orderId) ||
      orderHistory.find((order) => order.id === orderId)
    );
  };

  const value = {
    orderHistory,
    currentOrder,
    orderType,
    bookingDetails,
    loadingOrders,
    orderError,
    fetchOrders,
    saveOrderType,
    saveBookingDetails,
    addOrder,
    getOrderById,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

import api from './request';

/**
 * 创建订单
 */
export const createOrder = (data) => {
  return api.post('/orders', data);
};

/**
 * 获取订单列表
 */
export const getOrders = (params) => {
  return api.get('/orders', { params });
};

/**
 * 获取订单详情
 */
export const getOrderDetail = (id) => {
  return api.get(`/orders/${id}`);
};

/**
 * 获取套餐列表
 */
export const getPackages = () => {
  return api.get('/orders/packages/list');
};


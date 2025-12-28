import api from './request';

/**
 * 获取积分
 */
export const getCredits = () => {
  return api.get('/credits');
};

/**
 * 兑换积分
 */
export const redeemCode = (code) => {
  return api.post('/credits/redeem', { code });
};


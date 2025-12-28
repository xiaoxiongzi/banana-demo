import api from './request';

/**
 * 获取生成历史
 */
export const getHistory = (params) => {
  return api.get('/history', { params });
};

/**
 * 获取历史详情
 */
export const getHistoryDetail = (id) => {
  return api.get(`/history/${id}`);
};

/**
 * 删除历史记录
 */
export const deleteHistory = (id) => {
  return api.delete(`/history/${id}`);
};

/**
 * 获取统计信息
 */
export const getStats = () => {
  return api.get('/history/stats/summary');
};


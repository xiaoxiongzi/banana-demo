import { login, register, getProfile } from '@/api/auth';

const state = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token')
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    state.isAuthenticated = !!token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  CLEAR_AUTH(state) {
    state.token = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await login(credentials);
      if (response.success) {
        commit('SET_TOKEN', response.data.token);
        commit('user/SET_USER', response.data.user, { root: true });
        return response;
      }
      throw new Error(response.message || '登录失败');
    } catch (error) {
      throw error;
    }
  },
  
  async register({ commit }, userData) {
    try {
      const response = await register(userData);
      if (response.success) {
        commit('SET_TOKEN', response.data.token);
        commit('user/SET_USER', response.data.user, { root: true });
        return response;
      }
      throw new Error(response.message || '注册失败');
    } catch (error) {
      throw error;
    }
  },
  
  async fetchProfile({ commit }) {
    try {
      const response = await getProfile();
      if (response.success) {
        commit('user/SET_USER', response.data, { root: true });
        return response;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  },
  
  logout({ commit }) {
    commit('CLEAR_AUTH');
    commit('user/CLEAR_USER', null, { root: true });
  }
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  token: state => state.token
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};


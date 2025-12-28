const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  credits: 0
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.credits = user?.credits || 0;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  UPDATE_CREDITS(state, credits) {
    state.credits = credits;
    if (state.user) {
      state.user.credits = credits;
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  CLEAR_USER(state) {
    state.user = null;
    state.credits = 0;
    localStorage.removeItem('user');
  }
};

const actions = {
  updateCredits({ commit }, credits) {
    commit('UPDATE_CREDITS', credits);
  }
};

const getters = {
  user: state => state.user,
  credits: state => state.credits,
  username: state => state.user?.username || '',
  email: state => state.user?.email || ''
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};


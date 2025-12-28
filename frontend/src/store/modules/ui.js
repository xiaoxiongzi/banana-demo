const state = {
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info' // info, success, warning, error
  }
};

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SHOW_TOAST(state, { message, type = 'info' }) {
    state.toast = {
      show: true,
      message,
      type
    };
  },
  HIDE_TOAST(state) {
    state.toast.show = false;
  }
};

const actions = {
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading);
  },
  showToast({ commit }, payload) {
    commit('SHOW_TOAST', payload);
    setTimeout(() => {
      commit('HIDE_TOAST');
    }, 3000);
  },
  showSuccess({ dispatch }, message) {
    dispatch('showToast', { message, type: 'success' });
  },
  showError({ dispatch }, message) {
    dispatch('showToast', { message, type: 'error' });
  },
  showWarning({ dispatch }, message) {
    dispatch('showToast', { message, type: 'warning' });
  },
  showInfo({ dispatch }, message) {
    dispatch('showToast', { message, type: 'info' });
  }
};

const getters = {
  loading: state => state.loading,
  toast: state => state.toast
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};


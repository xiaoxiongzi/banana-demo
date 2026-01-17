const state = {
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info' // info, success, warning, error
  },
  authModal: {
    show: false,
    mode: 'login', // login, register
    redirect: null // 登录后重定向的路径
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
  },
  SHOW_AUTH_MODAL(state, { mode = 'login', redirect = null }) {
    state.authModal = {
      show: true,
      mode,
      redirect
    };
  },
  HIDE_AUTH_MODAL(state) {
    state.authModal.show = false;
    state.authModal.redirect = null;
  },
  SET_AUTH_MODAL_MODE(state, mode) {
    state.authModal.mode = mode;
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
  },
  showAuthModal({ commit }, payload = {}) {
    commit('SHOW_AUTH_MODAL', payload);
  },
  hideAuthModal({ commit }) {
    commit('HIDE_AUTH_MODAL');
  },
  setAuthModalMode({ commit }, mode) {
    commit('SET_AUTH_MODAL_MODE', mode);
  }
};

const getters = {
  loading: state => state.loading,
  toast: state => state.toast,
  authModal: state => state.authModal,
  showAuthModal: state => state.authModal.show,
  authModalMode: state => state.authModal.mode,
  authModalRedirect: state => state.authModal.redirect
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};


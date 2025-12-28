import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import user from './modules/user';
import generation from './modules/generation';
import ui from './modules/ui';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    user,
    generation,
    ui
  }
});


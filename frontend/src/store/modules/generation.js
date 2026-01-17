const state = {
  config: {
    model: 'banana',
    aspectRatio: '1:1',
    prompt: '',
    inputImages: []
  },
  result: null,
  isGenerating: false
};

const mutations = {
  SET_MODEL(state, model) {
    state.config.model = model;
  },
  SET_ASPECT_RATIO(state, aspectRatio) {
    state.config.aspectRatio = aspectRatio;
  },
  SET_PROMPT(state, prompt) {
    state.config.prompt = prompt;
  },
  SET_INPUT_IMAGES(state, images) {
    state.config.inputImages = images;
  },
  ADD_INPUT_IMAGE(state, image) {
    if (state.config.inputImages.length < 4) {
      state.config.inputImages.push(image);
    }
  },
  REMOVE_INPUT_IMAGE(state, index) {
    state.config.inputImages.splice(index, 1);
  },
  SET_RESULT(state, result) {
    state.result = result;
  },
  SET_GENERATING(state, isGenerating) {
    state.isGenerating = isGenerating;
  },
  RESET_CONFIG(state) {
    state.config = {
      model: 'banana',
      aspectRatio: '1:1',
      prompt: '',
      inputImages: []
    };
    state.result = null;
  }
};

const actions = {
  updateModel({ commit }, model) {
    commit('SET_MODEL', model);
  },
  updateAspectRatio({ commit }, aspectRatio) {
    commit('SET_ASPECT_RATIO', aspectRatio);
  },
  updatePrompt({ commit }, prompt) {
    commit('SET_PROMPT', prompt);
  },
  updateInputImages({ commit }, images) {
    commit('SET_INPUT_IMAGES', images);
  },
  addInputImage({ commit }, image) {
    commit('ADD_INPUT_IMAGE', image);
  },
  removeInputImage({ commit }, index) {
    commit('REMOVE_INPUT_IMAGE', index);
  },
  setResult({ commit }, result) {
    commit('SET_RESULT', result);
  },
  setGenerating({ commit }, isGenerating) {
    commit('SET_GENERATING', isGenerating);
  },
  resetConfig({ commit }) {
    commit('RESET_CONFIG');
  }
};

const getters = {
  config: state => state.config,
  result: state => state.result,
  isGenerating: state => state.isGenerating
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};


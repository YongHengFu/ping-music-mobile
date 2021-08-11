import { createStore } from 'vuex'
const store = createStore({
  state: {
    currIndex: 0,
    currTime: 0,
  },
  mutations: {
    setCurrIndex(state, value) {
      state.currIndex = value
    },
    setCurrTime(state, value) {
      state.currTime = value
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})

export default store

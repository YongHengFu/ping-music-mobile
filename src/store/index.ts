import { createStore } from 'vuex'
const store = createStore({
  state: {
    currIndex: 0,
    currTime: 0,
    orderList: [],
    randList: [],
    mode: 0 // 0:列表循环 1：顺序播放 2：随机播放 3：单曲循环
  },
  mutations: {
    setCurrIndex(state, value) {
      state.currIndex = value
    },
    setCurrTime(state, value) {
      state.currTime = value
    },
    setOrderList(state, value) {
      state.orderList = value
    },
    setRandList(state, value) {
      state.randList = value
    },
    setMode(state, value) {
      state.mode = value
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


const recommend = {
  state: JSON.parse(sessionStorage.getItem('recommend')) || {},

  mutations: {
    SET_RECOM: (state, recommend) => {
      Object.assign(state, recommend)
      state.time = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, '').replace(/\.[\d]{3}Z/, '')
      sessionStorage.setItem('recommend', JSON.stringify(state))
    }
  },
  actions: {
    setRecommend({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_RECOM', data)
      })
    }
  }
}

export default recommend

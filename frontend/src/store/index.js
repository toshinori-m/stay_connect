import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      currentUser: null
    }
  },
  mutations: {
    setUser(state, user) {
      state.currentUser = user
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        localStorage.removeItem('currentUser')
      }
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    loadUser({ commit }) {
      const user = localStorage.getItem('currentUser')
      if (user) {
        commit('setUser', JSON.parse(user))
      }
    },
    logout({ commit }) {
      commit('setUser', null)
    }
  },
  getters: {
    isUserLoggedIn: state => {
      return !!state.currentUser
    }
  }
})

export default store

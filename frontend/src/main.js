import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import './assets/main.css'
import { auth } from '@/plugins/firebase'

auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setUser', {
      name: user.displayName,
      email: user.email,
      uid: user.uid
    })
  } else {
    store.commit('setUser', null);
  }
})

const app = createApp(App).use(router).use(store)
const storedUser = localStorage.getItem('currentUser')
if (storedUser) {
  store.commit('setUser', JSON.parse(storedUser));
}

app.mount('#app')

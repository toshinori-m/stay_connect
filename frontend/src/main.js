import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import './assets/main.css'

const app = createApp(App).use(router).use(store)
const storedUser = localStorage.getItem('currentUser')
if (storedUser) {
  store.commit('setUser', JSON.parse(storedUser));
}

app.mount('#app')

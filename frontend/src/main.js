import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import './assets/main.css'
import ClickOutside from 'click-outside-vue3'

const app = createApp(App).use(router).use(store)
const storedUser = localStorage.getItem('currentUser')
if (storedUser) {
  store.commit('setUser', JSON.parse(storedUser));
}

app.directive('click-outside', ClickOutside)
app.mount('#app')

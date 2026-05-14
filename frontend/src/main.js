import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'

const hash = window.location.hash
if (hash && hash.includes('token=')) {
  const params = new URLSearchParams(hash.slice(1))
  const token   = params.get('token')
  const userRaw = params.get('user')
  if (token && userRaw) {
    try {
      const parsed = JSON.parse(userRaw)
      if (parsed && parsed.email) {
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('user', JSON.stringify(parsed))
        window.history.replaceState(null, '', window.location.pathname)
        window.location.reload()
      }
    } catch {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }
}

createApp(App).mount('#app')

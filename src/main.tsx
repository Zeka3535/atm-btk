import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { isDeviceEmbed } from './components/DeviceFrame'
import { setupPwaChrome } from './lib/pwa'
import './index.css'

/* До первого paint — стили One UI для iframe-макета */
if (isDeviceEmbed()) {
  document.documentElement.classList.add('device-embed')
}

/* Системный pull-to-refresh выкл. по умолчанию (настройка в Settings) */
if (localStorage.getItem('atm_pwa_block_system_refresh') !== '0') {
  document.documentElement.classList.add('block-system-refresh')
}

setupPwaChrome()
/* Сразу подхватываем новый билд — иначе Pages/PWA держат старый CSS (404 на hash) */
registerSW({
  immediate: true,
  onNeedRefresh() {
    window.location.reload()
  },
  onRegisteredSW(_url, registration) {
    registration?.update().catch(() => {})
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

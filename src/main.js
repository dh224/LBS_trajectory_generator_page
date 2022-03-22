import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#app')
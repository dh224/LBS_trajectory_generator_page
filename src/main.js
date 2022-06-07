import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'
import WebMap from '@arcgis/core/WebMap'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#app')
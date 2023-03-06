import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TreeView from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

createApp(App).use(store).use(router).use(TreeView).mount('#app')

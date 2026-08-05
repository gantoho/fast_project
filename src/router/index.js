import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Tools from '../pages/Tools.vue'
import Simple from '../pages/Simple.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Simple },
    { path: '/tools', name: 'tools', component: Tools },
    { path: '/advanced', name: 'advanced', component: Home }
  ]
})

export default router

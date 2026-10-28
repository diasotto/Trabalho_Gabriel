import { createRouter, createWebHistory } from '@ionic/vue-router'
import { onAuthStateChanged } from './services/auth'
import { auth } from './firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/welcome' },
    { path: '/login', component: () => import('./views/LoginPage.vue'), meta: { guestOnly: true } },
    { path: '/welcome', component: () => import('./views/WelcomePage.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('./views/ProfilePage.vue'), meta: { requiresAuth: true } },
  ],
})

let authReady: Promise<void> | null = null
function waitForAuth() {
  const currentAuth = auth
  if (!currentAuth) return Promise.resolve()
  if (!authReady) {
    authReady = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(currentAuth, () => {
        unsubscribe()
        resolve()
      })
    })
  }
  return authReady
}

router.beforeEach(async (to) => {
  const currentAuth = auth
  if (!currentAuth) return to.meta.requiresAuth ? '/login' : true
  await waitForAuth()
  if (to.meta.requiresAuth && !currentAuth.currentUser) return '/login'
  if (to.meta.guestOnly && currentAuth.currentUser) return '/welcome'
  return true
})

export default router

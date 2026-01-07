import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/q',
    name: 'QREntry',
    component: () => import('@/pages/public/QREntry.vue'),
    meta: { public: true },
  },
  {
    path: '/install',
    name: 'Install',
    component: () => import('@/pages/public/Install.vue'),
    meta: { public: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/public/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/otp',
    name: 'OTP',
    component: () => import('@/pages/public/OTP.vue'),
    meta: { public: true },
  },
  {
    path: '/staff',
    component: () => import('@/pages/staff/StaffLayout.vue'),
    meta: { role: 'STAFF' },
    children: [
      {
        path: '',
        redirect: '/staff/profiles',
      },
      {
        path: 'profiles',
        name: 'StaffProfiles',
        component: () => import('@/pages/staff/ProfilesList.vue'),
      },
      {
        path: 'profile/:id',
        name: 'StaffProfileDetail',
        component: () => import('@/pages/staff/ProfileDetail.vue'),
      },
      {
        path: 'records',
        name: 'StaffRecords',
        component: () => import('@/pages/staff/RecordsList.vue'),
      },
      {
        path: 'records/new',
        name: 'StaffRecordNew',
        component: () => import('@/pages/staff/RecordNew.vue'),
      },
      {
        path: 'tools/qr',
        name: 'StaffQR',
        component: () => import('@/pages/staff/QRCode.vue'),
      },
    ],
  },
  {
    path: '/hq',
    component: () => import('@/pages/hq/HQLayout.vue'),
    meta: { role: 'HQ' },
    children: [
      {
        path: '',
        redirect: '/hq/stores',
      },
      {
        path: 'stores',
        name: 'HQStores',
        component: () => import('@/pages/hq/Stores.vue'),
      },
      {
        path: 'services',
        name: 'HQServices',
        component: () => import('@/pages/hq/Services.vue'),
      },
      {
        path: 'packages',
        name: 'HQPackages',
        component: () => import('@/pages/hq/Packages.vue'),
      },
    ],
  },
  {
    path: '/customer',
    component: () => import('@/pages/customer/CustomerLayout.vue'),
    meta: { role: 'CUSTOMER' },
    children: [
      {
        path: '',
        redirect: '/customer/home',
      },
      {
        path: 'home',
        name: 'CustomerHome',
        component: () => import('@/pages/customer/Home.vue'),
      },
      {
        path: 'records',
        name: 'CustomerRecords',
        component: () => import('@/pages/customer/Records.vue'),
      },
      {
        path: 'ai',
        name: 'CustomerAI',
        component: () => import('@/pages/customer/AI.vue'),
      },
      {
        path: 'settings',
        name: 'CustomerSettings',
        component: () => import('@/pages/customer/Settings.vue'),
      },
    ],
  },
  {
    path: '/',
    redirect: '/q',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const isPublic = to.meta.public
  const requiredRole = to.meta.role

  // Only check auth once if not already checked
  if (!authStore.user && !isPublic && !authStore.loading) {
    await authStore.checkAuth()
  }

  // Allow public routes without auth
  if (isPublic) {
    next()
    return
  }

  // Redirect to login if not authenticated
  if (!authStore.user) {
    if (to.path !== '/q') {
      next('/q')
    } else {
      next()
    }
    return
  }

  // Check role-based access
  if (requiredRole && authStore.user?.role !== requiredRole) {
    const roleRoutes: Record<string, string> = {
      HQ: '/hq',
      STAFF: '/staff',
      CUSTOMER: '/customer/home',
    }
    const targetRoute = roleRoutes[authStore.user?.role || 'CUSTOMER']
    if (to.path !== targetRoute) {
      next(targetRoute)
    } else {
      next()
    }
    return
  }

  next()
})

export default router

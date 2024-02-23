const MainRoutes = {
  path: '/main',
  component: () => import('@/layouts/MainLayout.vue'),
  children: [
    {
      name: 'Landing Page',
      path: '/',
      component: () => import('@/views/Landing.vue')
    },
    {
      name: 'Error',
      path: '/404',
      component: () => import('@/views/Error.vue')
    },
    {
      name: 'Maintenance',
      path: '/maintenance',
      component: () => import('@/views/Maintenance.vue')
    },
    {
      name: 'Inscriptions',
      path: '/inscriptions',
      component: () => import('@/views/inscriptions/Inscriptions.vue')
    },
    {
      name: 'Inscription',
      path: '/inscription/:id',
      component: () => import('@/views/inscription/Inscription.vue')
    },
    {
      name: 'Address',
      path: '/address/:address',
      component: () => import('@/views/address/Address.vue')
    },
    {
      name: 'Ticker',
      path: '/ticker/:ticker',
      component: () => import('@/views/ticker/Ticker.vue')
    },
  ]
};

export default MainRoutes;

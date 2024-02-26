const MainRoutes = {
  path: '/main',
  component: () => import('@/layouts/MainLayout.vue'),
  children: [
    {
      name: 'Landing Page',
      path: '/',
      component: () => import('@/views/LandingPage.vue')
    },
    {
      name: 'Error',
      path: '/404',
      component: () => import('@/views/ErrorPage.vue')
    },
    {
      name: 'Maintenance',
      path: '/maintenance',
      component: () => import('@/views/MaintenancePage.vue')
    },
    {
      name: 'Inscriptions',
      path: '/inscriptions',
      component: () => import('@/views/inscriptions/InscriptionsPage.vue')
    },
    {
      name: 'Inscription',
      path: '/inscription/:id',
      component: () => import('@/views/inscription/InscriptionPage.vue')
    },
    {
      name: 'Address',
      path: '/address/:address',
      component: () => import('@/views/address/AddressPage.vue')
    },
    {
      name: 'Ticker',
      path: '/ticker/:ticker',
      component: () => import('@/views/ticker/TickerPage.vue')
    },
  ]
};

export default MainRoutes;

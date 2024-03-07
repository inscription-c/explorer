const DevRoutes = {
    path: '/dev',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        name: 'WalletDev',
        path: '/dev/wallet',
        component: () => import('@/views/dev/WalletDev.vue')
      },
    ]
};

export default DevRoutes;

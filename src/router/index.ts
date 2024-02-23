import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import DevRoutes from './DevRoutes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/Error.vue')
        },
        MainRoutes,
        DevRoutes,
    ]
});

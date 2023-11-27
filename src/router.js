import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Homepage.vue';
import Detail from './pages/MovieDetailPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Movie app - Home',
    }
  },
  {
    path: '/:id',
    name: 'movie-detail',
    component: Detail,
    meta: {
      title: 'Movie app - detail',
    }
}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
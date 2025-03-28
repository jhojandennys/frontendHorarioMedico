import { createRouter, createWebHistory } from 'vue-router';
import DoctorSchedule from '@/components/DoctorSchedule.vue';
import DoctorScheduleConfig from '@/components/DoctorScheduleConfig.vue';
import LoginPage from '../components/LoginPage.vue';

const routes = [
    { path: '/login', component: LoginPage },
  { path: '/', redirect: '/doctor' }, // Redirigir a la vista del doctor por defecto
  { path: '/doctor', component: DoctorSchedule },
  { path: '/admin', component: DoctorScheduleConfig }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

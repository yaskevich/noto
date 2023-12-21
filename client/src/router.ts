import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Schedule from './views/Schedule.vue';
import Journal from './views/Journal.vue';
import Persons from './views/Persons.vue';
import Person from './views/Person.vue';
import Cats from './views/Cats.vue';
import Note from './views/Note.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    alias: '/home/:id?',
    component: Home,
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule,
  },
  {
    path: '/journal',
    name: 'Journal',
    component: Journal,
  },
  {
    path: '/persons',
    name: 'Persons',
    component: Persons,
  },
  {
    path: '/cats',
    name: 'Cats',
    component: Cats,
  },
  {
    path: '/person/:id?',
    component: Person,
    name: 'Person',
    props: true,
  },
  {
    path: '/note/:id?',
    component: Note,
    name: 'Note',
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ './views/About.vue');
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;

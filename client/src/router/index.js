import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Deadlines from '../views/Deadlines.vue'
import Persons from '../views/Persons.vue'
import Person from '../views/Person.vue'
import Note from '../views/Note.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/deadlines',
    name: 'Deadlines',
    component: Deadlines
  },
  {
    path: '/persons',
    name: 'Persons',
    component: Persons
  },
  {
    path: '/person/:id?',
    component: Person,
    name: 'Person',
    props: true
  },
  {
    path: '/note/:id?',
    component: Note,
    name: 'Note',
    props: true
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

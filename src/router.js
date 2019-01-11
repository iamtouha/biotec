import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Bill from '@/components/transactions/Bill.vue'
import Payment from '@/components/transactions/Payment.vue'
import firebase from 'firebase'
import logIn from './views/Login.vue'
import register from './views/Registration.vue'
import CreateAcc from './views/CreateAcc.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('./views/Product.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }

  },
  {
    path: '/product/:edtId/edit',
    props: true,
    name: 'editProduct',
    component: () => import('./views/EditProduct.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: logIn,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/create/:refId',
    name: 'CreateAccount',
    component: CreateAcc,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addphoto',
    name: 'AddPhoto',
    component: () => import('./views/AddPicture.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/registration',
    name: 'registration',
    component: register,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('./views/Overview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('./views/Transactions.vue'),
    children: [{
      path: '',
      name: 'bill',
      props: true,
      component: Bill,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'payment',
      name: 'payment',
      props: true,
      component: Payment,
      meta: {
        requiresAuth: true
      }
    }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addproduct',
    name: 'AddProduct',
    component: () => import('./views/Addproduct.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addtransaction',
    name: 'AddTransaction',
    component: () => import('./views/Addtransaction.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

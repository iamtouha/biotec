import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

import db from '@/components/firebaseInit.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      email: null,
      name: null,
      post: null,
      imgUrl: null,
      temp: null
    },
    loader: false,
    products: [],
    company: 'Biotech Agrovet Ltd.'
  },
  getters: {
    loading: state => {
      return state.loader
    },
    productsInfo: state => {
      return state.products;
    },
    currentPage: state => {
      return state.currentpage;
    },
    userInfo: state => {
      return state.user;
    }
  },
  mutations: {
    setLoaderOn: state => {
      state.loader = true
    },
    setLoaderOff: state => {
      state.loader = false
    },
    setEmail: (state, payload) => {
      state.user.email = payload
    },
    setUserInfo: (state, payload) => {
      state.loader = true
      db.collection('user').where('email', '==', state.user.email).get().then((querySnapShot) => {
        querySnapShot.forEach(doc => {
          state.user.id = doc.id;
          state.user.name = doc.data().name;
          state.user.post = doc.data().post;
          state.user.imgUrl = doc.data().imageUrl;
        });
        db.collection("products")
          .where("ULed_by", "==", state.user.id).orderBy('time', 'desc')
          .get()
          .then(querySnapshot => {
            state.products = []
            querySnapshot.forEach(doc => {
              let img = doc.data().imageUrl ? doc.data().imageUrl : require('./assets/img/' + doc.data().type + '.svg')
              state.products.push({
                id: doc.id,
                name: doc.data().name,
                type: doc.data().type,
                pack: doc.data().pack,
                imgUrl: img
              });
              state.loader = false
              if (payload)
                router.push(payload);

            });
          })
          .catch(err => {
            alert(err)
            state.loader = false
          });
      })
    }
  },
  actions: {
    getEmail: (context, payload) => {
      context.commit('setEmail', payload)
    },
    getUserInfo: (context, payload) => {
      context.commit('setUserInfo', payload);

    },
    loadOn: context => {
      context.commit('setLoaderOn')
    },
    loadOff: context => {
      context.commit('setLoaderOff')
    }
  }
})

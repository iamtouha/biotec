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
      referance: null,
      company: 'Biotech Agrovat Ltd.'
    },
    approved: false,
    client: null,
    loader: false,
    products: [],
  },
  getters: {
    isApproved: state => {
      return state.approved
    },
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
    },
    clientType: state => {
      return state.client;
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
          const user = doc.data()
          state.user.id = doc.id;
          state.user.name = user.name;
          state.user.post = user.post;
          state.approved = user.approved;
          state.user.referance = user.refId;
          state.user.imgUrl = user.imageUrl;
          if (user.post == "Area Manager") {
            state.client = "Dealer";
          } else if (user.post == "Marketing Officer") {
            state.client = "Retailer";
          } else {
            state.client = "Undefined! something went wrong";
          }
        });
        db.collection("products")
          .where("ULed_by", "==", state.user.id).orderBy('time', 'desc')
          .get()
          .then(querySnapshot => {
            state.products = []
            if (querySnapShot.size) {
              querySnapshot.forEach(doc => {
                const product = doc.data()
                const imgDefault = product.imageUrl ? false : true
                const img = product.imageUrl ? product.imageUrl : require('./assets/img/' + product.type + '.svg')
                state.products.push({
                  id: doc.id,
                  name: product.name,
                  type: product.type,
                  pack: product.pack,
                  imgUrl: img,
                  imgDefault: imgDefault
                });

              });
            }
            state.loader = false
            if (payload) {
              router.push(payload);
            }
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

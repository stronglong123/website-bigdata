import Vue from 'vue'
import CreateAPI from 'vue-create-api'
import timeOutLogin from './timeOutLogin.vue'

Vue.use(CreateAPI,{
  apiPrefix:'$create-'
})

Vue.createAPI(timeOutLogin,true)
// Vue.createAPI(timeOutLogin,false)
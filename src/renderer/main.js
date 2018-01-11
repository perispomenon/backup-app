import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import VueBus from 'vue-bus'
import VueFlashMessage from 'vue-flash-message'

import App from './App'
import router from './router'
import store from './store'
import db from './datastore'

import 'bootstrap/dist/css/bootstrap.css'
import 'vue-flash-message/dist/vue-flash-message.min.css'

moment.locale('ru')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$db = db
Vue.use(VueBus)
Vue.use(VueFlashMessage)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

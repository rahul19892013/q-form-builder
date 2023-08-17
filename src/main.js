import Vue from 'vue'
import App from './App.vue'

import './styles/quasar.styl'
import moment from 'moment'
import 'quasar/dist/quasar.ie.polyfills'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import Quasar from 'quasar'
// import quasarOptions from './config/quasar.config.js'

Vue.use(
  Quasar,
  // quasarOptions,
  {
  config: {}
})

Vue.config.productionTip = false
Vue.filter('formatDate', function (value) {
  if (value) {
      return moment(String(value)).format('MM/DD/YYYY H:mm')
  }
})
new Vue({
  render: h => h(App)
}).$mount('#app')

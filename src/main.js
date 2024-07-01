import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);


Vue.prototype.uuid = function() {
            var t = new Date().getTime();
            return t
            
        }
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

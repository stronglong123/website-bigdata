import Vue from 'vue'
import Portal from './Portal.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({
    render: h => h(Portal),
}).$mount('#app')
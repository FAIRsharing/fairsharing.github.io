import '@mdi/font/css/materialdesignicons.css'
import "vuetify/dist/vuetify.min.css"

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify);
const opts = {
    icons: {
        iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    }
};
export default new Vuetify(opts)
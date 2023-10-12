import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import customBreakPoints from './breakPoints'
import customIcons from './icons'
import light from './theme'
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {light},
        options: {
            customProperties: true,
        },
    },
    icons: customIcons,
    breakpoint: customBreakPoints,
});


import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import light from './theme'
import customIcons from './icons'
import customBreakPoints from './breakPoints'
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


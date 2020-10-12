import Vue from 'vue';
import Vuetify from 'vuetify/lib';


// import colors from 'vuetify/lib/util/colors';
import light from './theme'
import customIcons from './icons'
import customBreakPoints from './breakPoints'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        // dark:true
        themes: {light},
        options: {
            customProperties: true,
        },
    },
    iconfont: 'faa',
    icons: customIcons,
    breakpoint: customBreakPoints,
});


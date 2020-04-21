import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const opts = {
    icons: {
        iconfont: "fa"
    },
    theme: {
        light: true,
        themes: {
            light: {
                secondary: "#2C3E50"
            },
            dark: {
                secondary: "#2C3E50"
            }
        }
    }
};

export default new Vuetify(opts);


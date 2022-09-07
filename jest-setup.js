import Vue from 'vue'
import Vuetify from 'vuetify'
import Particles from "particles.vue";

Vue.use(Particles);
Vue.use(Vuetify);

import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

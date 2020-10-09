import RESTClient from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import { initStateMessages, initUserDataState, validateToken } from "./utils.js"
import getUserQuery from "@/components/GraphClient/queries/getUserMeta.json"

let client = new RESTClient();
let graphClient = new GraphClient();


let currentCuratorInfo = {
    namespaced: true,
    state: {
        records: []
    },
    mutations: mutations,
    actions: actions,
    getters: {},
    modules: {}
};

export default currentCuratorInfo;

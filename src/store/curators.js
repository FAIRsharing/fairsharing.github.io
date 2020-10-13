import RESTClient from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import { initStateMessages, initUserDataState, validateToken } from "./utils.js"
import getUserQuery from "@/components/GraphClient/queries/getUserMeta.json"

let client = new RESTClient();
let graphClient = new GraphClient();


export const actions = {
    async fetchRecords(state, params) {
        //this.commit("records/setLoadingStatus", true);
        //this.commit("records/resetRecords");
        //this.commit("records/resetPages");
        if (Object.keys(params).length > 0) {
            recordsQuery.queryParam = params;
        }
        const data = await client.executeQuery(recordsQuery);
        //this.commit('records/setRecords', data["searchFairsharingRecords"]);
        //this.commit("records/setLoadingStatus", false);
    },
    resetRecords() {
        this.commit("records/resetRecords");
    },
};


let currentCuratorInfo = {
    namespaced: true,
    state: {
        records_pending_maint_req: [],
        records_in_curation: []
    },
    mutations: mutations,
    actions: actions,
    getters: {},
    modules: {}
};

export default currentCuratorInfo;

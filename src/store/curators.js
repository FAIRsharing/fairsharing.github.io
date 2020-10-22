import RESTClient from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import { initStateMessages, initUserDataState, validateToken } from "./utils.js"
import getUserQuery from "@/components/GraphClient/queries/getUserMeta.json"

let client = new RESTClient();
let graphClient = new GraphClient();


export const actions = {
    async fetchRecords(state, params) {
        await client.getUser();
        client.setHeader(client.user().credentials.token);
        let data = await client.executeQuery(getCurationRecords);
        state.records = data["curationSummary"];
        client.initalizeHeader();
    }
};


let curationSummary = {
    namespaced: true,
    state: {
        records
    },
    mutations: mutations,
    actions: actions,
    getters: getters,
    modules: {}
};

export default curationSummary ;

import queryMessages from "@/lib/GraphClient/queries/getMessages.json";
import GraphQLClient from "@/lib/GraphClient/GraphClient";
const graphClient = new GraphQLClient();

export const mutations = {
    setMessages(state, data) {
        state.publicMessages = data;
    },
    setLoadingStatus(state, status){
        state.isLoadingFilters = status;
    },
};
export const actions = {
    async setMessages() {
        this.commit("messages/setLoadingStatus", true);
        const messageData = await graphClient.executeQuery(queryMessages);
        this.commit('messages/setMessages', messageData.messages);
        this.commit("searchFilters/setLoadingStatus", false);
    },
};
let uiController = {
    namespaced: true,
    state: {
        publicMessages:[],
        loading:false
    },
    mutations: mutations,
    actions: actions
};
export default uiController;

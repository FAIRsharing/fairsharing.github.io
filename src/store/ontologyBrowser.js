import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordQuery from "@/lib/GraphClient/queries/ontologies/ontologyBrowser.json";
import ontologyQuery from "@/lib/GraphClient/queries/ontologies/subjectBrowser.json";

const CLIENT = new GraphClient(),
    RECORDS_QUERY = JSON.parse(JSON.stringify(recordQuery)),
    SUNBURST_ENTRY = {
        id: '0.0',
        parent: '',
        name: 'Subjects',
        ancestors: [],
        value: 1,
        descendants_count: null,
        records_count: null
    };

export const state = {
    tree: [],
    flattenedTree: [],
    records: [],
    error: false,
    loadingData: false,
    pagination: {
        perPage: 50,
        page: 1
    },
    sunburstData: [SUNBURST_ENTRY],
    activeTerms: [],
    selectedTerm: null,
    totalPages: 0,
    openedTerms: []
}

export const actions = {
    async fetchTerms({commit}) {
        commit("setLoadingData", true)
        const response = await CLIENT.executeQuery(ontologyQuery);
        commit("setTree", response['browseSubjects'].data)
        const {flattenedTree, sunburst} = processTree(response['browseSubjects'].data)
        commit("setFlattenedTree", flattenedTree)
        commit("addNodeToSunburst", sunburst)
        commit("setLoadingData", false)
    },
    async fetchRecords({commit, state}, subject) {
        commit("setLoadingData", true)
        RECORDS_QUERY.queryParam = {
            page: state.pagination.page,
            perPage: state.pagination.perPage,
            subjects: subject
        }
        let response = await CLIENT.executeQuery(RECORDS_QUERY)
        commit("setRecords", response.searchFairsharingRecords.records)
        commit("setTotalPages", response.searchFairsharingRecords.totalPages)
        commit("setLoadingData", false)
    },
    resetPagination({commit}) { commit('resetPagination')},
    async activateTerms({commit, state, dispatch}, term) {
        if (!term || state.activeTerms.includes(term.identifier)) {
            commit("resetActiveTerms")
            commit("resetSelectedTerm")
        }
        else {
            await dispatch("fetchRecords", term.name)
            commit("setActiveTerms", [term.identifier]);
            commit("setSelectedTerm", term)
        }
    },
    fetchNewPage({commit, dispatch, state}, offset) {
        commit("setCurrentPage", state.pagination.page + offset)
        dispatch("fetchRecords", state.selectedTerm.name)
    },
    changePerPage({commit, dispatch, state}, perPage) {
        commit("setCurrentPage", 1)
        commit("setPerPage", perPage)
        dispatch("fetchRecords", state.selectedTerm.name)
    },
    openTerms({commit}, tabs) { commit("setOpenedTerms", tabs) },
    leavePage({commit}) {
        commit('resetTree');
        commit('resetFlattenedTree');
        commit('resetRecords');
        commit('resetPagination');
        commit('resetActiveTerms');
        commit('resetSelectedTerm');
        commit("resetSunburstData");
        commit("setOpenedTerms", [])
    }
}

export const mutations = {
    setTree(state, tree) { state.tree = tree },
    resetTree(state) { state.tree = [] },
    setFlattenedTree(state, tree) { state.flattenedTree = tree },
    resetFlattenedTree(state) { state.flattenedTree = [] },
    setRecords(state, records) { state.records = records },
    resetRecords(state) { state.records= [] },
    setLoadingData(state, loading) { state.loadingData = loading},
    setCurrentPage(state, currentPage) { state.pagination.page = currentPage },
    setPerPage(state, perPage) { state.pagination.perPage = perPage },
    resetPagination(state) { state.pagination = { page: 1, perPage: 50 }},
    addNodeToSunburst(state, nodeList) { state.sunburstData = state.sunburstData.concat(nodeList) },
    resetSunburstData(state) { state.sunburstData = [SUNBURST_ENTRY] },
    setActiveTerms(state, terms){ state.activeTerms = terms},
    resetActiveTerms(state){ state.activeTerms = []},
    setSelectedTerm(state, term) { state.selectedTerm = term},
    resetSelectedTerm(state){ state.selectedTerm = null },
    setTotalPages(state, totalPages){ state.totalPages = totalPages},
    setOpenedTerms(state, open){ state.openedTerms = open }
}

export const getters = {
    getAncestors: (state) => (value, field = "id", target = "identifier") => {
        let ancestors = []
        state.flattenedTree.filter(obj => obj[target] === value).forEach(node => {
            node.ancestors.forEach(ancestorID => {
                state.flattenedTree.filter(obj => obj.identifier === ancestorID).forEach(ancestor => {
                    ancestors.push(ancestor[field])
                })
            })
        })
        return [... new Set(ancestors)];
    },
    getCurrentPage: (state) => { return state.pagination.page },
    getPerPage: (state) => { return state.pagination.perPage },
}

export const processTree = function(
    tree,
    ancestors = [],
    flattenedTree = [],
    parent = "0.0",
    sunburst = []
) {
    for (const term of tree) {
        term.identifier = term.id;
        term.id = ancestors.join('') + " - " + term.name
        const newNode = {
            name: term.name,
            descendants_count: term.descendants_count || 0,
            records_count: term.records_count || 0,
            ancestors: ancestors,
            parent: parent,
            value: 1,
            identifier: term.identifier,
            id: term.id,
            description: term.description
        }
        if (term.name.toLowerCase() !== "subject agnostic") sunburst.push(newNode)
        flattenedTree.push({
            id: term.id,
            identifier: term.identifier,
            name: term.name,
            ancestors: ancestors,
            description: term.description,
            descendants_count: term.descendants_count || 0,
            records_count: term.records_count || 0
        })
        /* istanbul ignore else */
        if (term.children) {
            const newAncestors = ancestors.concat([term.identifier])
            processTree(term.children, newAncestors, flattenedTree, newNode.id, sunburst)
        }
    }
    return {flattenedTree, sunburst}
}

const ontologyBrowser = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}

export default ontologyBrowser

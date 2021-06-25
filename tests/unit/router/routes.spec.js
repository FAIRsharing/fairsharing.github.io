import router, {afterEach} from "@/router"
import { beforeEach, isLoggedIn, isMaintenanceMode } from "@/router"
import RestClient from "@/lib/Client/RESTClient.js"
//import VueRouter from "vue-router";
const sinon = require("sinon");

/*
const testrouter = new VueRouter(),
    $testrouter = { push: jest.fn() };
const $route = {
    path: '/some/path'
}
 */


let store = {
    state: {
        users: {
            user: function(){return {isLoggedIn: true}}
        },
        introspection: {
            maintenanceMode: false
        }
    },
    dispatch: jest.fn()
};

let restStub;

describe("Routes", () => {

    beforeAll(() => {
        window.scrollTo = jest.fn();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                success: true
            }
        })
    });
    afterAll(() => {
        restStub.restore();
    });

    it("routing variables are correctly set", () => {

        const beforeEachTester = [
            "User", "Edit profile", "New_content", "Edit Content", "Curator", "Maintenance"
        ];

        router.options.routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
            if (beforeEachTester.indexOf(route.name) > -1){
                const next = jest.fn();
                route.beforeEnter({path: {}}, undefined, next);
            }
        });
    });
    it ("- NAVGUARD - redirect if the user is not logged in", async () => {
        const next = jest.fn();
        await isLoggedIn(undefined, undefined, next, store);
        expect(next).toHaveBeenCalled();
    });

    it("Can set a correct title", async () => {
        let to = {
            meta: { title: "ABC" }
        };
        const next = jest.fn();
        await beforeEach(to, undefined, next, store);
        expect(document.title).toMatch("FAIRsharing | ABC");

        to.meta = {};
        store = {
            state: {
                users: {
                    user: function(){return {isLoggedIn: false}}
                },
                introspection: {
                    maintenanceMode: false
                }
            },
            dispatch: jest.fn()
        };
        await beforeEach(to, undefined, next, store);
        expect(document.title).toMatch("FAIRsharing");
        store.state.introspection.maintenanceMode = true;
        await beforeEach(to, undefined, next, store);
        expect(next).toHaveBeenCalledWith({path: "maintenance"})
        await afterEach({name:'Records'});
        await afterEach({name:'Record'});
    });

    it("can check is a site is in maintenance mode", () => {
        store = {
            state: {
                introspection: {
                    maintenanceMode: true
                }
            }
        };
        const next = jest.fn();
        isMaintenanceMode(undefined, undefined, next, store);
        expect(next).toHaveBeenCalledWith();
    })

    it("performs harcoded redirections correctly", () => {
        let article = router.options.routes.find((obj) => { return obj.name === 'article'} );
        expect(article.redirect(
            {params: {name: 'live_list_standards_in_policies'}})
        ).toStrictEqual(
            {"name":"search","query":{"fairsharingRegistry":"Standard","isRecommended":true,"page":1}}
        );
        expect(article.redirect(
            {params: {name: 'live_list_databases_in_policies'}})
        ).toStrictEqual(
            {"name":"search","query":{"fairsharingRegistry":"Database","isRecommended":true,"page":1}}
        );
        expect(article.redirect(
            {params: {name: 'live_list_journal_policies'}})
        ).toStrictEqual(
            {"name":"search","query":{"fairsharingRegistry":"Policy","recordType":"journal","page":1}}
        );
        expect(article.redirect(
            {params: {name: 'dingdong'}})
        ).toStrictEqual(
            {"path":"/"}
        );

        let ontology = router.options.routes.find((obj) => { return obj.name === 'ontology'} );
        expect(ontology.redirect(
            {params: {name: 'SRAO'}})
        ).toStrictEqual(
            {"path":"https://github.com/FAIRsharing/subject-ontology"}
        );
        expect(ontology.redirect(
            {params: {name: 'DRAO'}})
        ).toStrictEqual(
            {"path":"https://github.com/FAIRsharing/domain-ontology"}
        );
        expect(ontology.redirect(
            {params: {name: 'dingdong'}})
        ).toStrictEqual(
            {"path":"/"}
        );

    });

});

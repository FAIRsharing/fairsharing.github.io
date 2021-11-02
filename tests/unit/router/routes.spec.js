import router, {afterEach, scrollBehavior, isSuperCurator, isNotLoggedIn} from "@/router"
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
            user: function(){return {isLoggedIn: true,is_super_curator: true}}
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
            "User", "Edit profile", "New_content", "Edit Content", "Curator", "Maintenance", "EditPublicProfile","UsersList","Login","Register","Record"
        ];

        router.options.routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
            if (beforeEachTester.indexOf(route.name) > -1){
                const next = jest.fn();
                route.beforeEnter({path: {}}, undefined, next);
                route.beforeEnter({path: '/1/'}, undefined, next);
                expect(next).toHaveBeenCalled();
            }
        });
    });
    it ("- NAVGUARD - redirect if the user is not logged in", async () => {
        const next = jest.fn();
        await isLoggedIn(undefined, undefined, next, store);
        await isNotLoggedIn(undefined, undefined, next, store);
        await isSuperCurator(undefined, undefined, next, store);
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
                    user: function(){return {isLoggedIn: false, is_super_curator: true}}
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

    it("can check scrollBehavior", () => {
        expect(scrollBehavior({hash:'#anchorLink'})).toStrictEqual({selector:"#anchorLink"})
        expect(scrollBehavior({})).toBe(false)
    })

    it("performs harcoded record redirections correctly", async () => {
        // Records for articles
        let article = router.options.routes.find((obj) => {
            return obj.name === 'article'
        });
        expect(article.redirect(
            {params: {name: 'live_list_standards_in_policies'}})
        ).toStrictEqual(
            {"name": "search", "query": {"fairsharingRegistry": "Standard", "isRecommended": true, "page": 1}}
        );
        expect(article.redirect(
            {params: {name: 'live_list_databases_in_policies'}})
        ).toStrictEqual(
            {"name": "search", "query": {"fairsharingRegistry": "Database", "isRecommended": true, "page": 1}}
        );
        expect(article.redirect(
            {params: {name: 'live_list_journal_policies'}})
        ).toStrictEqual(
            {"name": "search", "query": {"fairsharingRegistry": "Policy", "recordType": "journal", "page": 1}}
        );
        expect(article.redirect(
            {params: {name: 'dingdong'}})
        ).toStrictEqual(
            {"path": "/"}
        );

    });

    it("performs harcoded ontology redirections correctly", async () => {
        let assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };
        let ontology = router.options.routes.find((obj) => { return obj.name === 'ontology'} );
        await ontology.redirect({params: {name: 'SRAO'}});
        expect(window.location.assign).toHaveBeenCalledWith('https://github.com/FAIRsharing/subject-ontology');
        await ontology.redirect({params: {name: 'DRAO'}});
        expect(window.location.assign).toHaveBeenCalledWith('https://github.com/FAIRsharing/domain-ontology');
        expect(ontology.redirect(
            {params: {name: 'dingdong'}})
        ).toStrictEqual(
            {"path":"/"}
        );

    });

    it("gets sitemap from the api", async () => {
        process.env.VUE_APP_API_ENDPOINT = 'https://api.fairsharing.org'
        let assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };
        let sitemap = router.options.routes.find((obj) => { return obj.name === 'sitemap'} );
        await sitemap.redirect();
        // process.env.VUE_APP_API_ENDPOINT
        expect(window.location.assign).toHaveBeenCalledWith( process.env.VUE_APP_API_ENDPOINT + '/sitemap.xml.gz');

    });

    it ("- NAVGUARD - not let logged in User to access some pages like login and signup ", async () => {
        const next = jest.fn();
        store = {
            state: {
                users: {
                    user: function(){return {isLoggedIn: false,is_super_curator: true}}
                },
                introspection: {
                    maintenanceMode: false
                }
            },
            dispatch: jest.fn()
        };
        await isNotLoggedIn(undefined, undefined, next, store);

        expect(next).toHaveBeenCalled();
    });

});

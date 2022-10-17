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
            "User", "Edit profile", "New_content", "Edit Content", "Curator", "Maintenance", "EditPublicProfile","UsersList","Login","Register"
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
        // Those below are from #1865
        let hupopsi = router.options.routes.find((obj) => {
            return obj.name === 'hupopsi'
        });
        expect(hupopsi.redirect).toEqual( "/HUPO-PSI");
        let communities_activities = router.options.routes.find((obj) => {
            return obj.name === 'communities_activities'
        });
        expect(communities_activities.redirect).toEqual( "/communities#activities");
        let licence_with_s = router.options.routes.find((obj) => {
            return obj.name === 'licence_with_s'
        });
        expect(licence_with_s.redirect).toEqual( "/licence");
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
        let raw_srao_file = router.options.routes.find((obj) => { return obj.name === 'raw_srao_file'} );
        await raw_srao_file.redirect();
        expect(window.location.assign).toHaveBeenCalledWith('https://github.com/FAIRsharing/subject-ontology/raw/master/releases/SRAO.owl');
        let raw_srao_file_by_version = router.options.routes.find((obj) => { return obj.name === 'raw_srao_file_by_version'} );
        await raw_srao_file_by_version.redirect();
        expect(window.location.assign).toHaveBeenCalledWith('https://github.com/FAIRsharing/subject-ontology/raw/master/releases/0.3.0/SRAO.owl');
        let srao_term = router.options.routes.find((obj) => { return obj.name === 'srao_term'} );
        await srao_term.redirect({params: {id: 'SRAO_0000307'}});
        expect(window.location.assign).toHaveBeenCalledWith('https://www.ebi.ac.uk/ols/ontologies/srao/terms?iri=http://www.fairsharing.org/ontology/subject/SRAO_0000307');
        let old_recommendations = router.options.routes.find((obj) => {
            return obj.name === 'old_recommendations'
        });
        await old_recommendations.redirect();
        expect(window.location.assign).toHaveBeenCalledWith(
            '/search?isRecommended=true&page=1&searchAnd=false&fairsharingRegistry=database,standard'
        );
    });

    // See #1865.
    it("performs hardcoded registry/type redirections correctly", async () => {
        let link;
        let assignMock = jest.fn();
        delete window.location;
        window.location = {assign: assignMock};
        const redirections = {
            old_databases_repository: '/search?fairsharingRegistry=Database&recordType=repository&page=1',
            old_databases_knowledgebase: '/search?fairsharingRegistry=Database&recordType=knowledgebase&page=1',
            old_databases_knowledgebase_and_repsitory: '/search?fairsharingRegistry=Database&recordType=knowledgebase_and_repository&page=1',
            old_standards_model_and_format: '/search?fairsharingRegistry=Standard&recordType=model_and_format&page=1',
            old_standards_metric: '/search?fairsharingRegistry=Standard&recordType=metric&page=1',
            old_standards_terminology_artefact: '/search?fairsharingRegistry=Standard&recordType=terminology_artefact&page=1',
            old_standards_reporting_guidelines: '/search?fairsharingRegistry=Standard&recordType=reporting_guideline&page=1',
            old_standards_identifier_schema: '/search?fairsharingRegistry=Standard&recordType=identifier_schema&page=1',
            old_policies_project: '/search?fairsharingRegistry=Policy&recordType=project&page=1',
            old_policies_journal: '/search?fairsharingRegistry=Policy&recordType=journal&page=1',
            old_policies_institution: '/search?fairsharingRegistry=Policy&recordType=institution&page=1',
            old_policies_society: '/search?fairsharingRegistry=Policy&recordType=society&page=1',
            old_policies_journal_publisher: '/search?fairsharingRegistry=Policy&recordType=journal_publisher&page=1',
            old_policies_funder: '/search?fairsharingRegistry=Policy&recordType=funder&page=1'
        }

        // eslint-disable no-promise-executor-return
        Object.keys(redirections).forEach(async (goto) => {
            link = router.options.routes.find((obj) => {
                return obj.name === goto;
            });
            await link.redirect();
            expect(window.location.assign).toHaveBeenCalledWith(redirections[goto]);
        });
        // eslint-enable no-promise-executor-return

    });



    it("gets sitemap from the api", async () => {
        process.env.VUE_APP_API_ENDPOINT = 'https://api.fairsharing.org'
        let assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };
        let sitemap = router.options.routes.find((obj) => { return obj.name === 'sitemap'} );
        await sitemap.redirect();
        // process.env.VUE_APP_API_ENDPOINT
        expect(window.location.assign).toHaveBeenCalledWith( process.env.VUE_APP_API_ENDPOINT + '/sitemap.xml');

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

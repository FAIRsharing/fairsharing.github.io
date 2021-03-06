import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'

import {
    Home,
    NotFound,
    Record,
    Records,
    New,
    NewRecord,
    Editor,
    Login,
    Signup,
    ConfirmAccount,
    ResendConfirmation,
    User,
    Curator,
    RequestNewPassword,
    ResetPassword,
    EditProfile,
    OauthLogin,
    Organisation,
    LoginFailure,
    Stat,
    Community,
    Stakeholders,
    Timeline,
    Licence,
    Terms,
    Educational,
    Privacy,
    PublicProfile,
    Graph,
    Maintenance,
    APIDoc,
    EditPublicProfile,
    UsersList
}
    from "./routes.js"

Vue.use(VueRouter);

let routes = [
    {
        name: "Home",
        path: "/",
        component: Home,

    },
    {
        name: "Graph",
        path: "/graph/:id",
        component: Graph,

    },
    {
        name: "Standards",
        path: "/standards",
        component: Records,
    },
    {
        name: "Databases",
        path: "/databases",
        component: Records,

    },
    {
        name: "Policies",
        path: "/policies",
        component: Records,

    },
    {
        name: "Collections",
        path: "/collections",
        component: Records,

    },
    {
        name: "search",
        path: "/search",
        component: Records,

    },
    {
        name: "Organisation",
        path: "/organisations/:id",
        component: Organisation
    },

    /* VARIOUS REDIRECTIONS */
    {
        name: 'article',
        path: '/article/:name',
        redirect: to => {
            if (to.params.name === 'live_list_standards_in_policies') {
                return {
                    name: 'search',
                    query: { fairsharingRegistry: 'Standard', isRecommended: true, page: 1 }

                }
            }
            else if (to.params.name === 'live_list_databases_in_policies') {
                return {
                    name: 'search',
                    query: { fairsharingRegistry: 'Database', isRecommended: true, page: 1 }
                }
            }
            else if (to.params.name === 'live_list_journal_policies') {
                return {
                    name: 'search',
                    query: { fairsharingRegistry: 'Policy', recordType: 'journal', page: 1 }
                }
            }
            else {
                return { path: '/' }
            }
        }
    },
    {
        name: 'ontology',
        path: '/ontology/:name',
        redirect: to => {
            if (to.params.name.toLowerCase() === 'srao') {
                window.location.assign('https://github.com/FAIRsharing/subject-ontology');
            }
            else if (to.params.name.toLowerCase() === 'drao') {
                window.location.assign('https://github.com/FAIRsharing/domain-ontology');
            }
            else {
                return { path: '/' }
            }
        }
    },



    /* OTHER MODES */
    {
        name: "Maintenance",
        path: "/maintenance",
        component: Maintenance,
        beforeEnter(to, from, next) {
            isMaintenanceMode(to, from, next, store);
        }
    },

    /* CREATION */
    {
        name: "New_content",
        path: "/create",
        component: NewRecord,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
        }
    },

    /* Static pages */
    {
        name: "New",
        path: "/new",
        component: New,
    },
    {
        name: "Statistics",
        path: "/summary-statistics",
        component: Stat,
    },
    {
        name: "Communities",
        path: "/communities",
        component: Community,
    },
    {
        name: "Stakeholders",
        path: "/stakeholders",
        component: Stakeholders,
    },
    {
        name: "Timeline",
        path: "/timeline",
        component: Timeline,
    },
    {
        name: "License",
        path: "/license",
        component: Licence,
    },
    {
        name: "Terms_of_use",
        path: "/terms",
        component: Terms,
    },
    {
        name: "Educational",
        path: "/educational",
        component: Educational,
    },
    {
        name: "Privacy",
        path: "/privacy",
        component: Privacy,
    },
    {
        name: "API Documentation",
        path: "/API_doc",
        component: APIDoc,
    },

    // AUTHENTICATION AND USERS
    {
        name: "OAuth Login",
        path: "/login_success",
        component: OauthLogin
    },
    {
        name: "OAuth Login Failure",
        path: "/login_failure",
        component: LoginFailure
    },
    {
        name: "Login",
        path: "/accounts/login",
        component: Login,
        beforeEnter(to, from, next) {
            isNotLoggedIn(to, from, next, store);
        }
    },
    {
        name: "Register",
        path: "/accounts/signup",
        component: Signup,
        beforeEnter(to, from, next) {
            isNotLoggedIn(to, from, next, store);
        }
    },
    {
        name: "Confirm email",
        path: "/users/confirmation",
        component: ConfirmAccount,
    },
    {
        name: "Resend confirmation email",
        path: "/users/resendConfirmation",
        component: ResendConfirmation,
    },
    {
        name: "Request a new password",
        path: "/accounts/forgotPassword",
        component: RequestNewPassword,
    },
    {
        name: "Reset your password",
        path: "/users/password/edit",
        component: ResetPassword
    },
    {
        name: "User",
        path: "/accounts/profile",
        component: User,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
        }
    },
    {
        name: "PublicProfile",
        path: "/users/:id",
        component: PublicProfile
    },
    {
        name: "Edit profile",
        path: "/profiles/edit",
        component: EditProfile,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
        }
    },
    {
        name: "EditPublicProfile",
        path: "/profiles/editPublicProfile/:id",
        component: EditPublicProfile,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
            isSuperCurator(to, from, next, store);
        }
    },
    {
        name: "UsersList",
        path: "/profiles/usersList",
        component: UsersList,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
            isSuperCurator(to, from, next, store);
        }
    },
    // CURATORS
    {
        name: "Curator",
        path: "/curator",
        component: Curator,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
            // isCurator(to, from, next, store);
        }
    },
    /*
    Careful, this has to be the very last base path  !!!!
    This component"s page title is handled in the component itself as it needs the :id param
    */
    {
        name: "Edit Content",
        path: "/:id/edit",
        component: Editor,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
        }
    },
    /* To enable old links to collections to work */
    {
        name: "CollectionRecord",
        path: "/collection/:id",
        redirect: "/:id"
    },
    {
        name: "RecordByDoi",
        path: "/10.25504/:id",
        component: Record
    },
    {
        name: "Record",
        path: "/:id",
        component: Record
    },
    /* ERROR HANDLING */
    {
        name: "Error 404",
        path: "/error/404",
        component: NotFound
    },
    /* REDIRECTION */
    {
        name: "*",
        path: "*/*",
        component: NotFound
    }
];
routes.forEach(function (route) {
    if (route.name !== "Record") {
        route.meta = {
            title: route.name.replace(/_/g, " ")
        }
    }
});

export async function afterEach(to) {
    if (to.name !== "Record") {
        window.scrollTo(0,0);
    }
}

const router = new VueRouter({
    routes,
    scrollBehavior
    // mode: "history"
});

export function scrollBehavior(to) {
    if (to.hash) {
        return {selector: to.hash}
    }
    return false
}

export async function beforeEach(to, from, next, store) {
    if (to.path !== '/maintenance' && store.state.introspection.maintenanceMode) {
        next({path: "maintenance"});
    }
    document.title = (to.meta.title !== undefined) ? "FAIRsharing | " + to.meta.title : "FAIRsharing";
    if (store.state.users.user().isLoggedIn){
        await store.dispatch('users/validateUserToken');
    }
    next();

}

export function isLoggedIn(to, from, next, store) {
    if (store.state.users.user().isLoggedIn) {
        next()
    }
    else {
        const target = to.path;
        next({
            name: "Login", // back to safety route //
            query: {goTo: target}
        });
    }
}

export function isNotLoggedIn(to, from, next, store) {
    if (!store.state.users.user().isLoggedIn) {
        next()
    }
    else {
        next(from);
    }
}

export function isSuperCurator(to, from, next, store) {
    if (store.state.users.user().is_super_curator) {
        next()
    }
    else {
        const target = to.path;
        next({
            name: "Login", // back to safety route //
            query: {goTo: target}
        });
    }
}

export function isMaintenanceMode(to, from, next, store){
    if (!store.state.introspection.maintenanceMode) {
        next(from);
    }
    next();
}

export default router;

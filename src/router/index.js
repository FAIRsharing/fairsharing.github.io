import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'

import { Home, NotFound, Record, Records, NewRecord, Editor, Login, Signup, ConfirmAccount, ResendConfirmation, User,
    Curator, RequestNewPassword, ResetPassword, EditProfile, OauthLogin, Organisation, LoginFailure, Stat, Community,
    Stakeholders, Timeline, License, Terms, Educational, Privacy, PublicProfile, Graph, Maintenance, APIDoc }
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
        path: "/new",
        component: NewRecord,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
        }
    },

    /* Static pages */
    {
        name: "Statistics",
        path: "/summary-statistics",
        component: Stat,
    },
    {
        name: "Community",
        path: "/community",
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
        component: License,
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
    },
    {
        name: "Register",
        path: "/accounts/signup",
        component: Signup,
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

export async function afterEach() {
    window.scrollTo(0,0);
}

const router = new VueRouter({
    routes,
    // mode: "history"
});

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

export function isMaintenanceMode(to, from, next, store){
    if (!store.state.introspection.maintenanceMode) {
        next(from);
    }
    next();
}

export default router;

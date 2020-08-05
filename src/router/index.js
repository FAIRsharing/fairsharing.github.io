/*
Separate routing handle to avoid a big main.js
*/

import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'

import Home from "@/views/Home/Home";
import Login from "@/views/Users/Login/Login";
import Signup from "@/views/Users/Signup";
/*
import Records from "@/views/Records/Records";
import Record from "@/views/Records/Record";
*/
import Statistics from "@/views/Stats/Statistics";
import New from "@/views/CreateRecord/NewRecord";
import Community from "@/views/Static/Community/Community";
import Stakeholders from "@/views/Static/Stakeholders/Stakeholders";
import Timeline from "@/views/Static/Timeline/Timeline";
import License from "@/views/Static/License/License";
import Terms from "@/views/Static/TermOfUse/TermsOfUse";
import Educational from "@/views/Static/Educational/Educational";
import Privacy from "@/views/Static/Privacy/Privacy";
import ConfirmAccount from "@/views/Users/ConfirmAccount.vue"
import User from "@/views/Users/User.vue"
import RequestNewPassword from "@/views/Users/RequestNewPassword";
import ResetPassword from "@/views/Users/ResetPassword";
import EditProfile from "@/views/Users/EditProfile";
import OauthLogin from "@/views/Users/Login/OauthLogin.vue";
import LoginFailure from "@/views/Users/Login/LoginFailure";
import Editor from "@/views/CreateRecord/Editor";
/*new routes*/
import Records from "@/views/Records/Records";
import Record from "@/views/Records/Record";

Vue.use(VueRouter);

let routes = [
    {
        name: "Home",
        path: "/",
        component: Home,

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

    /* CREATION */
    {
        name: "New_content",
        path: "/new",
        component: New,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
        }
    },

    /* Static pages */
    {
        name: "Statistics",
        path: "/summary-statistics",
        component: Statistics,
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
        name: "Edit profile",
        path: "/profiles/edit",
        component: EditProfile,
        beforeEnter(to, from, next) {
            isLoggedIn(to, from, next, store);
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
    {
        name: "Record",
        path: "/:id",
        component: Record
    },
    {
        name: "*",
        path: "*/*",
        redirect: "/"
    }
];
routes.forEach(function (route) {
    if (route.name !== "Record") {
        route.meta = {
            title: route.name.replace(/_/g, " ")
        }
    }
});

const router = new VueRouter({
    routes,
    //mode: "history"
});

export function beforeEach(to, from, next) {
    document.title = (to.meta.title !== undefined) ? "FAIRsharing | " + to.meta.title : "FAIRsharing";
    next()
}

export function isLoggedIn(to, from, next, store) {
    if (store.state.users.user().isLoggedIn) {
        next()
    }
    else {
        next({
            name: "Login" // back to safety route //
        });
    }
}

/*
export function canEdit(to, from, next, store){
    if (!store.state.users.user().isLoggedIn) {
        next({
            name: "Login" // back to safety route //
        });
    }
    else {
        // implement canEdit here. If can edit go next() else create a cant edit page/error message.
        next();
    }
}
*/

export default router;

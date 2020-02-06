/*
Separate routing handle to avoid a big main.js
*/

import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home/Home";
import Login from "../views/Users/Login";
import Signup from "../views/Users/Signup";
import Records from "../views/Records/Records";
import Record from "../views/Records/Record";
import Statistics from "../views/Stats/Statistics";
import New from "../views/CreateRecord/NewRecordPage";
import NewStandard from "../views/CreateRecord/NewStandard";
import NewDatabase from "../views/CreateRecord/NewDatabase";
import NewPolicy from "../views/CreateRecord/NewPolicy";
import NewCollection from "../views/CreateRecord/NewCollection";
import Community from "../views/Static/Community/Community";
import Stakeholders from "../views/Static/Stakeholders/Stakeholders";
import Timeline from "../views/Static/Timeline/Timeline";
import License from "../views/Static/License/License";
import Terms from "../views/Static/TermOfUse/TermsOfUse";
import Educational from "../views/Static/Educational/Educational";
import Privacy from "../views/Static/Privacy/Privacy";

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
    },
    {
        name: "New_standard",
        path: "/new/standard",
        component: NewStandard,
    },
    {
        name: "New_database",
        path: "/new/database",
        component: NewDatabase,
    },
    {
        name: "New_policy",
        path: "/new/policy",
        component: NewPolicy,
    },
    {
        name: "New_collection",
        path: "/new/collection",
        component: NewCollection,
    },
    {
        name: "Statistics",
        path: "/summary-statistics",
        component: Statistics,
    },

    /* Static pages */
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

    /*
    Careful, this has to be the very last base path  !!!!
    This component"s page title is handled in the component itself as it needs the :id param
    */
    {
        name: "Record",
        path: "/:id",
        component: Record
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
        name: "*",
        path: "*/*",
        redirect: "/"
    }

    // We should have extra routes to redirect /standards ... to search?fairsharingRegistry=standard
    // Then change the method to get the title: if there's fairsharingRegistry URL param, set the new page title;

];
routes.forEach(function(route){
    if (route.name !== "Record"){
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

export default router;
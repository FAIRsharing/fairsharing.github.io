/*
Separate routing handle to avoid a big main.js
*/

import Home from "../pages/Home/Home";
import Login from "../pages/Users/Login";
import Signup from "../pages/Users/Signup";
import Records from "../pages/Search/Records";
import Record from "../pages/Search/Record";
import Statistics from "../pages/Stats/Statistics";
import New from "../pages/CreateRecord/NewRecordPage";
import NewStandard from "../pages/CreateRecord/NewStandard";
import NewDatabase from "../pages/CreateRecord/NewDatabase";
import NewPolicy from "../pages/CreateRecord/NewPolicy";
import NewCollection from "../pages/CreateRecord/NewCollection";
import Community from "../pages/Static/Community/Community";
import Stakeholders from "../pages/Static/Stakeholders/Stakeholders";
import Timeline from "../pages/Static/Timeline/Timeline";
import License from "../pages/Static/License/License";
import Terms from "../pages/Static/TermOfUse/TermsOfUse";
import Educational from "../pages/Static/Educational/Educational";
import Privacy from "../pages/Static/Privacy/Privacy";


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

];

routes.forEach(function(route){
    if (route.name !== "Record"){
        route.meta = {
            title: route.name.replace(/_/g, " ")
        }
    }
});




export default routes;
/*
Separate routing handle to avoid a big main.js
*/

import Home from '../components/Home/Home'
import Login from '../components/Users/Login'
import Signup from '../components/Users/Signup'
import Records from '../components/Search/Records'
import Record from '../components/Search/Record'
import Statistics from '../components/Stats/Statistics'
import New from '../components/CreateRecord/NewRecordPage'
import NewStandard from '../components/CreateRecord/NewStandard'
import NewDatabase from '../components/CreateRecord/NewDatabase'
import NewPolicy from '../components/CreateRecord/NewPolicy'
import NewCollection from '../components/CreateRecord/NewCollection'
import Community from '../components/Static/Community/Community'
import Stakeholders from '../components/Static/Stakeholders/Stakeholders'
import Timeline from '../components/Static/Timeline/Timeline'
import License from '../components/Static/License/License'
import Terms from '../components/Static/TermOfUse/TermsOfUse'
import Educational from '../components/Static/Educational/Educational'
import Privacy from '../components/Static/Privacy/Privacy'


let routes = [
    {
        name: "Home",
        path: '/',
        component: Home,

    },
    {
        name: 'Standards',
        path: '/standards',
        component: Records,

    },
    {
        name: "Databases",
        path: '/databases',
        component: Records,

    },
    {
        name: 'Policies',
        path: '/policies',
        component: Records,

    },
    {
        name: 'Collections',
        path: '/collections',
        component: Records,

    },

    /* CREATION */
    {
        name: 'New_content',
        path: '/new',
        component: New,
    },
    {
        name: 'New_standard',
        path: '/new/standard',
        component: NewStandard,
    },
    {
        name: 'New_database',
        path: '/new/database',
        component: NewDatabase,
    },
    {
        name: 'New_policy',
        path: '/new/policy',
        component: NewPolicy,
    },
    {
        name: 'New_collection',
        path: '/new/collection',
        component: NewCollection,
    },
    {
        name: 'Statistics',
        path: '/summary-statistics',
        component: Statistics,
    },

    /* Static pages */
    {
        name: 'Community',
        path: '/community',
        component: Community,
    },
    {
        name: 'Stakeholders',
        path: '/stakeholders',
        component: Stakeholders,
    },
    {
        name: 'Timeline',
        path: '/timeline',
        component: Timeline,
    },
    {
        name: 'License',
        path: '/license',
        component: License,
    },
    {
        name: 'Terms_of_use',
        path: '/terms',
        component: Terms,
    },
    {
        name: 'Educational',
        path: '/educational',
        component: Educational,
    },
    {
        name: 'Privacy',
        path: '/privacy',
        component: Privacy,
    },

    /*
    Careful, this has to be the very last base path  !!!!
    This component's page title is handled in the component itself as it needs the :id param
    */
    {
        name: "Record",
        path: '/:id',
        component: Record
    },

    {
        name: "Login",
        path: '/accounts/login',
        component: Login,
    },
    {
        name: "Register",
        path: '/accounts/signup',
        component: Signup,
    },

];

for (let routeIndex in routes) {
    if (routes[routeIndex].name !== 'Record'){
        routes[routeIndex].meta = {};
        routes[routeIndex].meta.title = routes[routeIndex].name.replace(/_/g, ' ');
    }
}


export default routes;
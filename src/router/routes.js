/*
Separate routing handle to avoid a big main.js
*/

import Home from '../components/Home/Home'
import Login from '../components/Users/Login'
import Signup from '../components/Users/Signup'
import Records from '../components/Search/Records'
import Record from '../components/Search/Record'
import Statistics from '../components/Stats/Statistics'
import New from '../components/CreateRecord/New'
import NewStandard from '../components/CreateRecord/NewStandard'
import NewDatabase from '../components/CreateRecord/NewDatabase'
import NewPolicy from '../components/CreateRecord/NewPolicy'
import NewCollection from '../components/CreateRecord/NewCollection'

export default [
    {
        name: "Home",
        path: '/',
        component: Home,
        meta: {
            title: 'Home'
        }
    },
    {
        name: 'standards',
        path: '/standards',
        component: Records,
        meta: {
            title: 'Standards'
        }
    },
    {
        name: "databases",
        path: '/databases',
        component: Records,
        meta: {
            title: "Databases"
        }
    },
    {
        name: 'policies',
        path: '/policies',
        component: Records,
        meta: {
            title: 'Policies'
        }
    },
    {
        name: 'collections',
        path: '/collections',
        component: Records,
        meta: {
            title: 'Collections'
        }
    },

    /* CREATION */
    {
        name: 'New content',
        path: '/new',
        component: New,
        meta: {
            title: 'New record'
        }
    },
    {
        name: 'new standard',
        path: '/new/standard',
        component: NewStandard,
        meta: {
            title: "New standard"
        }
    },
    {
        name: 'New database',
        path: '/new/database',
        component: NewDatabase,
        meta: {
            title: "New database"
        }
    },
    {
        name: 'New policy',
        path: '/new/policy',
        component: NewPolicy,
        meta: {
            title: "New policy"
        }
    },
    {
        path: '/new/collection',
        component: NewCollection,
        meta: {
            title: "New collection"
        }
    },
    {
        name: 'Statistics',
        path: '/summary-statistics',
        component: Statistics,
        meta: {
            title: "Statistics"
        }
    },

    /*
    Careful, this has to be the very last base path  !!!!
    This component meta title is handle in the component itself as it needs the :id param
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
        meta: {
            title: "Login"
        }
    },
    {
        name: "Register",
        path: '/accounts/signup',
        component: Signup,
        meta: {
            title: "Register"
        }
    },
]
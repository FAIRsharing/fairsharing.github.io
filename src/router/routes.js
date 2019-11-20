/*
Separate routing handle to avoid a big main.js
*/

import Home from '../components/Home/Home'
import Login from '../components/Users/Login'
import Signup from '../components/Users/Signup'
import Records from '../components/Search/Records'
import Record from '../components/Search/Record'
import Statistics from '../components/Stats/Statistics'

export default [
    {path: '/', component: Home},
    {path: '/standards', component: Records},
    {path: '/databases', component: Records},
    {path: '/policies', component: Records},
    {path: '/collections', component: Records},

    {path: '/summary-statistics', component: Statistics},

    {path: '/:id', component: Record}, /* Careful, this has to be the very last base path  !!!!*/

    {path: '/accounts/login', component: Login},
    {path: '/accounts/signup', component: Signup},
]
import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'

let Home, NotFound, Record, Records, NewRecord, Editor, Login, Signup, ConfirmAccount, ResendConfirmation, User,
    Curator, RequestNewPassword, ResetPassword, EditProfile, OauthLogin, LoginFailure, Stat, Community, Stakeholders,
    Timeline, License, Terms, Educational, Privacy;
/*
 * This block is ignored because, though coverage shows at 100% in CI, it does not do so locally.
 * Assigning things here and freezing them rather than creating consts above allows this entire function
 * to be ignored by local coverage.
 */
/* istanbul ignore next */
function dynamicImports() {
    Home = () => import(/* webpackChunkName: "home-chunk" */ '@/views/Home/Home.vue');
    Object.freeze(Home);
    NotFound = () => import(/* webpackChunkName: "home-chunk" */  "@/views/Errors/404");
    Object.freeze(NotFound);
    Record =  () => import(/* webpackChunkName: "record-chunk" */ '@/views/Records/Record');
    Object.freeze(Record);
    Records =  () => import(/* webpackChunkName: "records-chunk" */ '@/views/Records/Records');
    Object.freeze(Records);
    NewRecord = () => import(/* webpackChunkName: "newRecord-chunk" */ '@/views/CreateRecord/NewRecord');
    Object.freeze(NewRecord);
    Editor = () => import(/* webpackChunkName: "editRecord-chunk" */ "@/views/CreateRecord/Editor");
    Object.freeze(Editor);
    Login = () => import(/* webpackChunkName: "login-chunk" */ '@/views/Users/Login/Login');
    Object.freeze(Login);
    Signup =  () => import(/* webpackChunkName: "signUp-chunk" */ "@/views/Users/Signup");
    Object.freeze(Signup);
    ConfirmAccount =  () => import(/* webpackChunkName: "confirmAccount-chunk" */ "@/views/Users/ConfirmAccount.vue");
    Object.freeze(ConfirmAccount);
    ResendConfirmation = () => import(/* webpackChunkName: "resentEmail-chunk" */ "@/views/Users/ResendConfirmation.vue");
    Object.freeze(ResendConfirmation);
    User =  () => import(/* webpackChunkName: "user-chunk" */ "@/views/Users/User.vue");
    Object.freeze(User);
    Curator = () => import(/* webpackChunkName: "curator-chunk" */ "@/views/Curators/Curator.vue");
    Object.freeze(Curator);
    RequestNewPassword = () =>  import(/* webpackChunkName: "newPwd-chunk" */ "@/views/Users/RequestNewPassword");
    Object.freeze(RequestNewPassword);
    ResetPassword = () =>  import(/* webpackChunkName: "resetPwd-chunk" */ "@/views/Users/ResetPassword");
    Object.freeze(ResetPassword);
    EditProfile = () =>  import(/* webpackChunkName: "editProfile-chunk" */ "@/views/Users/EditProfile");
    Object.freeze(EditProfile);
    OauthLogin = () =>  import(/* webpackChunkName: "Oauth-chunk" */ "@/views/Users/Login/OauthLogin.vue");
    Object.freeze(OauthLogin);
    LoginFailure = () =>  import(/* webpackChunkName: "failedLogin-chunk" */ "@/views/Users/Login/LoginFailure");
    Object.freeze(LoginFailure);
    Stat =  () => import(/* webpackChunkName: "stat-chunk" */ '@/views/Stats/Statistics.vue');
    Object.freeze(Stat);
    Community =  () => import(/* webpackChunkName: "community-chunk" */ '@/views/Static/Community/Community');
    Object.freeze(Community);
    Stakeholders =  () => import(/* webpackChunkName: "stakeholders-chunk" */ '@/views/Static/Stakeholders/Stakeholders');
    Object.freeze(Stakeholders);
    Timeline =  () => import(/* webpackChunkName: "timeline-chunk" */ '@/views/Static/Timeline/Timeline');
    Object.freeze(Timeline);
    License =  () => import(/* webpackChunkName: "licence-chunk" */ '@/views/Static/License/License');
    Object.freeze(License);
    Terms =  () => import(/* webpackChunkName: "tos-chunk" */ '@/views/Static/TermOfUse/TermsOfUse');
    Object.freeze(Terms);
    Educational =  () => import(/* webpackChunkName: "edu-chunk" */ '@/views/Static/Educational/Educational');
    Object.freeze(Educational);
    Privacy =  () => import(/* webpackChunkName: "privacy-chunk" */ '@/views/Static/Privacy/Privacy');
    Object.freeze(Privacy);
}

dynamicImports();
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

const router = new VueRouter({
    routes,
    // mode: "history"
});

export async function beforeEach(to, from, next, store) {
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

export default router;

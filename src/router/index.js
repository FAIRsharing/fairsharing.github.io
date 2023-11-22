import Vue from "vue";
import VueRouter from "vue-router";

import { hackSearch } from "@/router/hackSearch";
import store from "@/store";

import {
  AdvancedSearchRecords,
  APIDoc,
  Community,
  CommunityCuration,
  ConfirmAccount,
  Curator,
  CuratorCohorts,
  Editor,
  EditProfile,
  EditPublicProfile,
  Educational,
  Graph,
  Home,
  Licence,
  Login,
  LoginFailure,
  Maintenance,
  New,
  NewRecord,
  NotFound,
  OauthLogin,
  OntologyBrowser,
  Organisation,
  OrganisationsList,
  Privacy,
  PublicProfile,
  Record,
  Records,
  RequestNewPassword,
  ResendConfirmation,
  ResetPassword,
  ServerError,
  Signup,
  Stakeholders,
  Stat,
  Terms,
  Timeline,
  User,
  UsersList,
} from "./routes.js";

Vue.use(VueRouter);

let routes = [
  {
    name: "sitemap",
    path: "/sitemap.xml",
    redirect: () => {
      window.location.assign(process.env.VUE_APP_API_ENDPOINT + "/sitemap.xml");
    },
  },
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
    name: "Organisations",
    path: "/organisations",
    component: OrganisationsList,
  },
  {
    name: "search",
    path: "/search",
    component: Records,
    /* istanbul ignore next */
    // TODO: Find a means to test this function; see hackSearch.js for details.
    beforeEnter(to, from, next) {
      let [query, modified] = hackSearch(to.query);
      if (modified) {
        next({ name: "search", query: query });
      } else {
        next();
      }
    },
  },
  {
    name: "AdvancedSearch",
    path: "/advancedsearch",
    component: AdvancedSearchRecords,
  },
  {
    name: "Organisation",
    path: "/organisations/:id",
    component: Organisation,
  },

  /* VARIOUS REDIRECTIONS */
  {
    name: "article",
    path: "/article/:name",
    redirect: (to) => {
      if (to.params.name === "live_list_standards_in_policies") {
        return {
          name: "search",
          query: {
            fairsharingRegistry: "Standard",
            isRecommended: true,
            page: 1,
          },
        };
      } else if (to.params.name === "live_list_databases_in_policies") {
        return {
          name: "search",
          query: {
            fairsharingRegistry: "Database",
            isRecommended: true,
            page: 1,
          },
        };
      } else if (to.params.name === "live_list_journal_policies") {
        return {
          name: "search",
          query: {
            fairsharingRegistry: "Policy",
            recordType: "journal",
            page: 1,
          },
        };
      } else {
        return { path: "/" };
      }
    },
  },
  // Another redirection, from: https://github.com/FAIRsharing/fairsharing.github.io/issues/1741
  {
    name: "raw_srao_file",
    path: "/ontology/subject/SRAO.owl",
    redirect: () => {
      window.location.assign(
        "https://github.com/FAIRsharing/subject-ontology/raw/master/SRAO.owl"
      );
    },
  },
  {
    name: "raw_srao_file_by_version",
    path: "/ontology/subject/SRAO.owl/0.3.0",
    redirect: () => {
      window.location.assign(
        "https://github.com/FAIRsharing/subject-ontology/raw/master/releases/0.3.0/SRAO.owl"
      );
    },
  },
  {
    name: "ontology",
    path: "/ontology/:name",
    redirect: (to) => {
      if (to.params.name.toLowerCase() === "srao") {
        window.location.assign(
          "https://github.com/FAIRsharing/subject-ontology"
        );
      } else if (to.params.name.toLowerCase() === "drao") {
        window.location.assign(
          "https://github.com/FAIRsharing/domain-ontology"
        );
      } else {
        return { path: "/" };
      }
    },
  },
  /* See: https://github.com/FAIRsharing/fairsharing.github.io/issues/1833 */
  {
    name: "srao_term",
    path: "/ontology/subject/:id",
    redirect: (to) => {
      const url =
        "https://www.ebi.ac.uk/ols/ontologies/srao/terms?iri=http://www.fairsharing.org/ontology/subject/";
      window.location.assign(url + to.params.id);
    },
  },
  /* See: https://github.com/FAIRsharing/fairsharing.github.io/issues/1561 */
  {
    name: "iso20691",
    path: "/collection/ISOCD20691CollectionDRAFT",
    redirect: "/3533",
  },
  /* Yet more redirections: https://github.com/FAIRsharing/fairsharing.github.io/issues/1865 */
  {
    name: "hupopsi",
    path: "/HUPOPSI",
    redirect: "/HUPO-PSI",
  },
  {
    name: "communities_activities",
    path: "/communities/activities",
    redirect: "/communities#activities",
  },
  {
    name: "licence_with_s",
    path: "/license",
    redirect: "/licence",
  },
  {
    name: "old_recommendations",
    path: "/recommendations",
    redirect: () => {
      /*
            This hack is necessary because simply redirecting to a search URL causes it to be interpreted as a
            record name rather than parsed, and passing parameters means the searchAnd parameter isn't recognised
            until the page refreshes (it's not at all clear why).
             */
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?isRecommended=true&page=1&searchAnd=false&fairsharingRegistry=database,standard",
        ].join("")
      );
    },
  },
  /* Even more, from #1865 as well. */
  {
    name: "old_databases_repository",
    path: "/databases/(repository|repositories)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Database&recordType=repository&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_databases_knowledgebase",
    path: "/databases/(knowledgebase|knowledgebases)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Database&recordType=knowledgebase&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_databases_knowledgebase_and_repsitory",
    path: "/databases/(knowledgebase_and_repository|knowledgebases_and_repositories)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Database&recordType=knowledgebase_and_repository&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_standards_model_and_format",
    path: "/standards/(model_and_format|models_and_formats)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Standard&recordType=model_and_format&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_standards_metric",
    path: "/standards/(metric|metrics)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Standard&recordType=metric&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_standards_terminology_artefact",
    path: "/standards/(terminology_artefact|terminology_artefacts)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Standard&recordType=terminology_artefact&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_standards_reporting_guidelines",
    path: "/standards/(reporting_guideline|reporting_guidelines)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Standard&recordType=reporting_guideline&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_standards_identifier_schema",
    path: "/standards/(identifier_schema|identifier_schemas)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Standard&recordType=identifier_schema&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_policies_project",
    path: "/policies/(project|projects)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Policy&recordType=project&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_policies_journal",
    path: "/policies/(journal|journals)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Policy&recordType=journal&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_policies_institution",
    path: "/policies/(institution|institutions)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Policy&recordType=institution&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_policies_society",
    path: "/policies/(society|societies)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Policy&recordType=society&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_policies_journal_publisher",
    path: "/policies/(journal_publisher|journal_publishers)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Policy&recordType=journal_publisher&page=1",
        ].join("")
      );
    },
  },
  {
    name: "old_policies_funder",
    path: "/policies/(funder|funders)",
    redirect: () => {
      // See recommendations hack...
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/search?fairsharingRegistry=Policy&recordType=funder&page=1",
        ].join("")
      );
    },
  },
  /* End of the hackery from #1865 */
  /* OTHER MODES */
  {
    name: "Maintenance",
    path: "/maintenance",
    component: Maintenance,
    beforeEnter(to, from, next) {
      isMaintenanceMode(to, from, next, store);
    },
  },

  /* CREATION */
  {
    name: "New_content",
    path: "/create",
    component: NewRecord,
    beforeEnter(to, from, next) {
      isLoggedIn(to, from, next, store);
    },
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
    name: "CommunityCuration",
    path: "/community_champions",
    component: CommunityCuration,
  },
  {
    name: "CuratorCohorts",
    path: "/community_champions/our_champions",
    component: CuratorCohorts,
  },
  {
    name: "CommunityCurationBis",
    path: "/communitycuration",
    component: CommunityCuration,
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
    name: "Licence",
    path: "/licence",
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
  {
    name: "old_community_curation",
    path: "/community_curation",
    redirect: () => {
      window.location.assign(
        [process.env.VUE_APP_API_HOSTNAME, "/community_champions"].join("")
      );
    },
  },
  {
    name: "old_our_curators",
    path: "/community_curation/our_curators",
    redirect: () => {
      window.location.assign(
        [
          process.env.VUE_APP_API_HOSTNAME,
          "/community_champions/our_champions",
        ].join("")
      );
    },
  },
  // AUTHENTICATION AND USERS
  {
    name: "OAuth Login",
    path: "/login_success",
    component: OauthLogin,
  },
  {
    name: "OAuth Login Failure",
    path: "/login_failure",
    component: LoginFailure,
  },
  {
    name: "Login",
    path: "/accounts/login",
    component: Login,
    beforeEnter(to, from, next) {
      isNotLoggedIn(to, from, next, store);
    },
  },
  {
    name: "Register",
    path: "/accounts/signup",
    component: Signup,
    beforeEnter(to, from, next) {
      isNotLoggedIn(to, from, next, store);
    },
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
    component: ResetPassword,
  },
  {
    name: "User",
    path: "/accounts/profile",
    component: User,
    beforeEnter(to, from, next) {
      isLoggedIn(to, from, next, store);
    },
  },
  {
    name: "PublicProfile",
    path: "/users/:id",
    component: PublicProfile,
  },
  {
    name: "Edit profile",
    path: "/profiles/edit",
    component: EditProfile,
    beforeEnter(to, from, next) {
      isLoggedIn(to, from, next, store);
    },
  },
  {
    name: "EditPublicProfile",
    path: "/profiles/editPublicProfile/:id",
    component: EditPublicProfile,
    beforeEnter(to, from, next) {
      isLoggedIn(to, from, next, store);
      isSuperCurator(to, from, next, store);
    },
  },
  {
    name: "UsersList",
    path: "/profiles/usersList",
    component: UsersList,
    beforeEnter(to, from, next) {
      isLoggedIn(to, from, next, store);
      isSuperCurator(to, from, next, store);
    },
  },

  // CURATORS
  {
    name: "Curator",
    path: "/curator",
    component: Curator,
    beforeEnter(to, from, next) {
      isLoggedIn(to, from, next, store);
      // isCurator(to, from, next, store);
    },
  },

  // Ontology Browser
  {
    name: "Ontology Browser",
    path: "/browse/:id",
    component: OntologyBrowser,
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
    },
  },
  /* To enable old links to collections to work */
  {
    name: "CollectionRecord",
    path: "/collection/:id",
    redirect: "/:id",
  },
  {
    name: "RecordByDoi",
    path: "/10.25504/:id",
    component: Record,
  },
  {
    name: "Record",
    path: "/:id",
    component: Record,
  },
  /* ERROR HANDLING */
  {
    name: "Error 404",
    path: "/error/404",
    component: NotFound,
  },
  /* ERROR HANDLING */
  {
    name: "Error 500",
    path: "/error/500",
    component: ServerError,
  },
  /* REDIRECTION */
  {
    name: "*",
    path: "*/*",
    component: NotFound,
  },
];
routes.forEach(function (route) {
  if (route.name !== "Record") {
    route.meta = {
      title: route.name.replace(/_/g, " "),
    };
  }
});

export async function afterEach(to) {
  if (to.name !== "Record") {
    window.scrollTo(0, 0);
  }
}

const router = new VueRouter({
  routes,
  scrollBehavior,
  mode: process.env.VUE_APP_MODE, // "history" or "hash"
});

export function scrollBehavior(to) {
  if (to.hash) {
    return { selector: to.hash };
  }
  return false;
}

export async function beforeEach(to, from, next, store) {
  if (to.path !== "/maintenance" && store.state.introspection.maintenanceMode) {
    next({ path: "maintenance" });
  }
  document.title =
    to.meta.title !== undefined
      ? "FAIRsharing | " + to.meta.title
      : "FAIRsharing";
  if (store.state.users.user().isLoggedIn) {
    await store.dispatch("users/validateUserToken");
  }
  next();
}

export function isLoggedIn(to, from, next, store) {
  if (store.state.users.user().isLoggedIn) {
    next();
  } else {
    const target = to.path;
    next({
      name: "Login", // back to safety route //
      query: { goTo: target },
    });
  }
}

export function isNotLoggedIn(to, from, next, store) {
  if (!store.state.users.user().isLoggedIn) {
    next();
  } else {
    next(from);
  }
}

export function isSuperCurator(to, from, next, store) {
  if (store.state.users.user().is_super_curator) {
    next();
  } else {
    const target = to.path;
    next({
      name: "Login", // back to safety route //
      query: { goTo: target },
    });
  }
}

export function isMaintenanceMode(to, from, next, store) {
  if (!store.state.introspection.maintenanceMode) {
    next(from);
  }
  next();
}

export default router;

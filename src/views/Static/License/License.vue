<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h4 text-xl-h3 mb-2 mb-xl-6">
      FAIRsharing API
    </h1>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Introduction
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The new FAIRsharing application has a REST API which offers the opportunity to both query and modify data. It's accessible to any user with an account on the system for showing basic information and for modifying any record you've created or maintain. To query more detailed information from it, please email <a
        href="contact@fairsharing.org"
        target="_blank"
      >contact@fairsharing.org</a> to discuss your requirements.
    </p>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Creating an account
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      You can create an account by going to the <a
        href="https://fairsharing.org"
        class="underline-effect"
      >FAIRsharing site</a>, clicking the "login" button and then choosing "create new account". You can also create an account by signing in with ORCID, Twitter or Github, but if you do you'll need to reset your password (click on the "Forgot your password?" link) before you can use the API.
    </p>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Using the API
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The base URL of the API is <mark>https://api.fairsharing.org</mark>; paths below may only give the route rather than the full URL, e.g. <mark>/fairsharing_records/123</mark>.
    </p>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Logging in
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      You will need to POST the following to <mark>https://api.fairsharing.org/users/sign_in</mark>:
    </p>
    <pre
      class="mt-2 mb-8"
      v-text="jsonData.login()"
    />

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      A successful response will return something like the following:
    </p>
    <pre
      class="mt-2 mb-8"
      v-text="jsonData.loginResponse()"
    />

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      In addition to the general information about your account there's a "jwt" field. This is a JSON web token which is valid until the expiry time given, and you'll need this for any further interactions with the API. The way it should be used is to send headers with each request, as follows:
    </p>
    <pre
      class="mt-2 mb-8"
      v-text="jsonData.jwt()"
    />

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Here are some examples of both logging in and quering a record. Each of these queries is for a single FAIRsharing Record with ID of 1.
    </p>
    <pre
      class="mt-2 mb-8"
      v-html="jsonData.cURL()"
    />


    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The code below may be used to create a link to our logo.
    </p>
    <pre
      class="mt-2 mb-8"
      v-text="`<img src='https://fairsharing.org/static/img/home/svg/FAIRsharing-logo.svg' alt='FAIRsharing Logo'>`"
    />

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      API Access
    </h2>

    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The FAIRsharing API is available at <a
        href="fairsharing.org/api"
        target="_blank"
        class="underline-effect"
      >fairsharing.org/api</a>, where Swagger documentation is provided. We are redeveloping the FAIRsharing site and are migrating to a new data model. In light of this, we are temporarily unable to provide access to our API to new applicants.
    </p>

    <h3 class="text-h5 text-xl-h4 mt-4 mb-2">
      API Version
    </h3>
    <p
      :class="['mb-0 lato-font-medium lato-text-sm font-italic',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The API version is currently <b>v0.3</b>. Versions <b>v0.2</b> and <b>v0.1</b> are also available. The version may be specified in the Accept headers as follows:
    </p>

    <pre
      class="mt-2 mb-8"
      v-text="`curl -X GET --header 'Accept: application/json; version=v0.2' --header 'Api-Key: YOUR_KEY_HERE' 'https://fairsharing.org/api/all/summary/'`"
    />

    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      If the verison number is not specified in your request (e.g. if you are <a
        href="https://fairsharing.org/api"
        target="_blank"
        class="underline-effect"
      >trying out</a> our API) then it will default to the newest version.
    </p>

    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      API Changes
    </h3>
    <h4>v0.3</h4>
    <p :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
      Removed the following fields:
    </p>
    <ul>
      <li>Old-style domain tags (domains).</li>
    </ul>
    <p :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
      Added the following fields:
    </p>
    <ul class="mb-4">
      <li>New ontology-based domains (onto_domains).</li>
      <li>New ontology-based disciplines (onto_disciplines).</li>
      <li>User-defined tags (user_defined_tags).</li>
    </ul>

    <h4>v0.2</h4>
    <p :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
      Removed the following fields:
    </p>
    <ul>
      <li>Record maintainers for all record types (maintains).</li>
      <li>Last updater of record (updated_by).</li>
    </ul>
    <p :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
      Added the following fields:
    </p>
    <ul>
      <li>API version (api_version).</li>
    </ul>

    <h2 class="text-h5 mt-5 text-xl-h4 mb-2 mb-xl-6">
      Search Engines
    </h2>

    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      We encourage search engines to index FAIRsharing and provide mechanisms for this. We are also involved in the <a
        href="https://schema.org/"
        target="_blank"
      >schema.org</a> and the BioSchemas projects, extending the vocabulary of tags to annotate our content. We will mark up FAIRsharing content with these tags in the near future.
    </p>

    <h2 class="text-h5 mt-5 text-xl-h4 mb-2 mb-xl-6">
      Screen Scraping
    </h2>

    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Please do not scrape the HTML page content. Much of the data is generated dynamically and is updated daily. Instead, please use our API or contact us directly and ask for a cut of the data. We're friendly and don't bite.
    </p>
  </main>
</template>

<script>
export default {
  name: "License",
  data: () => {
    return {
      jsonData: {
        login: () => {
          return JSON.stringify({
            "user":
                {
                  "login": "your_username",
                  "password": "your_password"
                }
          }, undefined, 3)
        },
        jwt: () => {
          return JSON.stringify({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer your_jwt_goes_here"
          }, undefined, 3)
        },
        loginResponse: () => {
          return JSON.stringify({
            "success": true,
            "jwt": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxYjhjMmMwMS05MjAsg3LTQxOGUtOTNiNS04NjNjNDE1NWZmM302LCJzdWIiOiI2NzMiLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE2MTQzMzk1MTMsImV4cCI6MTYxNDQyNTkxM30.QzTDIeDCvHc49lLbztxB5roGtIUuOTlRIOLFmiy2M6g",
            "username": "joe_bloggs",
            "id": 123,
            "role": "user",
            "profile_type": "publisher",
            "watched_records": [
              1,
            ],
            "is_curator": false,
            "is_special_curator": false,
            "expiry": 1614425000,
            "message": "Authentication successful"
          }, undefined, 3)
        },
        cURL: () => {
          return 'curl --location --request POST \'https://api.fairsharing.org/users/sign_in\' \n' +
              '--header \'Accept: application/json\' \n' +
              '--header \'Content-Type: application/json\' \n' +
              '--data-raw \'{"user": {"login":"your_username","password":"your_secret_password"} }\'\n' +
              '\n' +
              'curl --location --request GET \'https://api.fairsharing.org/fairsharing_records/1\' \n' +
              '--header \'Accept: application/json\' \n' +
              '--header \'Content-Type: application/json\' \n' +
              '--header \'Authorization: Bearer your_jwt_goes_here\' '
        }

      }
    }
  }
}
</script>

<style scoped>
pre {
  padding: 9px;
  margin: 0 0 10px;
  font-size: 1rem;
  font-family: monospace;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
}

li{
  line-height: 1.6;
}
li::before {
  display: inline-block;
  content: '';
  -webkit-border-radius: 0.375rem;
  border-radius: 0.375rem;
  -moz-border-radius: 0.375rem;
  height: 0.4rem;
  width: 0.4rem;
  margin-right: 0.5rem;
  background-color: black;
}

</style>

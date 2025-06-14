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
      The new FAIRsharing application has a REST API which offers the opportunity to both query and modify data. It's accessible to any user with an account on the system for showing basic information and for modifying any record you've created or maintain. To query more detailed information from it, please email
      <a
        class="underline-effect"
        href="mailto:contact@fairsharing.org"
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
        :href="getHostname()"
        class="underline-effect"
      >FAIRsharing site</a>, clicking the "login" button and then choosing "create new account". You can also create an account by signing in with ORCID, Twitter or Github, but if you do you'll need to reset your password (click on the "Forgot your password?" link) before you can use the API.
      You will in all cases need to <a href="/profiles/edit">edit your user profile</a> to add an organisation to which you belong.
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

    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="javascript"
    >
      <pre>
{
   "user":
      {
          "login": "your_username",
          "password": "your_password"
      }
}
 </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      A successful response will return something like the following:
    </p>

    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="javascript"
    >
      <pre>
{
   "success": true,
   "jwt": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxYjhjMmMwMS05MjAsg3LTQxOGUtOTNiNS04NjNjNDE1NWZmM302LCJzdWIiOiI2NzMiLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE2MTQzMzk1MTMsImV4cCI6MTYxNDQyNTkxM30.QzTDIeDCvHc49lLbztxB5roGtIUuOTlRIOLFmiy2M6g",
   "username": "joe_bloggs",
   "id": 123,
   "role": "user",
   "profile_type": "publisher",
   "watched_records": [
      1
   ],
   "is_curator": false,
   "is_special_curator": false,
   "expiry": 1614425000,
   "message": "Authentication successful"
}
 </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      In addition to the general information about your account there's a "jwt" field. This is a JSON web token which is valid until the expiry time given, and you'll need this for any further interactions with the API. The way it should be used is to send headers with each request, as follows:
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="javascript"
    >
      <pre>
{
   "Accept": "application/json",
   "Content-Type": "application/json",
   "Authorization": "Bearer your_jwt_goes_here"
}
 </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Here are some examples of both logging in and querying a record. Each of these queries is for a single FAIRsharing Record with ID of 1.
    </p>
    <p
      :class="['mb-4 font-weight-bold lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      cURL
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="javascript"
    >
      <pre>
curl --location --request POST 'https://api.fairsharing.org/users/sign_in' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{"user": {"login":"your_username","password":"your_secret_password"} }'

curl --location --request GET 'https://api.fairsharing.org/fairsharing_records/1' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_jwt_goes_here'
 </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 font-weight-bold lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Python
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="python"
    >
      <pre>

import requests
import json

url = "https://api.fairsharing.org/users/sign_in"

payload={"user": {"login":"your_username","password":"your_password"} }
headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

# Get the JWT from the response.text to use in the next part.
data = response.json()
jwt = data['jwt']

url = "https://api.fairsharing.org/fairsharing_records/1"

headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': "Bearer {0}".format(jwt),
}

response = requests.request("GET", url, headers=headers)

print(response.text)
 </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 font-weight-bold lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Ruby
    </p>


    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>

require "uri"
require "net/http"

url = URI("https://api.fairsharing.org/users/sign_in")

http = Net::HTTP.new(url.host, url.port)
request = Net::HTTP::Post.new(url)
request["Accept"] = "application/json"
request["Content-Type"] = "application/json"
request.body = "{\"user\": {\"login\":\"your_username\",\"password\":\"your_password\"} }"


# Get the JWT from the response body to use in the next part.
response = http.request(request)
jwt = response.read_body['jwt']


url = URI("https://api.fairsharing.org/fairsharing_records/1")

http = Net::HTTP.new(url.host, url.port);
request = Net::HTTP::Get.new(url)
request["Accept"] = "application/json"
request["Content-Type"] = "application/json"
request["Authorization"] = "Bearer #{jwt}"

response = http.request(request)
puts response.read_body
</pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 font-weight-bold lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      R (user contributed)
    </p>


    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
#1. load packages
library(RCurl)
library(jsonlite)
library(tidyverse)
library(data.table)

#2. get jwt
url&lt;-'https://api.fairsharing.org/users/sign_in'
request&lt;-POST(url,
              add_headers(
                "Content-Type"="application/json",
                "Accept"="application/json"),
              body="{\"user\": {\"login\":\"XXX@gmail.com\",\"password\":\"XXX\"} }")
con&lt;-jsonlite::fromJSON(rawToChar(request$content))
auth&lt;-con$jwt

#3. set query
query_url&lt;-"https://api.fairsharing.org/search/fairsharing_records?fairsharing_registry=database&countries=china&page[number]=1&page[size]=3600"

get_res&lt;-POST(
  query_url,
  add_headers(
    "Content-Type"="application/json",
    "Accept"="application/json",
    "Authorization"=paste0("Bearer ",auth,sep="")
  )
)

query_con&lt;-fromJSON(rawToChar(get_res$content))
#4. see results
data&lt;-query_con$data
      </pre>
    </vue-code-highlight>


    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Available queries
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      These are summarised in the table below.
    </p>
    <v-data-table
      :headers="tables.availableQueries.headers"
      :items="tables.availableQueries.data"
      :item-class="(item)=>{
        if (item.id % 2 === 0) {
          return 'grey lighten-3';
        } else {
          return 'white';
        }}"
      disable-pagination
      disable-sort
      hide-default-footer
      class="elevation-2 mb-8"
    />

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Modifying your records
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      We expect that most users will wish to use the API for querying the data we hold. However, some who maintain records may like to keep them updated in an automated way and so could write scripts which would do this. Some may wish to create records, for example if they would like to have their data replicated in FAIRsharing; pushing data to FAIRsharing would allow such collaborators to update our records immediately to ensure that they always reflect the current information in their own portal.
    </p>
    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      Basic parameters
    </h3>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      To create or modify records you will need to post a FAIRsharing record object. For creation, all the terms necessary must be included, but to modify a record you need only include the changed terms. Please note, though, that the "metadata" field must always be included in its entirety. For example, if you changed only the record's name in its metadata then you'd still need to include all the other parts of this field.
      <br>
      <br>
      An example is shown below:
    </p>

    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
    "fairsharing_record":
    {
        "metadata": {
            "name": "My new record",
            "homepage": "http://example.com",
            "abbreviation": "MNR",
            "contacts": [
                {
                    "contact_name": "John Smith",
                    "contact_orcid": "00000-321321321",
                    "contact_email": "jsmith@example.com"
                }
            ],
            "description": "This record is for my new exciting resource.",
            "status": "ready"
        },
        "record_type_id": 1,
        "subject_ids": [1, 2, 3],
        "domain_ids": [1, 2, 3],
        "taxonomy_ids": [1, 2, 3],
        "user_defined_tag_ids": [1, 2, 3],
        "country_ids": [1, 2, 3],
        "publication_ids": [1, 2, 3],
        "citation_ids": [1, 2, 3]
    }
}
      </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The metadata section contains information about the record itself, such as its name, contact details for resource maintainers etc. The full specifications for the metadata field, in the form of the JSON schemas used to validate it, can be found the following URLs:
    </p>

    <!-- SCHEMA LINKS -->
    <h4>Applies to all FAIRsharing records</h4>

    <ul>
      <li>
        <a
          class="underline-effect"
          href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/fairsharing_record_schema.json"
          target="_blank"
        >
          FAIRsharing Record schema
        </a>
      </li>
    </ul>

    <h4>Based on the record's FAIRsharing Registry and type</h4>

    <ul>
      <li>
        <a
          class="underline-effect"
          href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/database_schema.json"
          target="_blank"
        >
          Database schema
        </a>
      </li>
      <ul>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/database_knowledgebase_schema.json"
            target="_blank"
          >
            Pure knowledgebase schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/database_repository_schema.json"
            target="_blank"
          >
            Pure repository schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/database_knowledgebase_and_repository_schema.json"
            target="_blank"
          >
            Combined repository/knowledgebase schema
          </a>
        </li>
      </ul>
      <li>
        <a
          class="underline-effect"
          href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/standard_schema.json"
          target="_blank"
        >
          Standard schema
        </a>
      </li>
      <ul>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/standard_identifier_schema.json"
            target="_blank"
          >
            Identifier schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/standard_metric_schema.json"
            target="_blank"
          >
            Metric schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/standard_model_schema.json"
            target="_blank"
          >
            Model/format schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/standard_reporting_schema.json"
            target="_blank"
          >
            Reporting guideline schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/standard_terminology_schema.json"
            target="_blank"
          >
            Terminology artifact schema
          </a>
        </li>
      </ul>
      <li>
        <a
          class="underline-effect"
          href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/policy_schema.json"
          target="_blank"
        >
          Policy schema
        </a>
      </li>
      <ul>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/policy_funder_schema.json"
            target="_blank"
          >
            Funder schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/policy_journal_schema.json"
            target="_blank"
          >
            Journal schema
          </a>
        </li>
        <li>
          <a
            class="underline-effect"
            href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/policy_publisher_schema.json"
            target="_blank"
          >
            Publisher schema
          </a>
        </li>
      </ul>
      <li>
        <a
          class="underline-effect"
          href="https://fairsharing.github.io/JSONschema-documenter/?schema_url=https://api.fairsharing.org/model/collection_schema.json"
          target="_blank"
        >
          Collection schema
        </a>
      </li>
    </ul>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      A record's metadata will be validated against the following, in order:
    </p>

    <ul>
      <li>
        The schema for all FAIRsharing records.
      </li>
      <li>
        The relevant registry schema (e.g. the standard schema).
      </li>
      <li>
        Any relevant type schema (e.g. the reporting guideline schema).
      </li>
    </ul>


    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      So, the metadata field may contain anything in any of the above three, and nothing else.
    </p>

    <h4>Other fields</h4>


    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The other fields contain references to other objects in our system, such as publications or various other tags. To modify these an array of the IDs of the relevant objects must be sent to the server. For example, a PUT of the following data would remove subject 3 from the record created in the previous step (by sending only 1 and 2).
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
    "fairsharing_record":
    {
        "subject_ids": [1, 2]
    }
}
      </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      In order to determine the IDs of these objects you can POST to the following URLs:
    </p>

    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>

/search/domains
/search/subjects
/search/user_defined_tags
/search/taxonomies
/search/countries
/search/publications
/search/record_types
      </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      N.B. "taxonomies" is referred to as "species" on the FAIRsharing website's pages.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Each query has an optional parameter of <mark>q:</mark> if omitted then all records will be returned. Otherwise, a search will be performed as with <mark>/search/fairsharing_records</mark> (this latter is paginated - see earlier for pagination parameters).
    </p>

    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      fairsharing_record search fields
    </h3>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The following fields may be used when performing a POST to /search/fairsharing_records
    </p>

    <ul>
      <li>q</li>
      <li>status</li>
      <li>fairsharing_registry</li>
      <li>record_type</li>
      <li>countries</li>
      <li>subjects</li>
      <li>domains</li>
      <li>taxonomies</li>
      <li>user_defined_tags</li>
      <li>is_recommended*</li>
      <li>is_approved*</li>
      <li>is_maintained*</li>
    </ul>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      "q" is a general search term and will be used to search across all records. The other terms will be used to restrict
      results to those with an exact match. Anything marked with "*" takes either "true" or "false".
    </p>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Example:
    </p>

    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
        curl --location --request POST 'https://api.fairsharing.org/search/fairsharing_records?q=ADHD&fairsharing_registry=database&countries=china'
        --header 'Accept: application/json'
        --header 'Content-Type: application/json'
        --header 'Authorization: Bearer your_jwt_goes_here'
      </pre>
    </vue-code-highlight>


    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      Complex parameters
    </h3>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Some other objects are not added directly to a FAIRsharing record as above; an additional step is necessary to modify them. These are:
    </p>
    <ul>
      <li>Licences.</li>
      <li>Organisations.</li>
      <li>Grants.</li>
      <li>Other FAIRsharing records (e.g. related standards).</li>
    </ul>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The IDs for these may be found as above:
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>

/search/licences
/search/organisations
/search/grants
/search/fairsharing_records
      </pre>
    </vue-code-highlight>
    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      Licences:
    </h3>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      POST the following to <mark>/licence_links</mark>
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
  "licence_link":
  {
    "fairsharing_record_id": 1,
    "licence_id": 1,
    "relation": "optional_string"
  }
}
      </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The IDs for licence links can be seen in the licence_link field of your record, which you can get according to the initial example given earlier, e.g. a GET to <mark>/fairsharing_records/1</mark> (using your record's ID). This field will contain both the ID of the licence and the ID of the link (only the latter is needed).
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      This will add the licence with ID of 1 to the FAIRsharing record with the ID of 1. The "relation" field is optional; you may supply any of the following values:
    </p>
    <ul>
      <li>least_permissive</li>
      <li>applies_to_content</li>
      <li>undefined</li>
    </ul>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      To modify a licence_link, PUT to /licence_links/1, using the ID of the licence link.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      To delete one, use <mark>DELETE /licence_links/1</mark>, again with the ID of your link.
    </p>
    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      Organisations and grants:
    </h3>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Organisations are linked to FAIRsharing records by means of an organisation_link, created similarly to licence_links, above. A grant belongs to the relationship between and organisation and FAIRsharing record, if the organisation funds the resource to which the record refers. So, creation is as follows:
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
  "organisation_link":
  {
    "fairsharing_record_id": 1,
    "organisation_id": 1,
    "relation": "relation"
   }
}
      </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The "relation" field can be any of the following:
    </p>
    <ul>
      <li>maintains</li>
      <li>funds</li>
      <li>collaborates_on</li>
      <li>undefined</li>
    </ul>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      If the relationship is "funds" then you will need to create a grant. This is done at the same time as creating the organisation_link:
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      <mark>POST /grants</mark> with these data:
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
  "grant": {
    "description": "A rather generous grant.",
      "organisation_links_attributes":
        [
          {
            "fairsharing_record_id": 1,
            "organisation_id": 1,
            "relation": "funds"
          }
        ]
      }
}
      </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Creating an organisation is simpler:
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      <mark>POST /organisations</mark>
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
  "organisation": {
    "organisation_type_ids": [
      1
    ],
    "name": "Harlington-Straker Studios",
    "homepage": "https://harlington-straker.org",
    "alternative_names": [
      "SHADO"
    ],
    "logo": {
      "filename": "shado.jpg",
      "data": "file_data",
      "content_type": "image/jpeg"
    }
  }
}
      </pre>
    </vue-code-highlight>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      In this case file_data should be the <a
        href="https://www.base64encode.org/"
        target="_blank"
        class="underline-effect"
      >base64 encoded</a> file data. The logo is optional, however.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Organisation types can be found via a GET to <mark>/organisation_types.</mark>
    </p>
    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      Related FAIRsharing records:
    </h3>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      FAIRsharing records can be related to others in a variety of ways. This is represented by creating a record_association which describes the linking record, the record to which it links and what the relationship between them is. These can be created as follows:
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
  "record_association": {
    "fairsharing_record_id": 1,
    "linked_record_id": 2,
    "record_assoc_label_id": 3
  }
}
      </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      This will create a link from the FAIRsharing record with ID of 1 to that with ID of 2, and apply the label with id 3 to this relationship.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      A link can be deleted by means of <mark>DELETE /record_associations/1</mark>, supplying the correct ID for the record association.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The IDs for record associations can be found in the <mark>linked_records</mark> field of the data returned from the API for your record. Information on labels can be found via a GET to <mark>/record_association_labels</mark>.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      As an alternative, you can use <mark>PUT /fairsharing_records/1</mark> with the following data structure:
    </p>
    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="ruby"
    >
      <pre>
{
  "record_association_attributes": [
    {
      "linked_record_id": 2,
      "record_assoc_label_id": 3
    },
    {
      "id": 5,
      "_delete": 1
    }
  ]
}
      </pre>
    </vue-code-highlight>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The above data will create a new record association between your record and the record with ID of 2, assigning the label with ID of 5 to it. Also, it will delete the existing record_association with ID of 5.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Certain relationships are only permitted between certain types or registries of records. This is summarised below. If a relationship isn't listed then it can be applied between any two records.
    </p>

    <v-data-table
      :headers="tables.relationshipData.headers"
      :items="tables.relationshipData.data"
      :item-class="(item)=>{
        if (item.id % 2 === 0) {
          return 'grey lighten-3';
        } else {
          return 'white';
        }}"
      disable-pagination
      disable-sort
      hide-default-footer
      class="elevation-2 mb-8"
    />

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      JSON+LD
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Are you looking for structured data within an individual record's page? The FAIRsharing site implements content
      negotiation, so if you make a request for a record, specifying JSON or LD+JSON headers, some basic JSON data
      will be provided. For example:
    </p>

    <vue-code-highlight
      class="code-container mt-2 mb-4"
      language="bash"
    >
      <pre>
         curl -i -H "Accept: application/ld+json" "https://fairsharing.org/FAIRsharing.vr52p3"
      </pre>
    </vue-code-highlight>


    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Contact
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      If you are using this API to update your records you are probably already in contact with us. Otherwise, any queries can be directed to <a href="mailto:contact@fairsharing.org">contact@fairsharing.org</a>.
    </p>
  </main>
</template>

<script>
import {component as VueCodeHighlight} from 'vue-code-highlight';

import getHostname from "@/utils/generalUtils";

export default {
  name: "APIDoc",
  components:{VueCodeHighlight},
  mixins: [getHostname],
  data: () => {
    return {
      tables: {
        availableQueries: {
          headers: [
            {
              text: 'URL',
              value: 'URL',
              class: "text--primary text-h6 font-weight-black"
            },
            {
              text: 'verb', value: 'verb', class: "text--primary text-h6 font-weight-black"
            },
            {
              text: 'parameters', value: 'parameters', class: "text--primary text-h6 font-weight-black"
            },
            {
              text: 'description', value: 'description', class: "text--primary text-h6 font-weight-black"
            },
          ],
          data: [
            {
              URL: '/fairsharing_records/?page[number]=1&page[size]=25',
              verb: 'GET',
              parameters: 'Optional page number and size',
              description: 'Gets all FAIRsharing records (paginated)',
              id: 0
            },
            {
              URL: '/fairsharing_records/',
              verb: 'POST',
              parameters: 'A FAIRsharing record object (see below)',
              description: 'Creates a FAIRsharing record',
              id: 1
            },
            {
              URL: '/fairsharing_records/1',
              verb: 'GET',
              parameters: 'Record ID',
              description: 'Gets a single FAIRsharing record by ID',
              id: 2
            },
            {
              URL: '/fairsharing_records/1',
              verb: 'PUT',
              parameters: 'Record ID, FAIRsharing record object (see below)',
              description: 'Updates a single FAIRsharing record by ID',
              id: 3
            },
            {
              URL: '/search/fairsharing_records/',
              verb: 'POST',
              parameters: '{q: search_term}',
              description: 'Searches fairsharing records',
              id: 4
            }
          ]
        },
        relationshipData: {
          headers: [
            {text: 'Label', value: 'Label',class:"text--primary text-h6 font-weight-black"},
            {
              text: 'Restriction',
              value: 'Restriction',
              class:"text--primary text-h6 font-weight-black"
            },
            {text: 'Description', value: 'Description',class:"text--primary text-h6 font-weight-black"},
          ],
          data: [
            {
              id: 0,
              Label: 'implements',
              Restriction: 'Any database to any standard',
              Description: 'This database implements a particular standard'
            },
            {
              id: 1,
              Label: 'accepts',
              Restriction: 'Any database to any standard',
              Description: 'This database accepts data that follows a particular standard.'
            },
            {
              id: 2,
              Label: 'outputs',
              Restriction: 'Any database to any standard',
              Description: 'This database outputs data that follows a particular standard'
            },
            {
              id: 3,
              Label: 'related_to',
              Restriction: 'Any database to any standard or database, any standard to any standard or database, any policy to any policy',
              Description: 'This resource is related to another resource in an undefined way'
            },
            {
              id: 4,
              Label: 'shares_code_with',
              Restriction: 'Any database to any other database',
              Description: 'This database shares a portion of code with another database'
            },
            {
              id: 5,
              Label: 'shares_data_with',
              Restriction: 'Any database to any other database',
              Description: 'This database shares a portion of data with another database'
            },
            {
              id: 6,
              Label: 'profiles',
              Restriction: 'Any standard to any other standard',
              Description: 'This database shares a portion of data with another database'
            },
            {
              id: 7,
              Label: 'extends',
              Restriction: 'A database or standard to another of the same registry',
              Description: 'This resource extends or builds upon another resource'
            },
            {
              id: 8,
              Label: 'collects',
              Restriction: 'A collection to any other record',
              Description: 'A Collection can collect Standards, Databases and Data Policies based on a project, initiative or infrastructure'
            },
            {
              id: 9,
              Label: 'recommends',
              Restriction: 'A policy to any standard or database',
              Description: 'A standard or database can be recommended by a data policy'
            },
            {
              id: 10,
              Label: 'deprecates',
              Restriction: 'Any record to any other of the same registry',
              Description: 'The linked resource has been retired as it is no longer active or actively maintained'
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped>
li {
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

mark {
  background: lightgrey;
  color: #636363;
  padding: 2px;
}
</style>

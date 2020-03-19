let labelsMapping = {
    autocomplete: {
        licences: {
            filterName: "licences",
            filterLabel: "Licence(s)",
            type: "String"
        },
        grants: {
            filterName: "grants",
            filterLabel: "Grant(s)",
            type: "String"
        },
        taxonomies: {
            filterName: "taxonomies",
            filterLabel: "Species",
            type: "String"
        },
        organisations: {
            filterName: "organisations",
            filterLabel: "Organisation(s)",
            type: "String"
        },
        countries: {
            filterName: "countries",
            filterLabel: "Countries",
            type: "String"
        },
        domains: {
            filterName: "domains",
            filterLabel: "Ontology Domains",
            type: "String"
        },
        subjects: {
            filterName: "subjects",
            filterLabel: "Ontology Subjects",
            type: "String"
        },
        user_defined_tags: {
            filterName: "userDefinedTags",
            filterLabel: "User defined tags",
            type: "String"
        },
        fairsharing_registry: {
            filterName: "fairsharingRegistry",
            filterLabel: "Registry",
            type: "String"
        },
        is_recommended: {
            filterName: "isRecommended",
            filterLabel: "Recommended",
            type: "Boolean"
        },
        record_type: {
            filterName: "recordType",
            filterLabel: "Type of records",
            type: "String"
        },
        journals: {
            filterName: "journals",
            filterLabel: "Journals(s)",
            type: "String"
        },
        status: {
            filterName: "status",
            filterLabel: "Output status",
            type: "String"
        }
    },
    input: [
        {
            filterName: "id",
            filterLabel: "Record IDs"
        },
    ]
};

export default labelsMapping;

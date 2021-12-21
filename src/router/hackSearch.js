/*
 * The purpose of this file is to intercept search parameters before they are passed to the API. It's necessary
 * as links which were generated on the old system may appear in old (or not so old) papers, on other sites etc.
 * If anyone complains they've clicked on a link to FAIRsharing that "doesn't work" then it may be found to be one
 * of these, and might perhaps require the specific terms be added to the lookup tables here.
 * Unfortunately it seems difficult to test and results in:
 * Timeout - Async callback was not invoked within the 5000ms timeout specified by jest.setTimeout.Timeout
 */


/**
 * Convert a prop from the old system into that used by the new. Useful when old search links
 * have been deployed elsewhere in the internet or in print (as long as we know about them).
 * @returns  String - new form of the old prop
 */
export function hackSearch(query) {
    let modified = false;
    const lookupKeys = {
        content: 'fairsharingRegistry'
    };
    const lookupValues = {
        biodbcore: 'database'
    }
    Object.keys(query).forEach(function(key) {
        let value = query[key];
        // Delete keys with empty values.
        if (!value) {
            delete query[key];
            modified = true;
        }
        // This key is no longer used in the system:
        if (key === 'search_state') {
            delete query[key];
            modified = true;
        }
        // The key is outdated and needs to be replaced with the latest.
        if (Object.keys(lookupKeys).includes(key)) {
            let newKey = lookupKeys[key];
            if (Object.keys(lookupValues).includes(value)) {
                query[newKey] = lookupValues[value];
            }
            else {
                query[newKey] = value;
            }
            // Delete old key.
            delete query[key];
            modified = true;
        }
        // The key's OK but the value may need replacing.
        else {
            if (Object.keys(lookupValues).includes(value)) {
                query[key] = lookupValues[value];
                modified = true;
            }
            else {
                modified = false;
            }
        }
    });
    return [query, modified];

}


/*
Fixed:
https://fairsharing.org/search/?q=genomics&content=biodbcore
https://fairsharing.org/search/?q=transcriptomics&content=biodbcore
https://fairsharing.org/search/?q=genomics&content=standard&name=&taxonomies=&organisations=&shortname=&description=&supportlinks=&licenses=&countries=&maintainers=&expanded_onto_domains=&expanded_onto_disciplines=&user_defined_tags=&record_id=&miriam_id=&search_state=hidden
https://fairsharing.org/search/?q=proteomics&content=biodbcore&name=&taxonomies=&organisations=&shortname=&description=&supportlinks=&licenses=&countries=&maintainers=&expanded_onto_domains=&expanded_onto_disciplines=&user_defined_tags=&record_id=&miriam_id=&search_state=hidden
https://fairsharing.org/search/?q=proteomics&content=standard&name=&taxonomies=&organisations=&shortname=&description=&supportlinks=&licenses=&countries=&maintainers=&expanded_onto_domains=&expanded_onto_disciplines=&user_defined_tags=&record_id=&miriam_id=&search_state=hidden
https://fairsharing.org/search/?q=metabolomics&content=biodbcore&name=&taxonomies=&organisations=&shortname=&description=&supportlinks=&licenses=&countries=&maintainers=&expanded_onto_domains=&expanded_onto_disciplines=&user_defined_tags=&record_id=&miriam_id=&search_state=hidden
https://fairsharing.org/search/?q=metabolomics&content=standard&name=&taxonomies=&organisations=&shortname=&description=&supportlinks=&licenses=&countries=&maintainers=&expanded_onto_domains=&expanded_onto_disciplines=&user_defined_tags=&record_id=&miriam_id=&search_state=hidden

Covered by something else:
https://fairsharing.org/standards/?q=transcriptomics

 */
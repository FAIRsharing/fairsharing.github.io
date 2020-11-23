/**
 * Assess if the string is of a certain value (useful to compare passwords)
 * @param {String} val - the value to evaluate the string against
 * @returns {function(*): (boolean|string)}
 */
export function hasValue(val){
    return value => value === val || "Invalid repeated password"
}

 /**
 * Assess email patterns.
 * @returns {function(*): (boolean|string)}
 */7
export function isEmail(){
    return value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    }
}

/**
 * Assess the presence of the field
 * @returns {function(*=): (boolean|string)}
 */
export function isRequired(){
    return value => !!value || 'Required.'
}

/**
 * Assess URL patterns.
 * @returns {function(*): (boolean|string)}
 */
export function isUrl() {
    return value => {
        if (!value) return true;
        const pattern = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
        return pattern.test(value) || 'Invalid URL.'
    }
}

/**
 * Assess if the string is long enough.
 * @param {Number} length - the length to evaluate the string against.
 * @returns {function(*): (boolean|string)}
 */
export function isLongEnough(length) {
    return value => {
        let error = (value) ? `Value is not long enough (${value.length}/${length})` : `Value is not long enough (0/${length})`;
        if (!value) return error;
        return value.length >= length || error;
    }
}
/**
 * Assess ORCID patterns. Can be empty if required is false.
 * @params {Boolean} required - is the field required or not.
 * @returns {function(*): (boolean|string)}
 */
export function isOrcid(required) {
    return value => {
        if (!value && !required) return true; // because this is an optional Orcid ID
        const pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/gi;
        return pattern.test(value) || "Doesn't look like a valid ORCID ID."
    }
}

/**
 * Assess if the given file has the correct extension
 * @returns {function(*): (boolean|string)}
 */
export function isImage(){
    const accept = ["image/png", "image/jpeg"];
    return value => {
        return (!value || accept.indexOf(value.type) > -1) || "File type should be PNG or JPEG"
    }
}

/**
 * Assess if the given relation is "funds" when there's a grant
 * @param {String} val - the value to evaluate the string against
 * @returns {function(*): (boolean|string)}
 */
export function isFund(val){
    return value => {
        if (!value) return true;
        return val === 'funds' || "Relationship should be 'funds' if you want to add a grant";
    }
}

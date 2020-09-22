export function hasValue(val){
    return value => value === val || "Invalid repeated password"
}

export function isEmail(){
    return value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    }
}

export function isRequired(){
    return value => !!value || 'Required.'
}

export function isUrl() {
    return value => {
        const pattern = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
        return pattern.test(value) || 'Invalid URL.'
    }
}

export function isLongEnough(length) {
    return value => {
        return value.length >= length || 'Keep typing!'
    }
}

/*
 * An ORCID ID may be optional; if it is then an empty input field will also be accepted.
 * Pass a boolean to isOrcid to determine if it's required.
 */
export function isOrcid(required) {
    return value => {
        if (!value && !required) return true; // because this is an optional Orcid ID
        const pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/gi;
        return pattern.test(value) || "Doesn't look like a valid ORCID ID."
    }
}

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/**
 * Function to load components dynamically. It receives a flat array as list of components and base address to load components from
 * @returns component's list as object
 * */
export function loadWidgets(widgets,basePath) {
    return widgets.reduce((current, widget) => ({
        ...current,
        [widget]: () => import(`@/${basePath}${widget}`)
    }), {})
}

/**
 * Function to flatten an object.
 * @returns a flat array
 * */
export function flattenObject(object) {
    let flatArray = [];
    Object.keys(object).forEach(item => {
        object[item].forEach(item => {
            flatArray.push(item);
        })
    })
    return flatArray
}

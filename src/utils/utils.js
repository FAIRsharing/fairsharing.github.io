export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export const compareArray = function(array) {
    return function(current){
        return array.filter(function(other){
            return other.type === current.type && other.url === current.url
        }).length === 0;
    }
};

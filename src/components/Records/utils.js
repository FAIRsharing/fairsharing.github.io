const buildParam = function(currentQuery, newParam){
    let outputQuery = {};
    const currentParam = currentQuery[newParam.name];

    Object.keys(currentQuery).forEach(function(param){
        outputQuery[param] = currentQuery[param];
    });

    if (Object.prototype.hasOwnProperty.call(currentQuery, newParam.name)){
        const facetValue = encodeURIComponent(newParam.value.key);

        if (currentParam.indexOf(facetValue) < 0){
            outputQuery[newParam.name] = currentParam + "," + facetValue;
        }
    }
    else {
        outputQuery[newParam.name] = encodeURIComponent(newParam.value.key);
    }
    return outputQuery;
};

export default buildParam;
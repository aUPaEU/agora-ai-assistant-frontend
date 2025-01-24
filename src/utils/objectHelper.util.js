export const extractObjectsWithMatchingKey = (obj, searchKey) => {
    let results = [];

    function searchKeys(object) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (key === searchKey) {
                    results.push({ [searchKey] : object[key] });
                }
                if (typeof object[key] === 'object' && object[key] !== null) {
                    searchKeys(object[key]); 
                }
            }
        }
    }

    searchKeys(obj);
    return results;
}
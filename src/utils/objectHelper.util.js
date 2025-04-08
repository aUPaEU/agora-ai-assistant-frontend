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

/**
 * Finds a property in an object that matches a specific pattern
 * @param {Object} state - The object to search in
 * @param {string|string[]} pattern - The pattern(s) to search for
 * @returns {*} - The value of the matching property or null if not found
 */
export const findPropertyByPattern = (object, pattern) => {
    if (!object) return null;
    
    // Convert single pattern to array for unified processing
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    
    for (const currentPattern of patterns) {
        // Look for exact match first
        if (object[currentPattern]) return object[currentPattern];
        
        // Then look for properties containing the pattern
        for (const key in object) {
            if (key.includes(currentPattern)) {
                return object[key];
            }
        }
    }
    
    return null;
};
export const stringifyReplacer = (key, value) => {
    if (typeof value === 'string') {
      return value.replace(/'/g, '"');
    }

    return value
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitAndKeepDelimiter(str, delimiter) {
  const parts = str.split(new RegExp(`(${delimiter})`, 'g'));
  return parts;
}

export const escapeHTML = (str) => { 
  return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
      })[tag]);
}

/**
 * Processes a buffer containing potentially multiple or incomplete JSON objects
 * Handles concatenated JSON objects and streaming data
 * @param {string} buffer - The buffer containing JSON data
 * @param {boolean} isLast - Whether this is the last chunk to process
 * @param {Function} onJSONFound - Callback function to handle each complete JSON object
 * @returns {string} - Remaining incomplete JSON data
 */
export const processJSONBuffer = (buffer, isLast = false, onJSONFound = null) => {
    let remaining = buffer
    let bracketCount = 0
    let currentJSON = ''
    let inString = false
    let escapeNext = false
    
    for (let i = 0; i < buffer.length; i++) {
        const char = buffer[i]
        currentJSON += char
        
        if (escapeNext) {
            escapeNext = false
            continue
        }
        
        if (char === '\\') {
            escapeNext = true
            continue
        }
        
        if (char === '"') {
            inString = !inString
            continue
        }
        
        if (!inString) {
            if (char === '{') {
                bracketCount++
            } else if (char === '}') {
                bracketCount--
                
                // Complete JSON object found
                if (bracketCount === 0) {
                    try {
                        const parsed = JSON.parse(currentJSON.trim())
                        if (onJSONFound) {
                            onJSONFound(parsed)
                        } else {
                            console.log(parsed)
                        }
                    } catch (error) {
                        console.trace()
                        console.log('Error parsing JSON:', currentJSON.trim())
                    }
                    
                    // Reset for next JSON object
                    currentJSON = ''
                    remaining = buffer.substring(i + 1)
                }
            }
        }
    }
    
    // Return remaining buffer (incomplete JSON)
    return isLast ? '' : (bracketCount > 0 ? currentJSON : remaining.trim())
}
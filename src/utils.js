
/**
 * @function type
 * @description Loop on types of the arguments
 * @param  {...any} args Arguments given at the function
 * @returns {Boolean}
 */
function typeArg(...args) {
    for (let idx = 0; idx < args.length; idx++) {
        if (typeof args[idx] !== "string") {
            return true;
        }
    }

    return false;
}

module.exports = { typeArg };

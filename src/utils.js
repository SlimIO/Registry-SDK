
/**
 * @function type
 * @description Loop on types of the arguments
 * @param  {...any} args Arguments given at the function
 * @throws will throw a TypeError if the argument isn't a string
 * @returns {void}
 */
function checkArg(...args) {
    for (let idx = 0; idx < args.length; idx++) {
        if (typeof args[idx] !== "string") {
            throw new TypeError("Arguments must be strings");
        }
    }
}

module.exports = { checkArg };

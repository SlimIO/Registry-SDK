// Require Third-Party dependencies
const ow = require("ow");

/**
 * @function argsMustBeString
 * @description Loop on types of the arguments
 * @param  {any[]} args Arguments given at the function
 * @throws {ArgumentError} will throw a TypeError if the argument isn't a string
 * @returns {void}
 */
function argsMustBeString(...args) {
    for (let idx = 0; idx < args.length; idx++) {
        ow(args[idx], ow.string);
    }
}

module.exports = { argsMustBeString };

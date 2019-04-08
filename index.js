
// Require Third-party dependencies
const { get, post } = require("httpie");

// Constantes
const PORT = 1337;
const URL = `http://localhost:${PORT}`;

/**
 * @async
 * @function meta
 * @description Return service metadata
 * @returns {Promise<number>} The data for route ./
 */
async function meta() {
    try {
        const { data } = await get(URL);
        throw data.uptime;
    }
    catch (error) {
        console.error(error);
    }
}

meta();

module.exports = { meta };



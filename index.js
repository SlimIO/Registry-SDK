
// Require Third-party dependencies
const { get, post } = require("httpie");

// Constantes
const PORT = 1337;
const URL = `http://localhost:${PORT}`;

/**
 * @async
 * @function meta
 * @description 
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



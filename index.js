
// Require Third-party dependencies
const { get, post } = require("httpie");
const { red } = require("kleur");

// Constantes
const PORT = 1337;
const URL = `http://localhost:${PORT}`;

/**
 * @async
 * @function meta
 * @description Return service metadata
 * @returns {Promise} Object of the request with key uptime
 */
async function meta() {
    return (await get(URL)).data;
}

/**
 * @async
 * @function user
 * @description Authenticate a user and get an AccessToken.
 * @param {!string} userName User name
 * @param {!string} passWord User password
 * @returns {Promise} Object of the request with key access_token
 */
async function login(userName, passWord) {
    const { data } = await post(`${URL}/login`, {
        body: {
            username: userName,
            password: passWord
        }
    });

    return data;
}

async function test() {
    console.log(red(1), await meta());
    console.log(red(2), await login("nicolas", "NICOLAS"));
}

test();

// user("nicolas", "NICOLAS");

module.exports = { meta, login };



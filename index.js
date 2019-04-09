// Require Third-party dependencies
const { get, post, send } = require("httpie");
const { red } = require("kleur");

// Constantes
const PORT = 1337;
const URL = `http://localhost:${PORT}`;

// Globals
let accessToken = "";

/**
 * @async
 * @function meta
 * @description Return service metadata
 * @returns {Promise} Object of the request with uptime key
 */
async function meta() {
    return (await get(URL)).data;
}

/**
 * @async
 * @function login
 * @description Authenticate a user and get an AccessToken.
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise} Object of the request with access_token key
 */
async function login(username, password) {
    const { data } = await post(`${URL}/login`, {
        body: { username, password }
    });
    accessToken = data.access_token;

    return data;
}

/**
 * @async
 * @function users
 * @description Create a new user.
 * @param {!string} userName User name
 * @param {!string} passWord User password
 * @returns {Promise} Object of the request with key userId
 */
async function users(userName, passWord) {
    return (await post(`${URL}/users`, {
        body: {
            username: userName,
            password: passWord
        }
    })).data;
}

/**
 * @async
 * @function publish
 * @description Create or update an Addon release.
 * @param {!Object} addon Addon infos
 * @param {!string} addon.name Addon name
 * @param {string} addon.description Addon description
 * @param {!string} addon.version Semver
 * @param {!string} addon.git Git url
 * @param {string} addon.organisation Organisaion name
 * @param {!string} token Access token user
 * @returns {Promise} Object with addonId key
 */
async function publish(addon, token) {
    try {
        if (accessToken === "") {
            throw new Error("Acces Token void. Required connexion before");
        }
        console.log(accessToken);
        const { data } = (await post(`${URL}/addon/publish`), {
            body: infos,
            headers: {
                Authorization: accessToken
            }
        }).data;
    }
    catch (error) {
        console.log(error.message);
    }
}

/**
 * @async
 * @function addon
 * @description Get a given addon by his name (arg !== undefined). OR get all available addons.
 * @param {string} addonName User name
 * @returns {Promise<Array<String>>} Addon array
 */
async function addonPublich(addonName) {
    if (addonName !== undefined) {
        return;
    }

    return;
}

async function test() {
    // console.log(red(1), await meta());
    console.log(red(2), await login("nicolas", "NICOLAS"));
    addon({
        name: "AddonTest2",
        description: "",
        version: "1.0.0",
        git: "http://test.fr"
    });
    // console.log(red(3), await users("peter", "parker"));
}

test();

module.exports = { meta, login, users, addon };



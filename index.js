// Require Third-party dependencies
const { get, post, send } = require("httpie");
const { red } = require("kleur");

// Constantes
const PORT = 1337;
const userURL = new URL(`http://localhost:${PORT}`);

// Globals
let accessToken = "";

/**
 * @async
 * @function meta
 * @description Return service metadata
 * @returns {Promise} Object of the request with uptime key
 */
async function meta() {
    return (await get(userURL)).data;
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
    if (username === undefined || password === undefined) {
        console.error(red("This method need two arguments"));
    }
    const { data } = await post(new URL("/login", userURL), {
        body: { username, password }
    });
    accessToken = data.access_token;

    return data;
}

/**
 * @async
 * @function users
 * @description Create a new user.
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise} Object of the request with key userId
 */
async function users(username, password) {
    if (username === undefined || password === undefined) {
        console.error(red("This method need two arguments"));
    }
    const { data } = await post(new URL("/users", userURL), {
        body: { username, password }
    });

    return data;
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
// eslint-disable-next-line consistent-return
async function publish(addon, token) {
    if (addon === undefined || token === undefined) {
        console.error(red("This method need two arguments"));
    }
    try {
        const res = await post(new URL("/addon/publish", userURL), {
            body: { name, description, version, git, organisation } = addon,
            headers: {
                Authorization: token
            }
        });

        return res.data;
    }
    catch (err) {
        console.error(red("Error :"), err.statusCode, err.message);
    }
}

/**
 * @async
 * @function addon
 * @description Get all available addons.
 * @returns {Promise<Array<String>>} Addon array
 */
async function addon() {
    return (await get(new URL("/addon", userURL))).data;
}

/**
 * @async
 * @function addonName
 * @param {!string} name Addon name
 * @description Get a given addon by his name.
 * @returns {Promise} Object with addon infos
 */
async function addonName(name) {
    return (await get(new URL("/addon", userURL))).data;
}

async function test() {
    // console.log(await meta());
    // console.log(await login("nicolas", "NICOLAS"));
    // const token = await login("nicolas", "NICOLAS");
    // console.log(await publish({
    //     name: "sdfdsfvrdsg",
    //     description: "",
    //     version: "1.0.0",
    //     git: "http://test.fr"
    // }, token.access_token));
    // console.log(await users("Sophie", "parkerr"));
    console.log(await addon());
}

test();

module.exports = { meta, login, users, publish, addon };



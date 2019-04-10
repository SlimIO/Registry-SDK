// Require Third-party dependencies
const { get, post, send } = require("httpie");

// Constantes
const PORT = 1337;
const userURL = new URL(`http://localhost:${PORT}`);

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
    if (typeof username !== "string" || typeof password !== "string") {
        throw new TypeError("username and password must be strings");
    }
    const { data } = await post(new URL("/login", userURL), {
        body: { username, password }
    });

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
    if (typeof username !== "string" || typeof password !== "string") {
        throw new TypeError("username and password must be strings");
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
 * @param {!Object} addonInfos Addon infos
 * @param {!string} addonInfos.name Addon name
 * @param {string} addonInfos.description Addon description
 * @param {!string} addonInfos.version Semver
 * @param {!string} addonInfos.git Git url
 * @param {string} addonInfos.organisation Organisaion name
 * @param {!string} token Access token user
 * @returns {Promise} Object with addonId key
 */
// eslint-disable-next-line consistent-return
async function publish(addonInfos, token) {
    if (!Object.keys(addonInfos).length || typeof token !== "string") {
        throw new TypeError("addonInfos mustn't be a empty object, token must be a string");
    }
    const { data } = await post(new URL("/addon/publish", userURL), {
        body: { name, description, version, git, organisation } = addonInfos,
        headers: {
            Authorization: token
        }
    });

    return data;
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
 * @description Get a given addon by his name.
 * @param {!string} addonName Addon name
 * @returns {Promise} Object with addon infos
 */
async function addonName(addonName) {
    if (typeof addonName !== "string") {
        throw new TypeError("addonName must be a string");
    }
    const { data } = await get(new URL(`/addon/${addonName}`, userURL));

    return data;
}

/**
 * @async
 * @function org
 * @description Get all organisations
 * @returns {Promise} Object with organisations infos
 */
async function org() {
    return (await get(new URL("/organisation", userURL))).data;
}

async function test() {
    // console.log(await meta());
    // console.log(await login("nicolas", "NICOLAS"));
    // const token = await login("nicolas", "NICOLAS");
    // console.log(await publish({
    //     name: "test7",
    //     description: "",
    //     version: "1.0.0",
    //     git: "http://test.fr"
    // }, token.access_token));
    // console.log(await users("Sophie", "parkerr"));
    // console.log(await addon());
    // console.log(await addonName("test3"));
    console.log(await org());
}

test();

module.exports = { meta, login, users, publish, addon, addonName };



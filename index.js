// Require Internal dependencies
const { typeArg } = require("./src/utils");

// Require Third-party dependencies
const { get, post } = require("httpie");

// Constantes
const PORT = 1337;
const userURL = new URL(`http://localhost:${PORT}`);

/**
 * @async
 * @function meta
 * @description Return service metadata
 * @returns {Promise<Object>} Object of the request with uptime key
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
 * @returns {Promise<Object>} Object of the request with access_token key
 */
async function login(username, password) {
    if (typeArg(username, password)) {
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
 * @returns {Promise<Object>} Object of the request with key userId
 */
async function users(username, password) {
    if (typeArg(username, password)) {
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
 * @returns {Promise<Object>} Object with addonId key
 */
// eslint-disable-next-line consistent-return
async function publish(addonInfos, token) {
    if (!Object.keys(addonInfos).length || typeArg(token)) {
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
 * @returns {Promise<Object>} Object with addon infos
 */
async function addonName(addonName) {
    if (typeArg(addonName)) {
        throw new TypeError("addonName must be a string");
    }

    return (await get(new URL(`/addon/${addonName}`, userURL))).data;
}

/**
 * @async
 * @function orga
 * @description Get all organisations
 * @returns {Promise<Object>} Object with organisations infos
 */
async function orga() {
    return (await get(new URL("/organisation", userURL))).data;
}

/**
 * @async
 * @function orgaName
 * @description Get an organisation by his name
 * @param {!string} name Organisation name
 * @returns {Promise<Object>} Object with organisation infos
 */
async function orgaName(name) {
    if (typeArg(name)) {
        throw new TypeError("name must be a string");
    }

    return (await get(new URL(`/organisation/${name}`, userURL))).data;
}

/**
 * @async
 * @function addUser
 * @description Add a user to an organisation.
 * @param {!string} orgaName Organisation name
 * @param {!string} userName User name
 * @param {!string} token User token
 * @returns {Promise<Object>} Object with organisation and user infos
 */
async function addUser(orgaName, userName, token) {
    if (typeArg(orgaName, userName, token)) {
        throw new TypeError("orgaName, userName and token must be strings");
    }

    const resource = `/organisation/${orgaName}/${userName}`;
    const { data } = await post(new URL(resource, userURL), {
        headers: {
            Authorization: token
        }
    });

    return data;
}

module.exports = {
    meta,
    login,
    users,
    publish,
    addon,
    addonName,
    orga,
    orgaName,
    addUser
};



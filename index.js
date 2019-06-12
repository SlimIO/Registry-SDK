// Require Node.js dependencies
const { readFile, readdir } = require("fs").promises;
const { normalize, join } = require("path");

// Require Third-party dependencies
const { get, post } = require("httpie");
const Manifest = require("@slimio/manifest");

// CONSTANTS
const constants = {
    registry_url: new URL("http://localhost:1338")
};

function isString(arg, argName) {
    if (typeof arg !== "string") {
        throw new TypeError(`${argName} must be a string`);
    }
}

/**
 * @namespace RegistrySDK
 */

/**
 * @typedef {Object} MetaData
 * @property {number} uptime Service metadata.
 */

/**
 * @async
 * @function meta
 * @description Return service metadata
 * @memberof RegistrySDK#
 * @returns {Promise<MetaData>} Object of the request with uptime key
 */
async function meta() {
    return (await get(constants.registry_url)).data;
}

/**
 * @async
 * @function login
 * @description Authenticate a user and get an AccessToken.
 * @memberof RegistrySDK#
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise<String>} Object of the request with access_token key
 *
 * @throws {TypeError}
 */
async function login(username, password) {
    isString(username, "username");
    isString(password, "password");

    const { data } = await post(new URL("/login", constants.registry_url), {
        body: { username, password }
    });

    return data.access_token;
}

/**
 * @typedef {Object} userId
 * @property {number} userId user Id in number
 */

/**
 * @async
 * @function createAccount
 * @description Create a new user account.
 * @memberof RegistrySDK#
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise<userId>} Object of the request with userId key
 *
 * @throws {TypeError}
 */
async function createAccount(username, password) {
    isString(username, "username");
    isString(password, "password");

    const { data } = await post(new URL("/users", constants.registry_url), {
        body: { username, password }
    });

    return data;
}

/**
 * @typedef {Object} addonId
 * @property {number} addonId Addon id
 */

/**
 * @async
 * @function publishAddon
 * @description Create or update an Addon release.
 * @memberof RegistrySDK#
 * @param {!string} addonDirectory Main path addon directory
 * @param {!string} token Access token user
 * @returns {Promise<addonId>} Object with addonId key
 *
 * @throws {TypeError}
 * @throws {Error}
 */
async function publishAddon(addonDirectory, token) {
    isString(addonDirectory, "addonDirectory");
    isString(token, "token");

    // Read SlimIO manifest
    const manifest = await Manifest.open(join(addonDirectory, "slimio.toml"));
    if (manifest.type !== "Addon") {
        throw new Error("Your project must be an 'Addon'");
    }
    const { name, version, org } = manifest.toJSON();

    // Read package.json
    const buf = await readFile(join(addonDirectory, "package.json"));
    const { description = "", homepage: git } = JSON.parse(buf.toString());
    const body = { description, git, name, version };
    if (typeof org === "string") {
        Reflect.set(body, "organization", org);
    }

    // Query
    const { data } = await post(new URL("/addon/publish", constants.registry_url), {
        body, headers: { Authorization: token }
    });

    return data;
}

/**
 * @async
 * @function getAllAddons
 * @description Get all available addons.
 * @memberof RegistrySDK#
 * @returns {Promise<Array<String>>} Addon array
 */
async function getAllAddons() {
    return (await get(new URL("/addon", constants.registry_url))).data;
}

/**
 * @async
 * @function getOneAddon
 * @description Get a given addon by his name.
 * @memberof RegistrySDK#
 * @param {!string} addonName Addon name
 * @returns {Promise<Object>} Object with addon infos
 *
 * @throws {TypeError}
 */
async function getOneAddon(addonName) {
    isString(addonName, "addonName");

    return (await get(new URL(`/addon/${addonName}`, constants.registry_url))).data;
}

/**
 * @typedef {Object} listOrgas
 * @property {string} name
 */
/**
 * @async
 * @function getAllOrganizations
 * @description Get all organisations
 * @memberof RegistrySDK#
 * @returns {Promise<listOrgas>} Object with organisations infos
 */
async function getAllOrganizations() {
    return (await get(new URL("/organisation", constants.registry_url))).data;
}

/**
 * @async
 * @function getOneOrganization
 * @description Get an organisation by his name
 * @memberof RegistrySDK#
 * @param {!string} orgaName Organisation name
 * @returns {Promise<Object>} Object with organisation infos
 *
 * @throws {TypeError}
 */
async function getOneOrganization(orgaName) {
    isString(orgaName, "orgaName");

    return (await get(new URL(`/organisation/${orgaName}`, constants.registry_url))).data;
}

/**
 * @async
 * @function orgaAddUser
 * @description Add a user to an organisation.
 * @memberof RegistrySDK#
 * @param {!string} orgaName Organisation name
 * @param {!string} username User name
 * @param {!string} token User token
 * @returns {Promise<Object>} Object with organisation and user infos
 *
 * @throws {TypeError}
 */
async function orgaAddUser(orgaName, username, token) {
    isString(orgaName, "orgaName");
    isString(username, "username");
    isString(token, "token");

    const resource = `/organisation/${orgaName}/${username}`;
    const { data } = await post(new URL(resource, constants.registry_url), {
        headers: {
            Authorization: token
        }
    });

    return data;
}

module.exports = Object.freeze({
    constants,
    meta,
    login,
    createAccount,
    publishAddon,
    getAllAddons,
    getOneAddon,
    getAllOrganizations,
    getOneOrganization,
    orgaAddUser
});



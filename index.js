// Require Internal dependencies
const { argsMustBeString } = require("./src/utils");

// Require Third-party dependencies
const { get, post } = require("httpie");

// Constantes
const PORT = 1337;
const REGISTRY_URL = new URL(`http://localhost:${PORT}`);

/**
 * @typedef {Object} MetaData
 * @property {number} uptime Service metadata.
 */
/**
 * @async
 * @function meta
 * @description Return service metadata
 * @returns {Promise<MetaData>} Object of the request with uptime key
 */
async function meta() {
    return (await get(REGISTRY_URL)).data;
}

/**
 * @typedef {Object} AccessToken
 * @property {string} access_token AccessToken which will be required for some endpoints
 */
/**
 * @async
 * @function login
 * @description Authenticate a user and get an AccessToken.
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise<AccessToken>} Object of the request with access_token key
 */
async function login(username, password) {
    argsMustBeString(username, password);

    const { data } = await post(new URL("/login", REGISTRY_URL), {
        body: { username, password }
    });

    return data;
}

/**
 * @typedef {Object} userId
 * @property {number} userId user Id in number
 */
/**
 * @async
 * @function users
 * @description Create a new user.
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise<userId>} Object of the request with userId key
 */
async function users(username, password) {
    argsMustBeString(username, password);

    const { data } = await post(new URL("/users", REGISTRY_URL), {
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
 * @function publish
 * @description Create or update an Addon release.
 * @param {Object<addonInfos>} addonInfos Addon infos
 * @param {!string} addonInfos.name Addon name
 * @param {string} addonInfos.description Addon description
 * @param {!string} addonInfos.version Semver
 * @param {!string} addonInfos.git Git url
 * @param {string} addonInfos.organisation Organisaion name
 * @param {!string} token Access token user
 * @returns {Promise<addonId>} Object with addonId key
 */
// eslint-disable-next-line consistent-return
async function publish(addonInfos, token) {
    if (!Object.keys(addonInfos).length) {
        throw new TypeError("addonInfos mustn't be a empty object");
    }
    argsMustBeString(token);

    const { data } = await post(new URL("/addon/publish", REGISTRY_URL), {
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
    return (await get(new URL("/addon", REGISTRY_URL))).data;
}

/**
 * @typedef {Object} listAddons
 */
/**
 * @async
 * @function addonName
 * @description Get a given addon by his name.
 * @param {!string} addonName Addon name
 * @returns {Promise<listAddons>} Object with addon infos
 */
async function addonName(addonName) {
    argsMustBeString(addonName);

    return (await get(new URL(`/addon/${addonName}`, REGISTRY_URL))).data;
}

/**
 * @typedef {Object} listOrgas
 * @property {string} name
 */
/**
 * @async
 * @function orga
 * @description Get all organisations
 * @returns {Promise<listOrgas>} Object with organisations infos
 */
async function orga() {
    return (await get(new URL("/organisation", REGISTRY_URL))).data;
}

/**
 * @typedef {Object} orgaInfo
 */
/**
 * @async
 * @function orgaName
 * @description Get an organisation by his name
 * @param {!string} name Organisation name
 * @returns {Promise<orgaInfo>} Object with organisation infos
 */
async function orgaName(name) {
    argsMustBeString(name);

    return (await get(new URL(`/organisation/${name}`, REGISTRY_URL))).data;
}

/**
 * @typedef {Object} orgaUserinfos
 */
/**
 * @async
 * @function OrgaAddUser
 * @description Add a user to an organisation.
 * @param {!string} orgaName Organisation name
 * @param {!string} userName User name
 * @param {!string} token User token
 * @returns {Promise<orgaUserinfos>} Object with organisation and user infos
 */
async function OrgaAddUser(orgaName, userName, token) {
    argsMustBeString(orgaName, userName, token);

    const resource = `/organisation/${orgaName}/${userName}`;
    const { data } = await post(new URL(resource, REGISTRY_URL), {
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
    OrgaAddUser
};



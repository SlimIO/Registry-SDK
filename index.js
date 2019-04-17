// Require Node.js dependencies
const { readFile, readdir } = require("fs").promises;
const { normalize, isAbsolute, join } = require("path");

// Require Third-party dependencies
const { get, post } = require("httpie");
const ow = require("ow");
const Manifest = require("@slimio/manifest");

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
    // Check if arguments are strings
    ow(username, ow.string);
    ow(password, ow.string);

    const { data } = await post(new URL("/login", REGISTRY_URL), {
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
 * @function users
 * @description Create a new user.
 * @param {!string} username User name
 * @param {!string} password User password
 * @returns {Promise<userId>} Object of the request with userId key
 */
async function users(username, password) {
    // Check if arguments are strings
    ow(username, ow.string);
    ow(password, ow.string);

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
 * @param {!string} addonMainDir Main path addon directory
 * @param {!string} token Access token user
 * @returns {Promise<addonId>} Object with addonId key
 */
async function publish(addonMainDir, token) {
    // Check if arguments are strings
    ow(addonMainDir, ow.string);
    ow(token, ow.string);

    const pathAddon = normalize(addonMainDir);
    if (!isAbsolute(pathAddon)) {
        throw new Error("The Addon main directory path is incorect");
    }
    // Extract data
    try {
        const elemsMainDir = new Set(await readdir(pathAddon));
        if (!elemsMainDir.has("package.json")) {
            throw new Error(`package.json doesn't exist in "${pathAddon}" !`);
        }
        if (!elemsMainDir.has("slimio.toml")) {
            throw new Error(`slimio.toml doesn't exist in "${pathAddon}" !`);
        }

        const manifest = await Manifest.open(join(pathAddon, "slimio.toml"));
        if (manifest.type !== "Addon") {
            throw new Error("Your project isn't of addon type");
        }

        const readPkg = await readFile(join(pathAddon, "package.json"));
        const pkgJSON = JSON.parse(readPkg);
        const elems = {
            description: pkgJSON.description,
            git: pkgJSON.homepage,
            name: manifest.name,
            organisation: manifest.organisation || "Organisation",
            version: manifest.version
        };
        // Query
        const { data } = await post(new URL("/addon/publish", REGISTRY_URL), {
            body: elems,
            headers: {
                Authorization: token
            }
        });

        return data;
    }
    catch (err) {
        throw err;
    }
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
 * @typedef {Object} addonInfos
 */
/**
 * @async
 * @function addonName
 * @description Get a given addon by his name.
 * @param {!string} name Addon name
 * @returns {Promise<addonInfos>} Object with addon infos
 */
async function addonName(name) {
    // Check if arguments are strings
    ow(name, ow.string);

    return (await get(new URL(`/addon/${name}`, REGISTRY_URL))).data;
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
 * @typedef {Object} orgaInfos
 */
/**
 * @async
 * @function orgaName
 * @description Get an organisation by his name
 * @param {!string} name Organisation name
 * @returns {Promise<orgaInfos>} Object with organisation infos
 */
async function orgaName(name) {
    // Check if arguments are strings
    ow(name, ow.string);

    return (await get(new URL(`/organisation/${name}`, REGISTRY_URL))).data;
}

/**
 * @typedef {Object} orgaUserinfos
 */
/**
 * @async
 * @function orgaAddUser
 * @description Add a user to an organisation.
 * @param {!string} organame Organisation name
 * @param {!string} username User name
 * @param {!string} token User token
 * @returns {Promise<orgaUserinfos>} Object with organisation and user infos
 */
async function orgaAddUser(organame, username, token) {
    // Check if arguments are strings
    ow(organame, ow.string);
    ow(username, ow.string);
    ow(token, ow.string);

    const resource = `/organisation/${organame}/${username}`;
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
    orgaAddUser
};



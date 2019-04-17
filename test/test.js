// Require Node.js dependencies
const assert = require("assert");

// Require Third-Party dependencies
const { get, post } = require("httpie");
const japa = require("japa");
const is = require("@slimio/is");

// Internal dependencies
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = require("../index");

// Constantes
const PORT = 1337;
const REGISTRY_URL = new URL(`http://localhost:${PORT}`);

japa("meta() should returned an Object with uptime Key", async(assert) => {
    const retMeta = await meta();
    assert.strictEqual(is.plainObject(retMeta), true);
    assert.deepEqual(Object.keys(retMeta), ["uptime"]);
});

japa("login() should returned an error if no arguments", async(assert) => {
    
})

japa("login() should returned a string", async(assert) => {
    const retLogin = await login("admin1", "admin1953");
    assert.strictEqual(is.string(retLogin), true);
});


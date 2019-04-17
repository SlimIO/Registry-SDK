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
const PRIMITIVES = [{}, 10, true, undefined];

japa("meta() should returned an Object with uptime Key (number)", async(assert) => {
    const retMeta = await meta();

    assert.strictEqual(is.plainObject(retMeta), true);
    assert.deepEqual(Object.keys(retMeta), ["uptime"]);
    assert.strictEqual(is.number(retMeta.uptime), true);
});

japa("login() should returned an ArgumentError if argument(s) aren't string", async(assert) => {
    assert.plan(4);

    for (const prim of PRIMITIVES) {
        try {
            await login(prim);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
        }
    }
});

japa("login() should returned a string", async(assert) => {
    const retLogin = await login("admin1", "admin1953");

    assert.strictEqual(is.string(retLogin), true);
});

japa("users() should returned an ArgumentError if argument(s) aren't string", async(assert) => {
    assert.plan(4);

    for (const prim of PRIMITIVES) {
        try {
            await users(prim);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
        }
    }
});

japa("users() should returned an object with userId key (number)", async(assert) => {
    const nbUserRandom = Math.floor(Math.random() * 10000);
    const retUsers = await users(`admin${nbUserRandom}`, "admin1953");

    assert.strictEqual(is.plainObject(retUsers), true);
    assert.deepEqual(Object.keys(retUsers), ["userId"]);
    assert.strictEqual(is.number(retUsers.userId), true);
});

japa("addon() should returned an array", async(assert) => {
    const retAddon = await addon();

    assert.strictEqual(is.array(retAddon), true);
});

japa("addonName should returned an ArgumentError if argument(s) isn't string", async(assert) => {
    assert.plan(4);

    for (const prim of PRIMITIVES) {
        try {
            await addonName(prim);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
        }
    }
});

japa("addonName should returned an object", async(assert) => {
    const retAddonName = await addonName("memory");

    assert.strictEqual(is.plainObject(retAddonName), true);
    assert.deepEqual(Object.keys(retAddonName).sort(), [
        "name",
        "description",
        "git",
        "createdAt",
        "updatedAt",
        "author",
        "organisation",
        "versions"
    ].sort());
});

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

japa("meta() should returned an Object with uptime Key (number)", async(assert) => {
    const retMeta = await meta();

    assert.strictEqual(is.plainObject(retMeta), true);
    assert.deepEqual(Object.keys(retMeta), ["uptime"]);
    assert.strictEqual(is.number(retMeta.uptime), true);
});

japa("login() should returned an ArgumentError if no arguments", async(assert) => {
    assert.plan(1);

    try {
        await login();
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
    }
});

japa("login() should returned an ArgumentError if just one arguments", async(assert) => {
    assert.plan(1);

    try {
        await login("test");
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
    }
});

japa("login() should returned an ArgumentError if arguments aren't string", async(assert) => {
    assert.plan(1);

    try {
        await login("test", 50);
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
    }
});

japa("login() should returned a string", async(assert) => {
    const retLogin = await login("admin1", "admin1953");

    assert.strictEqual(is.string(retLogin), true);
});

japa("users() should returned an ArgumentError if no arguments", async(assert) => {
    assert.plan(1);

    try {
        await users();
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
    }
});

japa("users() should returned an ArgumentError if just one arguments", async(assert) => {
    assert.plan(1);

    try {
        await users("test");
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
    }
});

japa("users() should returned an ArgumentError if arguments aren't string", async(assert) => {
    assert.plan(1);

    try {
        await users("test", 50);
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
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

japa("addonName should returned an ArgumentError if no argument", async(assert) => {
    try {
        await addonName();
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
    }
});

japa("addonName should returned an ArgumentError if argument isn't string", async(assert) => {
    try {
        await addonName(20);
    }
    catch (err) {
        assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
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

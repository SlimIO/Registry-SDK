// Require Node.js dependencies
const { writeFile, unlink } = require("fs").promises;
const { join } = require("path");

// Require Third-Party dependencies
const japa = require("japa");
const is = require("@slimio/is");

// Internal dependencies
const setOfMethods = require("../index");
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = setOfMethods;

// Constantes
const PRIMITIVES = [{}, 10, true, undefined];
const PATH = __dirname;

japa("require of index.js should returned the set methods", (assert) => {
    assert.strictEqual(is.plainObject(setOfMethods), true);
    assert.deepEqual(Object.keys(setOfMethods).sort(), [
        "meta",
        "login",
        "users",
        "addon",
        "addonName",
        "publish",
        "orga",
        "orgaName",
        "orgaAddUser"
    ].sort());
});

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

japa.skip("users() should returned an object with userId key (number)", async(assert) => {
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

japa("addonName() should returned an ArgumentError if argument(s) isn't string", async(assert) => {
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

japa("addonName() should returned an object", async(assert) => {
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

japa("publish() should returned an ArgumentError if argument(s) isn't string", async(assert) => {
    assert.plan(4);

    for (const prim of PRIMITIVES) {
        try {
            await publish(prim);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError");
        }
    }
});

japa("publish() should returned an Error if first argument isn't path of a directory", async(assert) => {
    assert.plan(1);

    try {
        await publish("ZzzzzzBlaaaaa", "myToken");
    }
    catch ({ message }) {
        assert.strictEqual(message, "The Addon main directory path is incorect");
    }
});

japa("publish() should returned an Error if package.json doesn't exist", async(assert) => {
    assert.plan(1);

    try {
        await publish(PATH, "myToken");
    }
    catch ({ message }) {
        assert.strictEqual(message, `package.json doesn't exist in "${__dirname}" !`);
    }
});

japa("publish() should returned an Error if slimio.toml doesn't exist", async(assert) => {
    assert.plan(1);

    await writeFile(join(__dirname, "package.json"), "");
    try {
        await publish(PATH, "myToken");
    }
    catch ({ message }) {
        assert.strictEqual(message, `slimio.toml doesn't exist in "${__dirname}" !`);
    }
    unlink(join(PATH, "package.json"));
});

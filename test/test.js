// Require Node.js dependencies
const { writeFile, unlink } = require("fs").promises;
const { join } = require("path");

// Require Third-Party dependencies
const japa = require("japa");
const is = require("@slimio/is");
const Manifest = require("@slimio/manifest");

// Internal dependencies
const setOfMethods = require("../index");
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = setOfMethods;

// Constantes
const CONTENT_PKG = "{\"description\": \"There is a description here\", \"homepage\": \"There is an url here\"}";
const CONTENT_TOML = "name = \"test\"\nversion = \"0.1.0\"\ntype = \"Package\"\ndependencies = { }";
const PRIMITIVES = [{}, 10, true, undefined];
const PATH = __dirname;
const PATH_PKG = join(PATH, "package.json");
const PATH_TOML = join(PATH, "slimio.toml");

japa.group("Test methods", (group) => {
    group.before(async() => {
        await writeFile(PATH_PKG, CONTENT_PKG);
        await writeFile(PATH_TOML, CONTENT_TOML);
    });

    group.after(async() => {
        await unlink(PATH_PKG);
        await unlink(PATH_TOML);
    });

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

        await unlink(PATH_PKG);
        try {
            await publish(PATH, "myToken");
        }
        catch ({ message }) {
            assert.strictEqual(message, `package.json doesn't exist in "${__dirname}" !`);
        }
        await writeFile(PATH_PKG, CONTENT_PKG);
    });

    japa("publish() should returned an Error if slimio.toml doesn't exist", async(assert) => {
        assert.plan(1);

        await unlink(PATH_TOML);
        try {
            await publish(PATH, "myToken");
        }
        catch ({ message }) {
            assert.strictEqual(message, `slimio.toml doesn't exist in "${PATH}" !`);
        }
        await writeFile(PATH_TOML, CONTENT_TOML);
    });

    japa("publish() should returned an Error if project isn't addon type", async(assert) => {
        assert.plan(1);

        try {
            await publish(PATH, "myToken");
        }
        catch ({ message }) {
            assert.strictEqual(message, "Your project isn't of addon type");
        }
    });

    japa("publish() should returned an object with addonId (number)", async(assert) => {
        const newContentToml = CONTENT_TOML.replace("Package", "Addon");
        await writeFile(PATH_TOML, newContentToml);
        const token = await login("admin1", "admin1953");
        const retPublish = await publish(PATH, token);
        assert.strictEqual(is.plainObject(retPublish), true);
        assert.deepEqual(Object.keys(retPublish), ["addonId"]);
        assert.strictEqual(is.number(retPublish.addonId), true);
    });
});



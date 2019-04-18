// Require Node.js dependencies
const { writeFile, unlink } = require("fs").promises;
const { join } = require("path");

// Require Third-Party dependencies
const japa = require("japa");
const is = require("@slimio/is");

// Internal dependencies
const setOfMethods = require("../index");
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = setOfMethods;

// Constants
const NB_RANDOM = Math.floor(Math.random() * 10000);
const CONTENT_PKG = "{\"description\": \"There is a description here\", \"homepage\": \"There is an url here\"}";
const CONTENT_TOML = `name = "test${NB_RANDOM}"\nversion = "0.1.0"\ntype = "Package"\ndependencies = { }`;
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
        assert.strictEqual(is.plainObject(setOfMethods), true, "Exported module must be a plain Object");
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
        ].sort(), "Exported module must have all methods");
    });

    japa("meta() should returned an Object with uptime Key (number)", async(assert) => {
        const retMeta = await meta();

        assert.strictEqual(is.plainObject(retMeta), true, "Returned data must be a plain object");
        assert.deepEqual(Object.keys(retMeta), ["uptime"], "The object must contain a 'uptime' key");
        assert.strictEqual(is.number(retMeta.uptime), true, "'uptime' key's value must be a number");
    });

    japa("login() should returned an ArgumentError if first argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await login(1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("login() should returned an ArgumentError if second argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await login("admin1", 1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("login() should returned a string", async(assert) => {
        const retLogin = await login("admin1", "admin1953");

        assert.strictEqual(is.string(retLogin), true, "Returned data must be a string");
    });

    japa("users() should returned an ArgumentError if first argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await users(true);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("users() should returned an ArgumentError if second argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await users("adminTest", 1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("users() should returned an object with userId key (number)", async(assert) => {
        const retUsers = await users(`admin${NB_RANDOM}`, "admin1953");

        assert.strictEqual(is.plainObject(retUsers), true, "Returned data must be a plain object");
        assert.deepEqual(Object.keys(retUsers), ["userId"], "The object must contain a 'userId' key");
        assert.strictEqual(is.number(retUsers.userId), true, "'userId' key's value must be a number");
    });

    japa("addon() should returned an array", async(assert) => {
        const retAddon = await addon();

        assert.strictEqual(is.array(retAddon), true, "Returned data must be an array");
    });

    japa("addonName() should returned an ArgumentError if argument isn't a string", async(assert) => {
        assert.plan(1);

        try {
            await addonName(1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("addonName() should returned an object", async(assert) => {
        const retAddonName = await addonName("memory");

        assert.strictEqual(is.plainObject(retAddonName), true, "Returned data must be a plain object");
        assert.deepEqual(Object.keys(retAddonName).sort(), [
            "name",
            "description",
            "git",
            "createdAt",
            "updatedAt",
            "author",
            "organisation",
            "versions"
        ].sort(), "Returned object must contain all keys");
    });

    japa("publish() should returned an ArgumentError if first argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await publish(1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("publish() should returned an ArgumentError if second argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await publish(PATH, 1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("publish() should returned an Error if first argument isn't path of a directory", async(assert) => {
        assert.plan(1);

        try {
            await publish("ZzzzzzBlaaaaa", "myToken");
        }
        catch ({ message }) {
            assert.strictEqual(message, "The Addon main directory path is incorect", "The directory path must be absolute");
        }
    });

    japa("publish() should returned an Error if package.json doesn't exist", async(assert) => {
        assert.plan(1);

        await unlink(PATH_PKG);
        try {
            await publish(PATH, "myToken");
        }
        catch ({ message }) {
            assert.strictEqual(message, `package.json doesn't exist in "${__dirname}" !`, "Package.json must exist");
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
            assert.strictEqual(message, `slimio.toml doesn't exist in "${PATH}" !`, "Slimio.toml must exist");
        }
        await writeFile(PATH_TOML, CONTENT_TOML);
    });

    japa("publish() should returned an Error if project isn't addon type", async(assert) => {
        assert.plan(1);

        try {
            await publish(PATH, "myToken");
        }
        catch ({ message }) {
            assert.strictEqual(message, "Your project isn't of addon type", "The project must be of type 'Addon'");
        }
    });

    japa("publish() should returned an object with addonId (number)", async(assert) => {
        const newContentToml = CONTENT_TOML.replace("Package", "Addon");
        await writeFile(PATH_TOML, newContentToml);
        const token = await login("admin1", "admin1953");
        const retPublish = await publish(PATH, token);
        assert.strictEqual(is.plainObject(retPublish), true, "Returned data must be a plain object");
        assert.deepEqual(Object.keys(retPublish), ["addonId"], "Returned object must contain a 'addonId' key");
        assert.strictEqual(is.number(retPublish.addonId), true, "'addonId' must be a number");
    });

    japa("orga() should returned an object", async(assert) => {
        const retOrga = await orga();
        assert.strictEqual(is.plainObject(retOrga), true, "Returned data must be a plain object");
        assert.strictEqual(Object.keys(retOrga).every((key) => typeof String), true, "All keys must be strings");
    });

    japa("orgaName() should returned an ArgumentError if argument isn't a string", async(assert) => {
        assert.plan(1);

        try {
            await orgaName(1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("orgaName() should returned an object", async(assert) => {
        const retOrgaName = await orgaName("Organisation");
        assert.strictEqual(is.plainObject(retOrgaName), true, "Returned data must be a plain object");
        assert.deepEqual(Object.keys(retOrgaName).sort(), [
            "name",
            "description",
            "createdAt",
            "updatedAt",
            "owner",
            "users",
            "addons"
        ].sort(), "Returned object must contain all keys");
    });

    japa("orgaAddUser() should returned an ArgumentError if first argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await orgaAddUser(true);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("orgaAddUser() should returned an ArgumentError if second argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await orgaAddUser("Organisation", 1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("orgaAddUser() should returned an ArgumentError if third argument isn't string", async(assert) => {
        assert.plan(1);

        try {
            await orgaAddUser("Organisation", "Kirikou", 1234);
        }
        catch (err) {
            assert.strictEqual(Reflect.get(err, "name"), "ArgumentError", "Argument must be a string");
        }
    });

    japa("orgaAddUser() should returned an object", async(assert) => {
        await users(`Kirikou${NB_RANDOM}`, "EstPetit");
        const token = await login("admin1", "admin1953");
        const retOrgaAddUser = await orgaAddUser("Organisation", `Kirikou${NB_RANDOM}`, token);
        assert.strictEqual(is.plainObject(retOrgaAddUser), true, "Returned data must be a plain object");
        assert.deepEqual(Object.keys(retOrgaAddUser).sort(), [
            "createdAt",
            "updatedAt",
            "organisationId",
            "userId"
        ].sort(), "Returned object must contain all keys");
    });
});



require("make-promises-safe");
require("dotenv").config();

// Require Node.js dependencies
const fs = require("fs");
const { writeFile, readFile, rmdir } = fs.promises;
const { join } = require("path");
const { spawn } = require("child_process");
const { sync: spawnSync } = require("cross-spawn");

// Require Third-Party dependencies
const japa = require("japa");
const git = require("isomorphic-git");
const Spinner = require("@slimio/async-cli-spinner");
const is = require("@slimio/is");

// Internal dependencies
const registrySDK = require("../");

// Configure & Globals
git.plugins.set("fs", fs);
let cp = null;

// CONSTANTS
const REG_DIR = join(__dirname, "registry");

japa.group("Registry SDK", (group) => {
    let accessToken;
    group.before(async() => {
        await rmdir(REG_DIR, { recursive: true });

        // Clone registry
        const spinClone = new Spinner({ text: "Cloning Registry from Github" }).start();
        await git.clone({
            dir: REG_DIR,
            url: "https://github.com/SlimIO/Registry.git"
        });
        spinClone.succeed();

        // Install node_modules
        console.log("Installing Registry dependencies");
        spawnSync(`npm`, ["ci", "--only=production"], { cwd: REG_DIR, stdio: "inherit" });

        // Create .env file
        const buf = await readFile(join(__dirname, "envdata.txt"), "utf-8");
        await writeFile(join(REG_DIR, ".env"), buf.concat(`GIT_TOKEN=${process.env.GIT_TOKEN}`));

        const hydrateSpin = new Spinner({ text: "Hydrate SQLite database" }).start();
        spawnSync(process.argv[0], ["scripts/hydrate.js"], {
            cwd: REG_DIR, stdio: "ignore"
        });
        hydrateSpin.succeed();

        // Npm start
        cp = spawn(process.argv[0], ["index.js"], {
            cwd: REG_DIR, stdio: "inherit"
        });

        // Wait for the registry to be started!
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("\n");
    });

    group.after(async() => {
        cp.kill();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await rmdir(REG_DIR, { recursive: true });
    });

    japa("Check exported members", (assert) => {
        assert.isTrue(Object.isFrozen(registrySDK));
        assert.isTrue(is.plainObject(registrySDK));
        assert.deepEqual(Object.keys(registrySDK), [
            "constants", "meta", "login", "createAccount", "publishAddon",
            "getAllAddons", "getOneAddon", "getAllOrganizations",
            "getOneOrganization", "orgaAddUser"
        ]);
        assert.isTrue(is.plainObject(registrySDK.constants));
        assert.deepEqual(Object.keys(registrySDK.constants), ["registry_url"]);
        assert.isTrue(registrySDK.constants.registry_url instanceof URL);
    });

    japa("Get metadata", async(assert) => {
        const meta = await registrySDK.meta();
        assert.isTrue(is.plainObject(meta));
        assert.deepEqual(Object.keys(meta), ["uptime"]);
        assert.isTrue(typeof meta.uptime === "number");
    });

    japa("Get addons", async(assert) => {
        const addons = await registrySDK.getAllAddons();
        assert.deepEqual(addons, ["cpu-addon", "ihm"]);
    });

    japa("Create new account", async(assert) => {
        const ret = await registrySDK.createAccount("fraxken", "p@ssword", "test@gmail.com");
        assert.isTrue(typeof ret === "undefined");

        accessToken = await registrySDK.login("administrator", "administrator");
        assert.isTrue(typeof accessToken === "string");
    }).timeout(5000);

    japa("Publish noa addon", async(assert) => {
        const ret = await registrySDK.publishAddon(join(__dirname, "noa"), accessToken);
        assert.isTrue(is.plainObject(ret));
        assert.equal(ret.addonId, 3);

        const addon = await registrySDK.getOneAddon("noa");
        assert.equal(addon.name, "noa");
        assert.isTrue(is.plainObject(addon.author));
        assert.equal(addon.author.username, "administrator");
        assert.equal(addon.description, "My package description here!");
        assert.equal(addon.organisation, null);
    });

    japa("Get all or one orga", async(assert) => {
        const orgs = await registrySDK.getAllOrganizations();
        assert.deepEqual(Object.keys(orgs), ["SlimIO"]);
        assert.equal(orgs.SlimIO.description, "SlimIO Official Organisation");
        assert.equal(orgs.SlimIO.owner, "administrator");
        assert.deepEqual(orgs.SlimIO.users, []);
        assert.deepEqual(orgs.SlimIO.addons, ["cpu-addon", "ihm"]);

        const SlimIO = await registrySDK.getOneOrganization("SlimIO");
        assert.equal(SlimIO.name, "SlimIO");
    });

    japa("Add fraxken to the SlimIO Organization", async(assert) => {
        await registrySDK.orgaAddUser("SlimIO", "fraxken", accessToken);

        const SlimIO = await registrySDK.getOneOrganization("SlimIO");
        assert.deepEqual(SlimIO.users, [{ username: "fraxken" }]);
    });
});

// Require Node.js dependencies
const fs = require("fs");
const { writeFile, readFile, access } = fs.promises;
const { join } = require("path");
const { spawn } = require("child_process");

// Require Third-Party dependencies
const japa = require("japa");
const git = require("isomorphic-git");
const del = require("del");
const ora = require("ora");
const is = require("@slimio/is");

// Internal dependencies
const registrySDK = require("../");

// Configure & Globals
git.plugins.set("fs", fs);
let cp = null;

// CONSTANTS
const REG_DIR = join(__dirname, "registry");
const EXEC_SUFFIX = process.platform === "win32";

japa.group("Registry SDK", (group) => {
    group.before(async() => {
        const spin1 = ora("Deleting ./registry").start();
        try {
            await access(REG_DIR);
            await del([REG_DIR]);
            spin1.succeed();
        }
        catch (err) {
            // ignore
            spin1.fail(err.message);
        }

        // Clone registry
        const spinClone = ora("Cloning Registry from Github").start();
        await git.clone({
            dir: REG_DIR,
            url: "https://github.com/SlimIO/Registry.git"
        });
        spinClone.succeed();

        // Install node_modules
        const spinInstall = ora("Installing Registry dependencies").start();
        await new Promise((resolve, reject) => {
            const TTYStream = spawn(`npm${EXEC_SUFFIX ? ".cmd" : ""}`, ["install", "--production"], {
                cwd: REG_DIR
            });
            TTYStream.once("close", () => {
                spinInstall.succeed();
                resolve();
            });
            TTYStream.once("error", (err) => {
                spinInstall.fail(err.message);
                reject(err);
            });
        });

        // Create .env file
        const buf = await readFile(join(__dirname, "envdata.txt"));
        await writeFile(join(REG_DIR, ".env"), buf.toString());

        // Npm start
        cp = spawn(process.argv[0], ["index.js"], {
            cwd: REG_DIR, stdio: "inherit"
        });

        // Wait for the registry to be started!
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    group.after(async() => {
        cp.kill();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await del([REG_DIR]);
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
});

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
        cp = spawn(`npm${EXEC_SUFFIX ? ".cmd" : ""}`, ["start"], {
            cwd: REG_DIR, stdio: "inherit"
        });

        // Wait for the registry to be started!
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    group.after(async() => {
        if (cp !== null) {
            cp.kill();
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await del([REG_DIR]);
    });
});

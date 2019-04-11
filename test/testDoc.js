const { meta, login, users, addon, addonName, publish, orga, orgaAddUser, orgaName } = require("../index.js");


async function main() {
    const token = await login("yourUsername", "yourPassword");
    const elems = {
        name: "AddonName",
        description: "AddonDescription",
        version: "Semver",
        git: "GitURL",
        organisation: "Organisation"
    };

    publish(elems, token.access_token).then(console.log);
}

main().catch(console.error);

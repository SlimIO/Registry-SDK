const { meta, login, users, addon, addonName, publish, orga, orgaAddUser, orgaName } = require("../index.js");


async function main() {
    const token = await login("admin", "admin1953");
    const elems = {
        name: "AddonName3",
        description: 12,
        version: "1.0.0",
        git: "GitURL"
    };

    publish(elems, token.access_token).then(console.log);
}

main().catch(console.error);

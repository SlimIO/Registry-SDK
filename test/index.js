const { meta, login, users, addon, addonName, publish, orga, orgaAddUser, orgaName } = require("../index.js");


async function main() {
    const token = await login("admin1", "admin1953");
    const addonId = await publish("test", token);

    return addonId;
}

main().then(console.log).catch(console.error);



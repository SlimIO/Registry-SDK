const { meta, login, users, addon, addonName, publish, orga, orgaAddUser, orgaName } = require("../index.js");


async function main() {
    const token = await login("admin1", "admin1953");
    const interfaceRet = await orgaAddUser("Organisation", "alexandre1", token);

    return interfaceRet;
}

main().then(console.log).catch(console.error);

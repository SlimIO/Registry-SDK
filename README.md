# Registry-SDK
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/Registry-SDK/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/Registry-SDK/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/Registry-SDK.svg)
![size](https://img.shields.io/bundlephobia/min/@slimio/registry-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/SlimIO/Registry-SDK/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SlimIO/Registry-SDK?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Registry-SDK.svg?branch=master)](https://travis-ci.com/SlimIO/Registry-SDK)

Registry-SDK is a bunch of methods to query the [SlimIO Registry API](https://github.com/SlimIO/Registry).

## Requirements
- [Node.js](https://nodejs.org/en/) version 12 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/registry-sdk
# or
$ yarn add @slimio/registry-sdk
```

## Usage example
```js
require("dotenv").config();
const { login } = require("@slimio/registry-sdk");

async function main() {
    // Note: Never store your credentials in clear in the code (use a local .env file).
    const accessToken = await login(process.env.LOGIN, process.env.PASSWORD);
    console.log(accessToken);
}
main().catch(console.error);
```

## API
This section describe the SDK methods. For a complete type definition, take a look at `index.d.ts` !
For more information see the documentation of the [Registry](https://github.com/SlimIO/Registry).

> ⚠️ In the following examples, we often use top-level await


<details><summary>meta(): Promise< MetaData ></summary>
<br />

Return the registry metadata. For the moment only the **uptime** property is available.

```js
const { meta } = require("@slimio/registry-sdk");

const { uptime } = await meta();
console.log(uptime);
```
</details>

### Users methods

<details><summary>login(username: string, password: string): Promise< string ></summary>
<br />

Authenticate a user and return an AccessToken string. This token will be required as argument by some of the SDK methods.

```js
require("dotenv").config();
const { login, publishAddon } = require("@slimio/registry-sdk");

async function main() {
    // Note: Never store your credentials in clear in the code (use a local .env file).
    const accessToken = await login(process.env.LOGIN, process.env.PASSWORD);
    console.log("Your access token: ", accessToken);

    await publishAddon("./addonDir", accessToken);
}
main().catch(console.error);
```
</details>

<details><summary>createAccount(username: string, password: string, email: string): Promise< void ></summary>
<br />

Create a new user account on the registry.
```js
const { createAccount } = require("@slimio/registry-sdk");

await createAccount("newUsername", "newPassword", "yourmail@dot.com");
```
</details>

### Addons methods

<details><summary>getOneAddon(addonName: string): Promise< addonInfos ></summary>
<br />

Get a given addon by his name.
```js
const { getOneAddon } = require("@slimio/registry-sdk");

// Example
const { description, updateAt } = await getOneAddon("memory");

console.log(description, updateAt);
```

This method return an object with all addon's informations. See [Registry](https://github.com/SlimIO/Registry) for more details.
</details>

<details><summary>getAllAddons(): Promise< string[] ></summary>
<br />

Get all available addons on the requested registry. This method return an Array of string containing addons names.
```js
const { getAllAddons } = require("@slimio/registry-sdk");

const addons = await getAllAddons();
console.log(addons);
```
</details>

<details><summary>publishAddon(addonDirectory: string, token: string): Promise< addonId ></summary>
<br />

Create or update an Addon release. This endpoint require an AccessToken.

>⚠️ publishAddon() to need that your main directory must contain package.json and slimio.toml files !

```js
// Example :

const { login, publishAddon } = require("@slimio/registry-sdk");

const myToken = await login("admin", "admin147");
const { addonId } = await publishAddon(__dirname, myToken);

// Return the Id of the new addon
console.log(addonId);
```
</details>

### Organizations methods

<details><summary>getAllOrganizations(): Promise< listOrgas ></summary>
<br />

Get all organisations.

```js
const { getAllOrganizations } = require("@slimio/registry-sdk");

// Example
const organisations = await getAllOrganizations();

// List organisations
console.log(Object.keys(organisations));
```

This method returns an object where each key represents an organization.
</details>

<details><summary>getOneOrganization(orgaName: string): Promise< orgaInfos ></summary>
<br />

Get an organisation by his name.

```js
const { getOneOrganization } = require("@slimio/registry-sdk");

// Example
const { users } = await getOneOrganization("SlimIO");

console.log("SlimIO Users:");
for (const user of users) {
    console.log(`- ${user.username}`);
}
```

This method return an object with all organisation's informations. See [Registry](https://github.com/SlimIO/Registry) for more details.
</details>

<details><summary>orgaAddUser(organame: string, username: string, token: string): Promise< orgaUserinfos ></summary>
<br />

Add a user to an organisation. This endpoint require an AccessToken.

```js
const { users, login, orgaAddUser } = require("@slimio/registry-sdk");

// (!) If the user doesn't exist on the Registry
await createAccount("newUsername", "newPassword");

const myToken = await login("myUsername", "myPassword");
const { createdAt, userId } = await orgaAddUser("orgaName", "newUsername", myToken);

console.log(createdAt, userId);
```
>⚠️ Only Organisation owner can use this method.

This method return an object with the registration informations.

</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/manifest](https://github.com/SlimIO/Manifester#readme)|Minor|Low|SlimIO Manifest|
|[httpie](https://github.com/lukeed/httpie#readme)|Minor|Low|HTTP Request|

## License
MIT

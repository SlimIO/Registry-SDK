# Registry-SDK
![version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

Registry-SDK is a set methods to query the Registry API. A account will required for use this package. See [Registry](https://github.com/SlimIO/Registry).

## Requirements
- Node.js v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/registry-sdk
# or
$ yarn add @slimio/registry-sdk
```

## Usage example
```js
const { meta } = require("@slimio/registry-sdk");

meta().then(console.log).catch(console.error);
```
Return an AccessToken which will be required for some methods.
```js
{
    uptime: number
}
```

## API
All methods return a promise.

### List methods :

<details><summary>meta()</summary>

<br />

Service metadata.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 

Do this :
```js
const { meta } = require("@slimio/registry-sdk");

meta().then(console.log).catch(console.error);
```

Return :
```js
{
    uptime: number
}
```
</details>

<br />

<details><summary>login()</summary>

<br />

Authenticate a user and get an AccessToken.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 
myUsername | String | ✅ | Your name 
myPassword | String | ✅ | Your password 

Do this :
```js
const { login } = require("@slimio/registry-sdk");

login("myUsername", "myPassword")
    .then(console.log)
    .catch(console.error);
```

Return :
```js
string;
```
</details>

<br />

<details><summary>users()</summary>

<br />

Create a new user.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 
newUsername | String | ✅ | User name 
newPassword | String | ✅ | User password 

Do this :
```js
const { users } = require("@slimio/registry-sdk");

users("newUsername", "newPassword")
    .then(console.log)
    .catch(console.error);
```

Return :
```js
{
    userId: number;
}
```
</details>

<br />

<details><summary>publish()</summary>

<br />

Create or update an Addon release. This endpoint require an AccessToken.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 
pathOfAddonMainDir | String | ✅ | path of the addon main directory 
myToken | String | ✅ | My token obtained with login()

>⚠️ publish() to need that your main directory must contain package.json and slimio.toml files !

Do this :
```js
const { login, publish } = require("@slimio/registry-sdk");

async function main() {
    const myToken = await login("myUsername", "myPassword");
    const addonId = await publish("pathOfAddonMainDir", myToken);

    return addonId;
}

main().then(console.log).catch(console.error);
```

Return :
```js
{
    addonId: number
}
```
</details>

<br />

<details><summary>addon()</summary>

<br />

Get all available addons.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 

Do this :
```js
const { addon } = require("@slimio/registry-sdk");

addon().then(console.log).catch(console.error);
```

Return :
```js
[index: number]: string;
```
```js
// Example :
[
    "memory",
    "socket",
    "etc."
]
```
</details>

<br />

<details><summary>addonName()</summary>

<br />

Get a given addon by his name.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 
name | String | ✅ | Addon name

Do this :
```js
const { addonName } = require("@slimio/registry-sdk");

addonName("name").then(console.log).catch(console.error);
```

Return :
```js
{
    name: string,
    description: string,
    git: string,
    createdAt: Date,
    updatedAt: Date,
    author: {
        username: string,
        description: string
    },
    organisations: {
        name: string,
        createdAt: Date,
        updatedAt: Date
    },
    version: [
        {
            version: string,
            createdAt: string
        }
    ]
}
```
</details>

<br />

<details><summary>orga()</summary>

<br />

Get all organisations.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 

Do this :
```js
const { orga } = require("@slimio/registry-sdk");

orga().then(console.log).catch(console.error);
```

Return :
```js
{
    [name: string]: {
        description: string,
        owner: string,
        users: string[]
        addons: string[]
    }
}
```
</details>

<br />

<details><summary>orgaName()</summary>

<br />

Get an organisation by his name.

Argument | Value | Required? | Notes 
--- | --- | :---: | --- 
name | String | ✅ | Organisation name

Do this :
```js
const { orga } = require("@slimio/registry-sdk");

orgaName("name").then(console.log).catch(console.error);
```

Return :
```js
{
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
    owner: {
        username: string,
        createdAt: Date,
        updatedAt: Date
    },
    users: [
        {
            username: string,
            createdAt: Date,
            updatedAt: Date
        }
    ]
    addons: [
        {
            name: string,
            description: string,
            git: string,
            createdAt: Date,
            updatedAt: Date
        }
    ]
}
```
</details>

<br />

<details><summary>orgaAddUser()</summary>

<br />

Add a user to an organisation. This endpoint require an AccessToken.

Do this :
```js
async function main() {
    const myToken = await login("myUsername", "myPassword");
    const interfaceRet = await orgaAddUser("orgaName", "newUsername", myToken);

    return interfaceRet;
}

main().then(console.log).catch(console.error);
```
Return :

```js
{
    createdAt: date,
    updatedAt: date,
    organisationId: number,
    userId: number
}
```
</details>

## License
MIT

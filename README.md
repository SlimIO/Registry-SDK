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
const { login } = require("@slimio/registry-sdk");

async function myToken() {
    console.log(await login(yourUserName, yourPassword));
}

myToken();
```
Return an AccessToken which will be required for some methods.
```js
{
    access_token: string;
}
```

## API
All methods return a promise.

### List methods :

<details><summary>meta()</summary>

Service metadata.

Do this :
```js
const { meta } = require("@slimio/registry-sdk");

meta().then(console.log);
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

Authenticate a user and get an AccessToken.

Do this :
```js
const { login } = require("@slimio/registry-sdk");

login("yourUsername", "yourPassword").then(console.log);
```

Return :

```js
{
    access_token: string;
}
```

</details>

<br />

<details><summary>users()</summary>

Create a new user.

Do this :
```js
const { users } = require("@slimio/registry-sdk");

users("newUsername", "newPassword").then(console.log);
```

Return :

```js
{
    userId: 1
}
```

</details>

<br />

<details><summary>publish()</summary>

Do this :
```js
const { login, publish } = require("@slimio/registry-sdk");

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


```

Return :

```js

```

</details>

<br />

<details><summary>addon()</summary>

Do this :
```js

```

Return :

```js

```

</details>

<br />

<details><summary>addonName()</summary>

Do this :
```js

```

Return :

```js

```

</details>

<br />

<details><summary>orga()</summary>

Do this :
```js

```

Return :

```js

```

</details>

<br />

<details><summary>orgaName()</summary>

Do this :
```js

```

Return :

```js

```

</details>

<br />

<details><summary>orgaAddUser()</summary>

Do this :
```js

```

Return :

```js

```

</details>

## License
MIT

# Okta Web App Sandbox

Sample web app federated with Okta to test sign-on policies.

## Setup

* Requires node and npm
* Install required package by running 'npm install' in the root directory
* Create config.json in the root project directory with the following contents
  * Copy issuer, clientId, and clientSecret from Okta

```json
{
  "oidc": {
    "issuer": "",
    "clientId": "",
    "clientSecret": "",
    "appBaseUrl": "http://localhost:8080",
    "scope": "openid profile",
    "testing": {
      "disableHttpsCheck": false
    }
  },
  "port": 8080
}
```

## Run

* Start server by running 'npm start' in the root directory
  * Access app at <localhost:8080>
* Multiple instances of the app can be run and tested simultaneously
* The Web App Sandbox application in the Okta portal is already configured to work with this app

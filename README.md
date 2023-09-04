# README

This projects contains a sample premium app and an automated on-boarding flow for setting up the app in a Genesys Cloud organization.

## Resources

- [Premium Application Wizard Step by Step Guide](https://developer.genesys.cloud/appfoundry/premium-app-wizard/ "Opens the premium app guide in Genesys Developer Center")
- [AppFoundry Overview](https://developer.genesys.cloud/appfoundry/ "Opens the AppFoundry documentation in Genesys Developer Center")

## Usage

### Development

During dev, run node.js to serve the app:

```sh
npm i
node index.js
```

Also adjust `docs/wizard/config/config.js` to point towards localhost for `wizardUriBase` and `redirectURLOnWizardCompleted`.

Open:

- http://localhost:8080/premium-app-sample/index.html

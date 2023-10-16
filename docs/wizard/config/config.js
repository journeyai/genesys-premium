export default {
  clientID: "f79f98a7-1100-492a-8cea-5735dd6de976",

  // wizardUriBase: "http://localhost:8080/wizard/",
  wizardUriBase: "https://journeyai.github.io/genesys-premium/wizard/",

  // The actual URL of the landing page of your web app or your web site (when wizard has been run).
  // previously - defined as premiumAppURL
  // redirectURLOnWizardCompleted:
  //   "http://localhost:8080/premium-app-sample/index.html",
  redirectURLOnWizardCompleted: "https://app.journeyid.io",
  redirectURLWithParams: true,

  // Genesys Cloud assigned name for the premium app
  // This should match the integration type name of the Premium App
  // NOTE: During initial development please use ‘premium-app-example’.
  //            Once your premium app is approved an integration type will be created
  //            by the Genesys Cloud product team and you can update the name at that time.
  // previously - defined as appName
  premiumAppIntegrationTypeId: "premium-app-example",

  // Optional - Some Premium Applications leverage both a premium app and a premium widget
  premiumWidgetIntegrationTypeId: "premium-widget-example",

  // The minimum permission required for a user to access the Premium App.
  // NOTE: During initial development please use the default permission
  //      'integration:examplePremiumApp:view'. Once your premium app is approved,
  //      the unique integration domain will be generated and this must be updated.
  // previously - defined as viewPermission
  premiumAppViewPermission: "integration:examplePremiumApp:view",
  // Permissions required for running the Wizard App
  // all, premium, wizard, none (default)
  checkInstallPermissions: "none",
  checkProductBYOC: false,

  // Default Values for fail-safe/testing. Shouldn't have to be changed since the app
  // must be able to determine the environment from the query parameter
  // of the integration's URL
  defaultGcEnvironment: "mypurecloud.com",
  defaultLanguage: "en-us",
  // List available language assets - manage gcLangTag with possible formats like: en, en-US, en_US, en-CA, en_CA, ...
  // Values in lower case, using - or no separator
  availableLanguageAssets: {
    "en-us": "English",
    es: "Español",
  },
  enableLanguageSelection: true,

  // The names of the query parameters to check in
  // determining language and environment
  // Ex: www.electric-sheep-app.com?langTag=en-us&environment=mypurecloud.com
  languageQueryParam: "langTag",
  genesysCloudEnvironmentQueryParam: "environment",
  genesysCloudHostOriginQueryParam: "hostOrigin",
  genesysCloudTargetEnvQueryParam: "targetEnv",

  // Enable the optional 'Step 2' in the provisioning process
  // If false, it will not show the page or the step in the wizard
  enableCustomSetupPageBeforeInstall: true,
  // Enable the optional Post Custom Setup module in the install process
  // If true, it will invoke the postCustomSetup module (configure method) after the Genesys Cloud ones (provisioningInfo).
  enableCustomSetupStepAfterInstall: false,

  // Enable the dynamic build of the Install Summary on install.html page
  enableDynamicInstallSummary: true,

  // Displays Text Area for Simplified Installed Data (Summary)
  displaySummarySimplifiedData: true,

  // Allows you to deprovision the installed object by adding the query parameter 'uninstall=true'
  // in the wizard URL. This is merely for testing and should be 'false' in production.
  enableUninstall: true,

  // To be added to names of Genesys Cloud objects created by the wizard
  prefix: "JOURNEY_APP_",

  // These are the Genesys Cloud items that will be added and provisioned by the wizard
  // To see the sample configuration of all possible objects please consult
  // ./sample-provisioning-info.js on the same folder
  provisioningInfo: {
    role: [
      {
        name: "Role",
        description: "Generated role for access to the app.",
        permissionPolicies: [
          {
            domain: "integration",
            entityName: "examplePremiumApp",
            actionSet: ["*"],
            allowConditions: false,
          },
        ],
      },
    ],
    // group: [
    //   {
    //     name: "Supervisors",
    //     description:
    //       "Supervisors have the ability to watch a queue for ACD conversations.",
    //   },
    // ],
    // "app-instance": [
    //   {
    //     name: "Partner Enablement Tools",
    //     url: "https://genesysappfoundry.github.io/partner-enablement-tools/index.html?langTag={{gcLangTag}}&hostOrigin={{gcHostOrigin}}&targetEnv={{gcTargetEnv}}",
    //     type: "standalone",
    //     groups: ["Supervisors"],
    //   },
    // ],
    // "oauth-client": [
    //   {
    //     name: "OAuth Client",
    //     description: "Generated Client that's passed to the App Backend",
    //     roles: ["Role"],
    //     authorizedGrantType: "CLIENT-CREDENTIALS",
    //     /** NOTE:
    //      * If you want to learn how you can send the created credentials back to your system,
    //      * Please read about the Post Custom Setup module here:
    //      * https://developer.genesys.cloud/appfoundry/premium-app-wizard/7-custom-setup#post-custom-setup-module
    //      */
    //   },
    // ],
    "ws-data-actions": [
      {
        name: "Connector",
        autoEnable: true,
        credentialType: "userDefinedOAuth",
        credentials: {
          loginUrl: "https://app.journeyid.io/api/system/auth/token",
          clientId: "${input.clientId}",
          clientSecret: "${input.clientSecret}"
        },
      // OLD hardcoded bearerToken
      // {
      //   name: "Web Services (API Key)",
      //   autoEnable: true,
      //   credentialType: "userDefined",
      //   credentials: {
      //     apiKey: "123",
      //   },
      //   notes:
      //     "Update the Journey api key under the credentials tab.\nIt should be a 'user defined' credential type, with the field name 'apiKey'.",
        "data-actions": [
          // ----- ws data action #1: ExecutePipeline -----
          {
            name: "ExecutePipeline",
            secure: false,
            autoPublish: true,
            config: {
              request: {
                requestUrlTemplate:
                  "https://app.journeyid.io/api/system/executions",
                requestType: "POST",
                headers: {
                  Accept: "application/json",
                  Authorization: "${authResponse.token_type} ${authResponse.access_token}",
                  // Authorization: "Bearer ${credentials.apiKey}",
                  "Content-Type": "application/json",
                },
                requestTemplate:
                  '{ "pipelineKey": "${input.pipelineKey}", "delivery": { "method": "${input.deliveryMethod}", "phoneNumber": "${input.userPhoneNumber}" }, "customer": { "uniqueId": "${input.userUniqueId}" }, "phoneNumber": "${input.userPhoneNumber}", "session": { "externalRef": "${input.interactionId}" }, "language": "${input.language}", "iframeId":"${input.iframeId}"}',
              },
              response: {
                translationMap: {
                  executionId: "$.id",
                },
                translationMapDefaults: {},
                successTemplate: '{"executionId": ${executionId}}',
              },
            },
            contract: {
              input: {
                inputSchema: {
                  title: "Journey",
                  type: "object",
                  properties: {
                    pipelineKey: {
                      type: "string",
                    },
                    interactionId: {
                      type: "string",
                    },
                    userPhoneNumber: {
                      type: "string",
                    },
                    userUniqueId: {
                      type: "string",
                    },
                    deliveryMethod: {
                      type: "string",
                    },
                    language: {
                      type: "string",
                    },
                    iframeId: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
              output: {
                successSchema: {
                  type: "object",
                  properties: {
                    executionId: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
          // ----- ws data action #2: CheckForCompletion -----
          {
            name: "CheckForCompletion",
            secure: false,
            autoPublish: true,
            config: {
              request: {
                requestUrlTemplate:
                  "https://app.journeyid.io/api/system/executions/${input.ID}",
                requestType: "GET",
                headers: {
                  Accept: "application/json",
                  Authorization: "${authResponse.token_type} ${authResponse.access_token}",
                  // Authorization: "Bearer ${credentials.apiKey}",
                  "Content-Type": "application/json",
                },
                requestTemplate: "${input.rawRequest}",
              },
              response: {
                translationMap: {},
                translationMapDefaults: {},
                successTemplate: "${rawResult}",
              },
            },
            contract: {
              input: {
                inputSchema: {
                  title: "Journey",
                  type: "object",
                  properties: {
                    ID: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
              output: {
                successSchema: {
                  type: "object",
                  properties: {
                    completedAt: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
          // ----- ws data action #3: LookupCustomer -----
          {
            name: "LookupCustomer",
            secure: false,
            autoPublish: true,

            config: {
              request: {
                requestUrlTemplate:
                  "https://app.journeyid.io/api/system/customers/lookup?unique_id=${input.uniqueId}",
                requestType: "GET",
                headers: {
                  Authorization: "${authResponse.token_type} ${authResponse.access_token}",
                  // Authorization: "Bearer ${credentials.apiKey}",
                },
                requestTemplate: "${input.rawRequest}",
              },
              response: {
                translationMap: {},
                translationMapDefaults: {},
                successTemplate: "${rawResult}",
              },
            },
            contract: {
              input: {
                inputSchema: {
                  type: "object",
                  properties: {
                    uniqueId: {
                      type: "string",
                    },
                  },
                  additionalProperties: true,
                },
              },
              output: {
                successSchema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                    },
                    uniqueId: {
                      type: "string",
                    },
                    firstName: {
                      type: "string",
                    },
                    lastName: {
                      type: "string",
                    },
                    phoneNumbers: {
                      type: "array",
                      items: {
                        title: "Item 1",
                        type: "string",
                      },
                    },
                    devices: {
                      type: "array",
                      items: {
                        title: "Item 1",
                        type: "string",
                      },
                    },
                    email: {
                      type: "string",
                    },
                    enrollments: {
                      type: "array",
                      items: {
                        title: "Item 1",
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                          },
                        },
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
        ],
      },
    ],
  },

  // These are the necessary permissions that the user running the wizard must have to install or uninstall
  // Add your permissions to one of the modules, to post custom setup, or custom
  installPermissions: {
    custom: [],
    wizard: ["integrations:integration:view", "integrations:integration:edit"],
    postCustomSetup: [],
    role: [
      "authorization:role:view",
      "authorization:role:add",
      "authorization:grant:add",
    ],
    group: ["directory:group:add"],
    "app-instance": [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
    ],
    "widget-instance": [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
    ],
    "interaction-widget": [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
    ],
    "oauth-client": [
      "authorization:role:view",
      "oauth:client:view",
      "oauth:client:add",
      "oauth:client:edit",
    ],
    "widget-deployment": [
      "widgets:deployment:view",
      "widgets:deployment:add",
      "widgets:deployment:edit",
    ],
    "open-messaging": [
      "messaging:integration:view",
      "messaging:integration:add",
      "messaging:integration:edit",
    ],
    "ws-data-actions": [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
      "integrations:action:add",
      "integrations:action:edit",
    ],
    "gc-data-actions": [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
      "integrations:action:add",
      "integrations:action:edit",
    ],
    "data-table": ["architect:datatable:view", "architect:datatable:add"],
    "byoc-cloud-trunk": ["telephony:plugin:all"],
    audiohook: [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
    ],
    "event-bridge": [
      "integrations:integration:view",
      "integrations:integration:add",
      "integrations:integration:edit",
    ],
  },
  uninstallPermissions: {
    custom: [],
    wizard: [],
    postCustomSetup: [],
    role: ["authorization:role:delete"],
    group: ["directory:group:delete"],
    "app-instance": ["integrations:integration:delete"],
    "widget-instance": ["integrations:integration:delete"],
    "interaction-widget": ["integrations:integration:delete"],
    "oauth-client": ["oauth:client:edit", "oauth:client:delete"],
    "widget-deployment": ["widgets:deployment:delete"],
    "open-messaging": ["messaging:integration:delete"],
    "ws-data-actions": ["integrations:integration:delete"],
    "gc-data-actions": ["integrations:integration:delete"],
    "data-table": ["architect:datatable:delete"],
    "byoc-cloud-trunk": ["telephony:plugin:all"],
    audiohook: ["integrations:integration:delete"],
    "event-bridge": ["integrations:integration:delete"],
  },

  // These are the necessary scopes that the Vendor Wizard's OAuth Client (defined in Vendor's org) must have to allow the wizard to install or uninstall
  // This is for information only, to make it easier to find what the Vendor Wizard's OAuth Client (Implicit Grant type, Authorization Code Grant type) needs to be set with
  installScopes: {
    custom: [],
    wizard: ["user-basic-info", "integrations"],
    postCustomSetup: [],
    role: ["authorization"],
    group: ["groups"],
    "app-instance": ["integrations"],
    "widget-instance": ["integrations"],
    "interaction-widget": ["integrations"],
    "oauth-client": ["authorization:readonly", "user-basic-info", "oauth"],
    "widget-deployment": ["widgets"],
    "open-messaging": ["messaging"],
    "ws-data-actions": ["integrations"],
    "gc-data-actions": ["integrations"],
    "data-table": ["architect"],
    "byoc-cloud-trunk": ["telephony", "organization:readonly"],
    audiohook: ["integrations"],
    "event-bridge": ["integrations"],
  },
  uninstallScopes: {
    custom: [],
    wizard: [],
    postCustomSetup: [],
    role: ["authorization"],
    group: ["groups"],
    "app-instance": ["integrations"],
    "widget-instance": ["integrations"],
    "interaction-widget": ["integrations"],
    "oauth-client": ["oauth"],
    "widget-deployment": ["widgets"],
    "open-messaging": ["messaging"],
    "ws-data-actions": ["integrations"],
    "gc-data-actions": ["integrations"],
    "data-table": ["architect"],
    "byoc-cloud-trunk": ["telephony"],
    audiohook: ["integrations"],
    "event-bridge": ["integrations"],
  },
};

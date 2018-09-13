# Lambda Badger

## Technologies used

A big thank you to all this powerfull technologies, without them this project could not have existed !

| Name                                                                                  | Usage
| -----------------------------------------------------------------------------------   | ------------
| [Yarn](https://yarnpkg.com)                                                           | A Javascript package manager, safer than npm.
| [Vue-cli](https://www.npmjs.com/package/vue-cli)                                      | An cli tool built to improve the management of Vue.js project.
| [Vue.js](https://www.npmjs.com/package/vue)                                           | A reactive framework to build single-page components.
| [Vue router](https://www.npmjs.com/package/vue-router)                                | Allows to use Vue.js with the browser URL.
| [Vuex](https://www.npmjs.com/package/vuex)                                            | A global reactive container of data for Vue.js.
| [Vue-i18n](https://www.npmjs.com/package/vue-i18n)                                    | Allows to translate all the interface.
| [Pug](https://www.npmjs.com/package/pug)                                              | A cleaner template than HTML (but translated in HTML) used in components.
| [Vue-toasted](https://www.npmjs.com/package/vue-toasted)                              | The internal notification system.
| [Vuetify](https://www.npmjs.com/package/vuetify)                                      | A material-design graphical system and component supplier, built for Vue.js projects.
| [PouchDB](https://www.npmjs.com/package/pouchdb)                                      | An in-browser database, built for offline use and compatible with CouchDB replication system.
| [Cordova](https://www.npmjs.com/package/cordova)                                      | An cli tool to transform web project to mobile-application.
| [Electron builder](https://www.npmjs.com/package/vue-cli-plugin-electron-builder)     | An cli tool to transform web project to desktop application.

## Where to start ?

| Path              | Purpose
| ----------------- | ----------
| ./src/locales/    | Translation of the application
| ./src/App.vue     | Global template : header, menu
| ./src/router.js   | Registration of views (= pages)
| ./src/views/      | Declaration of views (= pages)
| ./src/components  | Declaration of components
| ./src/store.js    | The global container of data, linked to PouchDB

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Run your end-to-end tests
```
yarn run test:e2e
```

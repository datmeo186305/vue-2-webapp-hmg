# web-app

## Requirements

- `Node v12.18.0`

## Project structure
- [`public`](#public)
- [`src`](#src)
    - [`assets`](#assets)
    - [`components`](#components)
    - [`core`](#core)
    - [`helpers`](#helpers)
    - [`lang`](#lang)
    - [`layouts`](#layouts)
    - [`pages`](#pages)
    - [`router`](#router)
    - [`services`](#services)
    - [`store`](#store)
    - [`globalComponents.js`](#globalComponentsjs)
    - [`globalDirectives.js`](#globalDirectivesjs)
    - [`main.js`](#mainjs)
    - [`webapp.js`](#webappjs)

### `public`
Public image, icon ...

### `src`
Source code

### `assets`
css, font, webfont

### `components`
Shared components folder.
- `Button`
- `Field`
- `Forms`
- `Inputs`
- `Loading`
- `Modals`
- `Navigations`
- `NotificationPlugin`
- `ProgressBars`
- `Prompts`
- `Ripple`

### `core`
Common function

### `helpers`
- `browser-detect` Detect browser of user agent
- `constants` App constants
- `filters` Common filters
- `firebase` Config firebase
- `query-helper` Build FormData and Form query for rest api
- `validation-config` Custom validation of vee validate

### `layouts`
Base app layout components.
- `Header`, `Footer` components and main layout wrapper.

### `pages`
Page wrapper components(Pages) and Local components.

### `router`
Router instance and routing declaration.
- `routePages` - route pages
- `index` - router initialization.
- `routes` - routing.
- `middlewares`:
    - `initCurrentUserStateMiddleware` - Current user state initialization (each time app loads, check refresh token and fetch current user if token exist.)
    - `checkAccessMiddleware` - Each time user change route, check permissions to route.
    - `setPageTitleMiddleware` - Each time user change route, set page title.
    
### `services`
Data access layer/API calls.
- ES6 API calls classes.
- API calls must be represented in separate classes (not in vuex action).
- `paydayLoan` - PaydayLoan apis.
- `auth.service` - Auth methods and API calls.
- `http.init` - Http request class.

### `store`
App store with separate modules.

### `globalComponents.js`
Declare global components

### `globalDirectives.js`
Declare global directives

### `main.js`
Root app initialization file.

### `webapp.js`
Webapp initialization plugin, stylesheet, js,..  files,

## Project setup
```
yarn install
```

### Compiles for development with port custom
```
yarn dev
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

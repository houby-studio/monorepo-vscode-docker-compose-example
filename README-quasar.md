# Create Quasar PWA from CLI

## Links

- https://next.quasar.dev/start/vs-code-configuration
- https://www.typescriptlang.org/docs/handbook/2/basic-types.html

## Prerequisites

- VSCode
- Node.js
- Yarn
- Quasar CLI

## Setup

- Launch URL and browse to portal.azure.com
- Navigate to Azure Active Directory > App registration > New registration
  - Name: MOM.Web
  - Single tenant
  - Register
  - Copy Application (client) ID
- Launch VSCode and open empty folder
- Create new project using quasar CLI
```
quasar create mom-web --branch next
# (Enter)
# My Order Management
# Powerful order management system for colleagues.
# (Enter)
# Sass with SCSS syntax
# Enable All
# Composition API
# Standard
# Yarn
```
- Move .vscode/ folder to parent folder
- Press F1, type Preferences: Open Settings (JSON)
- Check if your settings are as follows
```json
{
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
      "source.fixAll": true
  },
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  "javascript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "javascript.format.placeOpenBraceOnNewLineForFunctions": false,
  "typescript.format.insertSpaceBeforeFunctionParenthesis": true,
  "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "typescript.format.placeOpenBraceOnNewLineForFunctions": false,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.js": "vscode-typescript"
}
```
- In the root folder create file vetur.config.js with following settings
```js
// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true
  },
  // **optional** default: `[{ root: './' }]`
  // support monorepos
  projects: [
    // './packages/repo2', // shorthand for only root.
    {
      // **required**
      // Where is your project?
      // It is relative to `vetur.config.js`.
      root: './mom-web',
      // **optional** default: `'package.json'`
      // Where is `package.json` in the project?
      // We use it to determine the version of vue.
      // It is relative to root property.
      package: './package.json',
      // **optional**
      // Where is TypeScript config file in the project?
      // It is relative to root property.
      tsconfig: './tsconfig.json',
      // **optional** default: `'./.vscode/vetur/snippets'`
      // Where is vetur custom snippets folders?
      snippetFolder: './.vscode/vetur/snippets',
      // **optional** default: `[]`
      // Register globally Vue component glob.
      // If you set it, you can get completion by that components.
      // It is relative to root property.
      // Notice: It won't actually do it. You need to use `require.context` or `Vue.component`
      globalComponents: [
        './src/components/**/*.vue'
      ]
    }
  ]
}
```
- You may possibly need to close and open folder
- Install extension msjsdiag.debugger-for-chrome
- Install ESLint globally by changing setting eslint.packageManager to yarn
- Install ESLint globally
```
yarn global add eslint
```
- If you get error about ESLint not being enabled, click on Quick fiexes and enable ESLint for all workspaces
- Restart VSCode
- Open quasar.conf.js and edit following code
```js
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      devtool: 'source-map',
```
- Add following code to launch.json
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Quasar App: chrome",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/mom-web/src",
  "breakOnLoad": true,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  }
}
```
- Add following code to tasks.json
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Quasar App: chrome",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/mom-web/src",
  "breakOnLoad": true,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  }
}
```







## C#
- Modify launch.json and tasks.json to include project folder names
- Press F1 > Docker: Add Docker Files to Workspace
  - .NET: ASP.NET Core
  - Linux
  - 80, 443
  - Yes
- Modify docker-compose.debug.yml
```yaml
    ports:
      - 5080:80
      - 5443:443
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=https://+;http://+
      - ASPNETCORE_HTTPS_PORT=5443
      - ASPNETCORE_Kestrel__Certificates__Default__Password=s3Cr3Td3V3l0P3r
      - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/DevelopmentCert.pfx
    volumes:
      - ~/.vsdbg:/remote_debugger:rw
      - ~/AppData/Roaming/ASP.NET/Https:/https/
```
- For development purposes, create self signed certificate and trust it
```
dotnet dev-certs https -ep $env:USERPROFILE\.aspnet\https\DevelopmentCert.pfx -p s3Cr3Td3V3l0P3r
dotnet dev-certs https --trust
```
- Right-click docker-compose.debug.yml and select Compose Up
- In VSCode switch to Debug tab, open drop down menu and Add Configuration... and select Docker .NET Core Attach (Preview)
- Now you can run and debug project in three ways
  - Debug on host machine:
    - Run and Debug: .NET Core Launch
  - Debug on Docker Container:
    - Run and Debug: Docker .NET Core Launch
  - Debug on Docker Compose:
    - Right-click docker-compose.debug.yml and select Compose Up
    - Run and Debug: Docker .NET Core Attach (Preview)


# Monorepo with VSCode - Example

> launch.json, tasks.json, Dockerfile and docker-compose.yml for easy debugging

This repository serves as reference for specific use case, which is not very well documented yet. The goal is to have single repository with multiple projects, all launched and debugged from VSCode. There are multiple ways to achieve this.

- Build and launch single project on host computer
- Build and launch single project in docker container
- Build and launch all projects with docker compose and attach debugger to project of your choice

ASP.NET Core project is quite easy, Microsoft has everything well documented and integrated to VSCode.  
Quasar on the other hand lacks documentation on docker builds, let alone debugging. It also lacks instructions how to setup VSCode to "press F5 to run and debug". We cover that in this repository.

## Tested on

While this example repository may work for other setups, this is the exact configuration we have created this on.

- IDE: Visual Studio Code (1.55.0)
- OS: Windows 10 (1909)
- Project 1: ASP.NET Core (dotnet 5.0)
- Project 2: Quasar v2 PWA (Quasar CLI 1.0.5)
- Docker: Docker desktop with WSL 2 enabled (v20.10.5)

## Setting up ASP.NET Core project

We create simple ASP.NET Core API project, which may serve as backend for our example project. We simply create new project using dotnet CLI with template. We also setup authentication against Azure Active Directory and enable HTTPS debugging to cover another common scenario.

### ASP.NET Prerequisites

- [VSCode](https://code.visualstudio.com/download)
- [.NET Core SDK](https://dotnet.microsoft.com/download)
- (Optional) [Azure Tenant](https://docs.microsoft.com/cs-cz/azure/active-directory/develop/quickstart-create-new-tenant)

### ASP.NET Setup

#### ASP.NET Azure Application Registration

This step is optional. If you do not want to setup authentication or want to choose another method, you can skip this section.

- Launch internet browser and browse to <https://portal.azure.com>
- Navigate to Azure Active Directory > App registration > New registration
  - Name: ASPNET.APP
  - Supported account types: Single tenant
  - Register
  - Note Application (client) ID
  - Note Directory (tenant) ID
  - TODO: Setup secret
    - Select Certificates & secrets
    - Click on New client secret
    - Write description, select expiry date and click on Add
    - Note the value of the secret
  - TODO: Setup Token configuration
    - Select Token configuration
    - Click on Add optional claim
    - Select ID
    - Select email, family_name and given_name and click on Add
    - Check Turn on Microsoft Graph email, profile permission and click on Add
  - TODO: Setup API permissions
    - Select API permissions
    - CLick on Grant admin consent for COMPANY
    - Click on Yes

#### ASP.NET Create project

Now we simply create the project using dotnet CLI. You can view resulting files and configuration in this repository.

- Launch VSCode in your monorepo root
- Install following extensions
  - C# - ms-dotnettools.csharp
  - Docker - ms-azuretools.vscode-docker
  - Remote - Containers - ms-vscode-remote.remote-containers
- Create new project using dotnet CLI

```shell
# Without authentication
dotnet new webapi -o ASPNET.APP

# With AAD authentication
dotnet new webapi -o ASPNET.APP --auth SingleOrg --calls-graph --called-api-scopes user.read --domain $(replace-with-your-url).onmicrosoft.com --tenant-id $(replace-with-your-tenant-id) --client-id $(replace-with-your-client-id)
```

- Press **F5** and select **.NET Core**
- The following message appears as notification, press **Yes** to create tasks for build, publish and watch for .NET Core apps in this repository.

> Required assets to build and debug are missing from 'monorepo-vscode-docker-compose-example'. Add them?

- Open newly created launch.json and click on **Add Configuration...**
  - Select .NET: Launch a local .NET Core Web App
  - Modify paths and append your projects folder path after every **${workspaceFolder}**
  - Modify key program by replacing **\<target-framework>/<project-name.dll>** with actual path to your dll
  - Now you can press **F5** and you will run and debug ASP.NET Core project from your host computer
- Press **F1** and search and open **Docker: Add Docker Files to Workspace**
  - .NET: ASP.NET Core
  - Linux
  - 80, 443
  - Yes
- Now you can select **Docker .NET Core Launch** in Run and Debug tab and press **F5** to build, run and debug ASP.NET Core project in docker container
- Modify docker-compose.debug.yml to allow debugging over https

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

- For development purposes, create self signed certificate and trust it, then you may validate certificate in certlm.msc in Personal store

```shell
dotnet dev-certs https -ep $env:USERPROFILE\.aspnet\https\DevelopmentCert.pfx -p s3Cr3Td3V3l0P3r
dotnet dev-certs https --trust
```

- Right-click on docker-compose.debug.yml and click on **Compose Up**
- Open launch.json and click on **Add Configuration...**
  - Select **Docker .NET Core Attach (Preview)**
  - Add following key with name of the container you wish to debug `"containerName": "monorepo-vscode-docker-compose-example_aspnetapp_1"`
  - Now you can select **Docker .NET Core Attach (Preview)** in Run and Debug tab and press **F5** to attach ASP.NET Core project in docker container launched with docker-compose
- We should rename tasks in tasks.json and launch.json to reflect which project it applies to, as we will add another tasks with same name for other projects, we chose to append `ASPNET.APP:`
- Now you can run and debug project in three ways
  - Debug on host machine:
    - Run and Debug: ASPNET.APP: .NET Core Launch (web)
  - Debug on Docker Container:
    - Run and Debug: ASPNET.APP: Docker .NET Core Launch
  - Debug on Docker Compose:
    - Right-click docker-compose.debug.yml and select Compose Up
    - Run and Debug: ASPNET.APP: Docker .NET Core Attach (Preview)

## Setting up Quasar project

We create simple Quasar project, which may serve as frontend for our example project. We simply create new project using quasar CLI and configure it to be debuggable via host build, container build and docker-compose. We also setup authentication against Azure Active Directory and enable HTTPS debugging to cover another common scenario.

### Quasar Prerequisites

- [VSCode](https://code.visualstudio.com/download)
- [npm](https://nodejs.org/en/)
- [yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Quasar CLI](https://next.quasar.dev/quasar-cli/installation)
- (Optional) [Azure Tenant](https://docs.microsoft.com/cs-cz/azure/active-directory/develop/quickstart-create-new-tenant)

### Quasar Setup

#### Quasar Azure Application Registration

This step is optional. If you do not want to setup authentication or want to choose another method, you can skip this section.

- Launch internet browser and browse to <https://portal.azure.com>
- Navigate to Azure Active Directory > App registration > New registration
  - Name: quasar-app
  - Supported account types: Single tenant
  - Redirect URI (optional): <https://localhost/>
  - Register
  - Note Application (client) ID
  - Note Directory (tenant) ID
  - TODO: Setup Token configuration
    - Select Token configuration
    - Click on Add optional claim
    - Select Access
    - Select email, family_name and given_name and click on Add
    - Check Turn on Microsoft Graph email, profile permission and click on Add
  - TODO: Setup API permissions
    - Select API permissions
    - CLick on Grant admin consent for COMPANY
    - Click on Yes

#### Quasar Create project

Now we simply create the project using Quasar CLI. You can view resulting files and configuration in this repository.

- Launch VSCode in your monorepo root
- Install following extensions
  - Debugger for Chrome - msjsdiag.debugger-for-chrome
  - ESLint - dbaeumer.vscode-eslint
  - Vetur - octref.vetur
  - Docker - ms-azuretools.vscode-docker
  - Remote - Containers - ms-vscode-remote.remote-containers
- Create new project using Quasar CLI

```shell
quasar create quasar-app --branch next
# (Enter)
# Quasar App
# Example frontend application.
# (Enter)
# Sass with SCSS syntax
# (Enable All)
# Composition API
# Standard
# Yarn
```

- Move content of ./quasar-app/.vscode to folder ./.vscode
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
      root: './quasar-app',
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

- You may have to close (Ctrl+K F) and open (Ctrl+K Ctrl+O) folder to let vetur start correctly
- Press F1, type Preferences: Open Settings (JSON)
- Change following line or create it to use eslint with yarn

```json
  "eslint.packageManager": "yarn",
```

- Install ESLint globally with yarn

```shell
yarn global add eslint
```

- If you get error about ESLint not being enabled, click on Quick fixes and enable ESLint for all workspaces
- Restart VSCode
- Open quasar.conf.js and add source-map to build key

```js
    build: {
      devtool: 'source-map',
```

- Add following code to launch.json, which enables debugging from host computer, docker container and to attach to docker-compose container

```json
{
  "name": "quasar-app: Quasar Launch (web)",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/quasar-app/src",
  "breakOnLoad": true,
  "preLaunchTask": "quasar-app: quasar dev -m pwa",
  "postDebugTask": "quasar-app: kill task",
  "timeout": 60000,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  }
},
{
  "name": "quasar-app: Docker Quasar Launch",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/quasar-app/src",
  "breakOnLoad": true,
  "preLaunchTask": "quasar-app: docker-run: debug",
  "postDebugTask": "quasar-app: docker-run: stop",
  "timeout": 60000,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  }
},
{
  "name": "quasar-app: Docker Quasar Attach",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}/quasar-app/src",
  "breakOnLoad": true,
  "sourceMapPathOverrides": {
    "webpack:///./src/*": "${webRoot}/*"
  }
}
```

- Add following code to tasks.json to be used with launch configurations above

```json
{
  // Launch 'quasar dev -m pwa' as background task, so Launch command won't wait until it terminates
  // problemMatcher and background seems to be necessary, although it is practically useless
  // cwd changes directory to Quasar's project root folder
  "label": "quasar-app: quasar dev -m pwa",
  "command": "quasar.cmd",
  "type": "shell",
  "args": [
    "dev",
    "-m",
    "pwa"
  ],
  "isBackground": true,
  "promptOnClose": false,
  "problemMatcher": {
    "pattern": {
      "regexp": ".",
      "file": 1,
      "line": 2,
      "column": 3,
      "severity": 4,
      "message": 5
    },
    "background": {
      "activeOnStart": true,
      "beginsPattern": ".",
      "endsPattern": "."
    }
  },
  "options": {
    "cwd": "./quasar-app/"
  }
},
{
  // In VSCode v1.55.0 we cannot run multiple commands or command with args, therefore we create two tasks with dependency
  "label": "quasar-app: terminate",
  "type": "process",
  "command": "${command:workbench.action.tasks.terminate}"
},
{
  // In VSCode v1.55.0 we cannot run multiple commands or command with args, therefore we create two tasks with dependency
  "label": "quasar-app: kill task",
  "dependsOn": "quasar-app: terminate",
  "type": "process",
  "command": "${command:workbench.action.acceptSelectedQuickOpenItem}"
},
{
  // Standard VSCode template docker-build for node.js docker container with corrected paths to subfolder
  "label": "quasar-app: docker-build",
  "type": "docker-build",
  "platform": "node",
  "dockerBuild": {
    "dockerfile": "${workspaceFolder}/quasar-app/Dockerfile",
    "context": "${workspaceFolder}/quasar-app",
    "pull": true
  },
  "node": {
    "package": "${workspaceFolder}/quasar-app/package.json"
  }
},
{
  // We are using Quasar CLI commands to run project, therefore VSCode cant override CMD, ensure enableDebugging is set to false
  "label": "quasar-app: docker-run: debug",
  "type": "docker-run",
  "dependsOn": [
    "quasar-app: docker-build"
  ],
  "dockerRun": {
    "env": {
      "DEBUG": "*",
      "NODE_ENV": "development",
      "PORT": "8080"
    },
    "command": "dev -m pwa",
    "ports": [
      {
        "containerPort": 8080,
        "hostPort": 8080,
        "protocol": "tcp"
      },
      {
        "containerPort": 9229,
        "hostPort": 9229,
        "protocol": "tcp"
      }
    ],
    "volumes": [
      {
        "localPath": "${workspaceFolder}/quasar-app/",
        "containerPath": "/usr/src/app",
        "permissions": "rw"
      }
    ]
  },
  "node": {
    "package": "${workspaceFolder}/quasar-app/package.json",
    "enableDebugging": false
  }
},
{
  "label": "quasar-app: docker-run: stop",
  "type": "shell",
  "command": "docker container stop quasarapp-dev && docker container rm quasarapp-dev"
}
```

- Add custom Dockerfile to ./quasar-app, which is similar to .NET Core, but works for Quasar project

```yaml
# Quasar v2 - TypeScript PWA
# Copyright (c) 2021 Houby Studio <contact@houby-studio.eu>

# Install Quasar CLI globally
FROM node:12.18-alpine AS base
ENV NODE_ENV=production
RUN yarn global add @quasar/cli
WORKDIR /usr/src/app
EXPOSE 4000

# Install dependencies and build project
FROM base AS build
WORKDIR /build
COPY ["package.json", "yarn.lock", "./"]
RUN yarn
COPY . .
RUN quasar build -m pwa

# Copy dist files to final image
FROM base AS final
COPY --from=build /build/dist/pwa .
ENTRYPOINT ["quasar"]
CMD [ "serve" ]

# Development
# If you want to debug project using this image, you need to override env variable, add volume with project files, expose debug ports and override launch CMD
# docker build -t quasarapp:dev .
# docker run -d -p 8080:8080 -p 9229:9229 -e NODE_ENV=development -v ${PWD}:/usr/src/app quasarapp:dev dev -m pwa
# Both docker commands and docker-compose file may be found in repository in launch.json, tasks.json and docker-compose.debug.yml
```

- Add config to docker-compose.debug.yml

```yaml
  quasarapp:
    image: quasarapp
    build:
      context: quasar-app
      dockerfile: ./Dockerfile
    environment:
      NODE_ENV: development
    ports:
      - 8080:8080
      - 9229:9229
    volumes: 
      - ./quasar-app/:/usr/src/app
    command: "dev -m pwa"
```

- Now you can run and debug project in three ways
  - Debug on host machine:
    - Run and Debug: quasar-app: Quasar Launch (web)
  - Debug on Docker Container:
    - Run and Debug: quasar-app: Docker Quasar Launch
  - Debug on Docker Compose:
    - Right-click docker-compose.debug.yml and select Compose Up
    - Run and Debug: quasar-app: Docker Quasar Attach

## Setting up VSCode

### Extensions

### Settings

## Create Kong

KONG may be used as API Gateway, if simple nginx reverse proxy won't prove useful.

<https://docs.konghq.com/enterprise/2.3.x/deployment/installation/docker/>

```shell
docker pull kong-docker-kong-gateway-docker.bintray.io/kong-enterprise-edition:2.3.2.0-alpine

docker tag kong-docker-kong-gateway-docker.bintray.io/kong-enterprise-edition:2.3.2.0-alpine kong-ee

docker network create kong-ee-net

docker run -d --name kong-ee-database --network=kong-ee-net -p 5432:5432 -e "POSTGRES_USER=kong" -e "POSTGRES_DB=kong" -e "POSTGRES_PASSWORD=kong" postgres:9.6

docker run --rm --network=kong-ee-net -e "KONG_DATABASE=postgres" -e "KONG_PG_HOST=kong-ee-database" -e "KONG_PG_PASSWORD=kong" -e "KONG_PASSWORD=<SOMETHING-YOU-KNOW>" kong-ee kong migrations bootstrap

docker run -d --name kong-ee --network=kong-ee-net -e "KONG_DATABASE=postgres" -e "KONG_PG_HOST=kong-ee-database" -e "KONG_PG_PASSWORD=kong" -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" -e "KONG_PROXY_ERROR_LOG=/dev/stderr" -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" -e "KONG_ADMIN_GUI_URL=http://localhost:8002" -p 8000:8000 -p 8443:8443 -p 8001:8001 -p 8444:8444 -p 8002:8002 -p 8445:8445 -p 8003:8003 -p 8004:8004 kong-ee
```

Now you can browse <http://localhost:8002/overview>

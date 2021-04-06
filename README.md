# Monorepo with VSCode - Example

> launch.json, tasks.json, Dockerfile and docker-compose.yml for easy debugging

This repository serves as reference for specific use case, which sadly is not very well documented yet. The goal is to have single repository with multiple projects, which can be launched and debugged from VSCode. There are multiple ways to achieve this.
- Build and launch single project on host computer
- Build and launch single project in docker container
- Build and launch all projects with docker compose and attach debugger to project of your choice

ASP.NET Core project should are quite easy, Microsoft has everything well documented and integrated to VSCode.  
Quasar on the other hand lacks documentation on docker builds, let alone debugging. It also lacks guide how to "press F5 to run and debug" in VSCode. We cover both cases here.

# Tested on

While this example may very well work for other setups, this is the exact original configuration we have created this on.

- IDE: Visual Studio Code (1.55.0)
- OS: Windows 10 (1909)
- Project 1: ASP.NET Core (dotnet 5.0)
- Project 2: Quasar v2 PWA (Quasar CLI 1.0.5)
- Docker: Docker desktop with WSL 2 enabled (v20.10.5)

# Setting up ASP.NET Core project

We create simple ASP.NET Core API project, which may serve as backend for our project. We simply create new project using dotnet CLI with template and we hook it up to Azure Active Directory for authentication, because why not.

## Prerequisites

- VSCode
- .NET Core SDK

## Setup

### Azure Application Registration

This step is optional. If you do not want to setup authentication or want to choose another method, you can skip this step.

- Launch internet browser and browse to https://portal.azure.com
- Navigate to Azure Active Directory > App registration > New registration
  - Name: ASPNET.APP
  - Supported account types: Single tenant
  - Register
  - Note Application (client) ID
  - Note Directory (tenant) ID

### Create project

Now we simply create new project to subdirectory in our repository. You can view resulting files and configuration in this repository.

- Launch VSCode in your mono repository root
- Create new project using dotnet CLI
```shell
# Without authentication
dotnet new webapi -o ASPNET.APP

# With AAD authentication
dotnet new webapi -o ASPNET.APP --auth SingleOrg --calls-graph --called-api-scopes user.read --domain contoso.onmicrosoft.com --tenant-id 83883f88-cbd3-4181-8ce2-c72825c9fb6e --client-id 83883f88-cbd3-4181-8ce2-c72825c9fb6e
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

# Setting up VSCode

## Extensions

## Settings

# Setting up Quasar project

Example configuration for multiple projects (ASP.NET Core and Quasar Typescript) in VSCode with debugging on host, in docker containers and with docker-compose.

# Create ASP.NET Core API from CLI

## Links

- https://docs.microsoft.com/cs-cz/aspnet/core/security/docker-https?view=aspnetcore-5.0
- https://damienbod.com/2020/05/29/login-and-use-asp-net-core-api-with-azure-ad-auth-and-user-access-tokens/
- https://code.visualstudio.com/docs/containers/docker-compose

## Prerequisites

- VSCode
- .NET Core SDK

## Setup

- Launch URL and browse to portal.azure.com
- Navigate to Azure Active Directory > App registration > New registration
  - Name: MOM.Identity
  - Single tenant
  - Register
  - Copy Application (client) ID
- Launch VSCode and open empty folder
- Create new project using dotnet
```
dotnet new webapi -o MOM.Identity --auth SingleOrg --calls-graph --called-api-scopes user.read --domain mountfield.onmicrosoft.com --tenant-id 906f66d2-9545-48f8-be26-ff9eab6126be --client-id 906f66d2-9545-48f8-be26-ff9eab6126be
```
- Launch VSCode directly from project folder
- Hit F5 > .NET Core
- Move created .vscode/ to parent folder
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

## Create Kong

KONG may be used as API Gateway, if simple nginx reverse proxy won't prove useful.

https://docs.konghq.com/enterprise/2.3.x/deployment/installation/docker/

```
docker pull kong-docker-kong-gateway-docker.bintray.io/kong-enterprise-edition:2.3.2.0-alpine

docker tag kong-docker-kong-gateway-docker.bintray.io/kong-enterprise-edition:2.3.2.0-alpine kong-ee

docker network create kong-ee-net

docker run -d --name kong-ee-database --network=kong-ee-net -p 5432:5432 -e "POSTGRES_USER=kong" -e "POSTGRES_DB=kong" -e "POSTGRES_PASSWORD=kong" postgres:9.6

docker run --rm --network=kong-ee-net -e "KONG_DATABASE=postgres" -e "KONG_PG_HOST=kong-ee-database" -e "KONG_PG_PASSWORD=kong" -e "KONG_PASSWORD=<SOMETHING-YOU-KNOW>" kong-ee kong migrations bootstrap

docker run -d --name kong-ee --network=kong-ee-net -e "KONG_DATABASE=postgres" -e "KONG_PG_HOST=kong-ee-database" -e "KONG_PG_PASSWORD=kong" -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" -e "KONG_PROXY_ERROR_LOG=/dev/stderr" -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" -e "KONG_ADMIN_GUI_URL=http://localhost:8002" -p 8000:8000 -p 8443:8443 -p 8001:8001 -p 8444:8444 -p 8002:8002 -p 8445:8445 -p 8003:8003 -p 8004:8004 kong-ee
```

Now you can browse http://localhost:8002/overview
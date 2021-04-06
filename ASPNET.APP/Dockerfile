FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["ASPNET.APP/ASPNET.APP.csproj", "ASPNET.APP/"]
RUN dotnet restore "ASPNET.APP/ASPNET.APP.csproj"
COPY . .
WORKDIR "/src/ASPNET.APP"
RUN dotnet build "ASPNET.APP.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ASPNET.APP.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ASPNET.APP.dll"]

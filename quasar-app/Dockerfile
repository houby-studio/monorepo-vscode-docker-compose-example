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

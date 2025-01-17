# mia_template_service_name_placeholder

[![pipeline status][pipeline]][git-link]
[![coverage report][coverage]][git-link]

## Summary

Template with NestJS basecode

## Install dependencies

If you are having conflicts with some library while installing the modules use

```shell
npm i --legacy-peer-deps
```

## Taringa dependencies

This nest.js template includes a Taringa! exclusive library called Taringa Auth library. If you want to remove this library you need to modify two files and remove the following lines:

app.module.ts

```
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // <<-- if you preffer to not use Taringa Auth library remove from line
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      proxyProviders: [AccessTokenProxyProvider],
    }),
    JwtInterceptorModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        return {
          auth0IssuerUrl: config.getOrThrow('app.auth0IssuerUrl'),
          auth0Audience: config.getOrThrow('app.auth0Audience'),
          userinfoUrl: config.getOrThrow('app.userinfoUrl'),
          apiKey: config.getOrThrow('app.apiKey'),
        };
      },
      // -->> to this line
      inject: [ConfigService],
    }),
    ...mongoConnectionProvider,
    //   CustomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // <<-- if you preffer to not use Taringa Auth library remove from line
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtInterceptor,
    },
    // -->> to this line
  ],
  exports: [AppService],
})
```

app.controller.ts

```shell
@Controller()
@AllowUnauthorizedRequest() // <-- if you preffer to not use Taringa Auth library remove this line
export default class AppController {
  constructor(private readonly appService: AppService) {}

```

## Compile with Typescript

In order to transpile your project to Javascript, using the current `tsconfig.json` settings, run the following command:

```shell
npm run build
```

This command will create the project `.js` sources inside the `dist/` folder.

## Local Development

To develop the service locally you need:

- Node 16+

To setup node, please if possible try to use [nvm][nvm], so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install`, the `.nvmrc` file will install and select the correct version if you don’t already have it.

Once you have all the dependency in place, you can launch:

```shell
npm i
npm run coverage
```

This two commands, will install the dependencies and run the tests with the coverage report that you can view as an HTML
page in `coverage/lcov-report/index.html`.
After running the coverage you can create your local copy of the default values for the `env` variables needed for
launching the application.

```shell
cp ./default.env ./.env
```

From now on, if you want to change anyone of the default values for the variables you can do it inside the `local.env`
file without pushing it to the remote repository.

Once you have all your dependency in place you can launch:

```shell
set -a && source .env
npm start
```

After that you will have the service exposed on your machine.

## Contributing

To contribute to the project, please be mindful for this simple rules:

1. Don’t commit directly on master
2. Start your branches with `feature/` or `fix/` based on the content of the branch
3. If possible, refer to the Jira issue id, inside the name of the branch, but not call it only `fix/BAAST3000`
4. Always commit in english
5. Once you are happy with your branch, open a [Merge Request][merge-request]

## Run the Docker Image

If you are interested in the docker image you can get one and run it locally with this commands:

```shell
docker pull nexus.mia-platform.eu/taringa-platform/nestjs-template:latest
set -a
source .env
docker run --name nestjs-template \
  -e USERID_HEADER_KEY=${USERID_HEADER_KEY} \
  -e GROUPS_HEADER_KEY=${GROUPS_HEADER_KEY} \
  -e CLIENTTYPE_HEADER_KEY=${CLIENTTYPE_HEADER_KEY} \
  -e BACKOFFICE_HEADER_KEY=${BACKOFFICE_HEADER_KEY} \
  -e MICROSERVICE_GATEWAY_SERVICE_NAME=${MICROSERVICE_GATEWAY_SERVICE_NAME} \
  -e LOG_LEVEL=trace \
  -p 3000:3000 \
  --detach \
  nexus.mia-platform.eu/taringa-platform/nestjs-template
```

[pipeline]: https://git.tools.mia-platform.eu/clients/taringa/taringa-platform/services/nestjs-template/badges/master/pipeline.svg
[coverage]: https://git.tools.mia-platform.eu/clients/taringa/taringa-platform/services/nestjs-template/badges/master/coverage.svg
[git-link]: https://git.tools.mia-platform.eu/clients/taringa/taringa-platform/services/nestjs-template/commits/master
[nvm]: https://github.com/creationix/nvm
[merge-request]: https://git.tools.mia-platform.eu/clients/taringa/taringa-platform/services/nestjs-template/merge_requests

##Notes
The first project build will fail because the `package-lock.json` file is missing.

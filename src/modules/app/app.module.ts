import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtInterceptorModule,
  AccessTokenProxyProvider,
  JwtInterceptor,
} from '@mia-platform-internal/taringa-auth-library';
import { ClsModule } from 'nestjs-cls';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { mongoConnectionProvider } from '../../database';
import { appConfig } from '../../config';
import AppController from './app.controller';
import AppService from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        // ignore liveness and readiness probes
        autoLogging: {
          ignore: (req: { url: any }) => {
            const ignoreList = ['/-/ready', '/-/healthz', '/oidc/userinfo'];
            return ignoreList.includes(req.url || '');
          },
        },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '***REDACTED***',
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            }
            : undefined,
      },
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
      inject: [ConfigService],
    }),
    // -->> to this line
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
export class AppModule {}

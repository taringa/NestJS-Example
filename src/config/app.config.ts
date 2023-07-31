import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  auth0IssuerUrl: process.env.AUTH0_ISSUER_URL,
  auth0Audience: process.env.AUTH0_AUDIENCE,
  userinfoUrl: process.env.USER_INFO_URL,
  apiKey: process.env.API_KEY,
  mongoUrl: process.env.MONGODB_URL,
}));

import { randomBytes } from 'crypto';

export default () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  return {
    nodeEnv,
    port: parseInt(process.env.PORT ?? '3000', 10),
    corsOrigins: (process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    swaggerEnabled: process.env.SWAGGER_ENABLED
      ? process.env.SWAGGER_ENABLED === 'true'
      : nodeEnv !== 'production',
    database: {
      url: process.env.DATABASE_URL ?? '',
      ssl: process.env.DATABASE_SSL === 'true',
    },
    jwt: {
      secret: process.env.JWT_SECRET || randomBytes(32).toString('hex'),
      expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? '3600', 10),
    },
  };
};

import * as Joi from 'joi';

export class EnvValidator {
  static readonly schema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().port().default(3000),
    CORS_ORIGINS: Joi.string().allow('').default(''),
    LOG_LEVEL: Joi.string()
      .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
      .default('info'),
    SWAGGER_ENABLED: Joi.boolean(),
    DATABASE_URL: Joi.string()
      .pattern(/^postgres(ql)?:\/\//)
      .allow('')
      .default(''),
    DATABASE_SSL: Joi.boolean().default(false),
    REDIS_URL: Joi.string().allow('').default(''),
    JWT_SECRET: Joi.string().min(32).when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional().allow(''),
    }),
    JWT_EXPIRES_IN_SECONDS: Joi.number().integer().min(60).default(3600),
  }).unknown(true);
}

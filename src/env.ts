/* eslint-env node */
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import process from 'process';

const env = createEnv({
  server: {
    MONGO_URI: z.url(),
  },
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(8000),
    BASE_PATH: z.string().default('/api/v1'),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
  },
  runtimeEnv: process.env,
});

export default env;

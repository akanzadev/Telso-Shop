import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  scope: {
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    postgres: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME || 'root',
      password: process.env.POSTGRES_PASSWORD || 'admin',
      database: process.env.POSTGRES_DATABASE || 'telso_db',
      url: process.env.POSTGRES_URL,
    },
  },
  host: {
    port: Number(process.env.PORT) || 3000,
    host_api: process.env.HOST_API || 'http://localhost:3000/api',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
}));

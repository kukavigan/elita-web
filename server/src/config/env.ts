import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  clientUrl: (process.env.CLIENT_URL ?? 'http://localhost:5173').replace(/\/+$/, ''),
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  database: {
    url: required('DATABASE_URL'),
  },
  isDev: process.env.NODE_ENV !== 'production',
};

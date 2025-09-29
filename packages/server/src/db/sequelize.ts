import { Sequelize } from 'sequelize';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT } = process.env;

const rawHost = POSTGRES_HOST || 'localhost';
const isDockerHost = rawHost === 'prakticum-postgres';
const resolvedHost = process.env.NODE_ENV !== 'production' && isDockerHost ? 'localhost' : rawHost;
const resolvedDb = POSTGRES_DB || 'postgres';
const resolvedUser = POSTGRES_USER || 'postgres';
const resolvedPassword = POSTGRES_PASSWORD || 'postgres';
const resolvedPort = Number(POSTGRES_PORT) || 5432;

export const sequelize = new Sequelize(resolvedDb, resolvedUser, resolvedPassword, {
  host: resolvedHost,
  port: resolvedPort,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

export async function ensureDatabaseConnection(): Promise<void> {
  console.log('[DB] Connecting to Postgres with', {
    host: resolvedHost,
    port: resolvedPort,
    db: resolvedDb,
    user: resolvedUser,
    nodeEnv: process.env.NODE_ENV,
  });
  await sequelize.authenticate();
  console.log('[DB] Connection successful');
}

export async function syncDatabase(): Promise<void> {
  const shouldSync = (process.env.DB_SYNC || 'true').toLowerCase() === 'true';
  if (!shouldSync) {
    return;
  }
  // Using any to satisfy our minimal ambient typings; at runtime this is valid
  await (sequelize as any).sync({ alter: true });
}

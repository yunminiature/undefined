import { Sequelize } from 'sequelize';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT } = process.env;

export const sequelize = new Sequelize(
  POSTGRES_DB || 'postgres',
  POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD || 'postgres',
  {
    host: POSTGRES_HOST || 'localhost',
    port: Number(POSTGRES_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

export async function ensureDatabaseConnection(): Promise<void> {
  console.log('[DB] Connecting to Postgres with', {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
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

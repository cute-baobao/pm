import { env } from '@/env';
import { ExtractTablesWithRelations, sql } from 'drizzle-orm';
import { drizzle, NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import { PgTransaction } from 'drizzle-orm/pg-core';
import ws from 'ws';
import * as schema from './schemas';

type Transaction = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

const createDrizzleClient = () =>
  drizzle({
    connection: env.DATABASE_URL,
    schema,
    ws,
  });

// 使用全局对象存储 Drizzle 实例，防止热重载时重复创建
const globalForDrizzle = globalThis as unknown as {
  drizzle: ReturnType<typeof createDrizzleClient> | undefined;
};

export const db = globalForDrizzle.drizzle ?? createDrizzleClient();

// 在开发环境中，将实例存储到全局对象中，这样热重载时会复用实例
if (env.NODE_ENV !== 'production') {
  globalForDrizzle.drizzle = db;
}

// 封装一个函数用于执行带用户上下文的查询
export async function withUser<T>(
  userId: string,
  callback: (tx: Transaction) => Promise<T>,
) {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_user_id', ${userId}, true)`,
    );
    return callback(tx);
  });
}

export default db;

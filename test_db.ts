import { db } from './src/db/index.js';
import { hotels } from './src/db/schema.js';
async function test() {
  const h = await db.select().from(hotels);
  console.log(h);
  process.exit(0);
}
test();

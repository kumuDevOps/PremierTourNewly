import { db } from '../src/db/index.ts';
import { tours } from '../src/db/schema.ts';

async function clearTours() {
  console.log('Clearing tours...');
  await db.delete(tours).where(null);
  console.log('Tours cleared.');
}

clearTours().then(() => process.exit(0));

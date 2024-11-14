import { deleteDB } from 'idb';

const DB_NAME = 'cutifit-db';

export async function resetDatabase() {
  try {
    await deleteDB(DB_NAME);
    console.log('Database reset successful');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
}